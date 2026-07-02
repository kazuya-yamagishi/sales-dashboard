import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseExcelFile } from "@/lib/excel-parser"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json(
      { error: "ファイルが選択されていません" },
      { status: 400 }
    )
  }

  if (
    !file.name.endsWith(".xlsx") &&
    !file.name.endsWith(".xls")
  ) {
    return NextResponse.json(
      { error: "Excelファイル（.xlsx または .xls）を選択してください" },
      { status: 400 }
    )
  }

  try {
    const buffer = await file.arrayBuffer()
    const parsed = parseExcelFile(buffer)

    if (parsed.rows.length === 0) {
      return NextResponse.json(
        { error: "データが見つかりませんでした。ファイル形式を確認してください" },
        { status: 400 }
      )
    }

    await prisma.$transaction(async (tx) => {
      const existing = await tx.importedFile.findFirst({
        where: { year: parsed.year, month: parsed.month },
      })
      if (existing) {
        await tx.importedFile.delete({ where: { id: existing.id } })
      }

      const importedFile = await tx.importedFile.create({
        data: {
          fileName: file.name,
          sheetName: parsed.sheetName,
          year: parsed.year,
          month: parsed.month,
        },
      })

      await tx.salesData.createMany({
        data: parsed.rows.map((row) => ({
          importedFileId: importedFile.id,
          ...row,
        })),
      })
    })

    return NextResponse.json({
      success: true,
      message: `${parsed.year}年${parsed.month}月のデータをインポートしました（${parsed.rows.length}件）`,
      year: parsed.year,
      month: parsed.month,
      count: parsed.rows.length,
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json(
      { error: "ファイルの読み込みに失敗しました" },
      { status: 500 }
    )
  }
}
