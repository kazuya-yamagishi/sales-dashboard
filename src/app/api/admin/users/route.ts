import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return null
  }
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      staffName: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 })
  }

  const body = await req.json()
  const { email, name, staffName, password, role } = body

  if (!email || !name || !password) {
    return NextResponse.json(
      { error: "メールアドレス・名前・パスワードは必須です" },
      { status: 400 }
    )
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: "このメールアドレスは既に使用されています" },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      staffName: staffName || null,
      password: hashedPassword,
      role: role === "ADMIN" ? "ADMIN" : "USER",
    },
    select: { id: true, email: true, name: true, staffName: true, role: true, createdAt: true },
  })

  return NextResponse.json({ user }, { status: 201 })
}
