import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const yearParam = searchParams.get("year")
  const monthParam = searchParams.get("month")

  const year = yearParam ? parseInt(yearParam) : new Date().getFullYear()
  const month = monthParam ? parseInt(monthParam) : new Date().getMonth() + 1

  const importedFile = await prisma.importedFile.findFirst({
    where: { year, month },
    include: {
      salesData: {
        where:
          session.user.role === "ADMIN"
            ? {}
            : { staffName: session.user.staffName ?? "__no_match__" },
        orderBy: { staffName: "asc" },
      },
    },
  })

  if (!importedFile) {
    return NextResponse.json({ data: null, message: "データがありません" })
  }

  return NextResponse.json({
    year,
    month,
    sheetName: importedFile.sheetName,
    data: importedFile.salesData,
  })
}
