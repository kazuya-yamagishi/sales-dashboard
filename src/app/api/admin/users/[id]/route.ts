import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return null
  return session
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { name, staffName, password, role } = body

  const updateData: Record<string, unknown> = { name, role: role === "ADMIN" ? "ADMIN" : "USER" }
  if (staffName !== undefined) updateData.staffName = staffName || null
  if (password) {
    updateData.password = await bcrypt.hash(password, 12)
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, email: true, name: true, staffName: true, role: true, createdAt: true },
  })

  return NextResponse.json({ user })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 })
  }

  const { id } = await params

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "自分自身は削除できません" },
      { status: 400 }
    )
  }

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
