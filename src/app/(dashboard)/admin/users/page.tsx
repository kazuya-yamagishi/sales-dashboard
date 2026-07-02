"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserTable } from "@/components/admin/UserTable"

interface User {
  id: string
  email: string
  name: string
  staffName: string | null
  role: "ADMIN" | "USER"
  createdAt: string
}

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      setUsers(data.users ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ユーザー管理</h1>
        <p className="text-muted-foreground mt-1">
          ログインユーザーの追加・編集・削除を行います
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ユーザー一覧</CardTitle>
          <CardDescription>
            一般ユーザーは「担当者名」がExcelのA列と一致する行のみ閲覧できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : (
            <UserTable
              users={users}
              currentUserId={session?.user?.id ?? ""}
              onRefresh={fetchUsers}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">担当者名の照合について</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            一般ユーザーがログインすると、「担当者名」フィールドと
            Excelデータの担当者列（A列）を<strong>完全一致</strong>で照合し、
            該当する行のみ表示します。
          </p>
          <p>
            ⚠️ 全角・半角、スペースの有無が異なると照合できません。
            Excelの表示名と寸分違わず入力してください。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
