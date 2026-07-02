import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 })
  }

  const imports = await prisma.importedFile.findMany({
    select: { year: true, month: true, fileName: true, importedAt: true },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  })

  return NextResponse.json({ months: imports })
}
