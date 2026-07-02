import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// 初回セットアップ用エンドポイント
// ユーザーが1人もいない場合のみ管理者アカウントを作成します
export async function POST() {
  const userCount = await prisma.user.count()

  if (userCount > 0) {
    return NextResponse.json(
      { error: "既にユーザーが存在します" },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash("admin1234", 12)

  const admin = await prisma.user.create({
    data: {
      email: "matsumoto@po.yamagishi-p.co.jp",
      name: "松本（管理者）",
      staffName: null,
      password: hashedPassword,
      role: "ADMIN",
    },
    select: { id: true, email: true, name: true, role: true },
  })

  return NextResponse.json({
    success: true,
    message: "管理者アカウントを作成しました",
    user: admin,
    note: "初期パスワード: admin1234 — ログイン後すぐに変更してください",
  })
}
