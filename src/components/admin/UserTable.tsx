"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserDialog } from "./UserDialog"

interface User {
  id: string
  email: string
  name: string
  staffName: string | null
  role: "ADMIN" | "USER"
  createdAt: string
}

interface UserTableProps {
  users: User[]
  currentUserId: string
  onRefresh: () => void
}

export function UserTable({ users, currentUserId, onRefresh }: UserTableProps) {
  const [editUser, setEditUser] = useState<User | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  async function handleDelete(user: User) {
    if (!confirm(`「${user.name}」を削除してよいですか？`)) return

    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" })
    if (res.ok) {
      onRefresh()
    } else {
      const data = await res.json()
      alert(data.error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setAddOpen(true)}>
          + ユーザー追加
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">名前</th>
              <th className="px-4 py-3 text-left font-semibold">メールアドレス</th>
              <th className="px-4 py-3 text-left font-semibold">担当者名（Excel照合）</th>
              <th className="px-4 py-3 text-left font-semibold">権限</th>
              <th className="px-4 py-3 text-right font-semibold">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  {user.name}
                  {user.id === currentUserId && (
                    <span className="ml-2 text-xs text-muted-foreground">（あなた）</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  {user.staffName ? (
                    <code className="text-xs bg-muted px-2 py-0.5 rounded">{user.staffName}</code>
                  ) : (
                    <span className="text-muted-foreground text-xs">未設定</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role === "ADMIN" ? "管理者" : "一般"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditUser(user)}
                  >
                    編集
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user)}
                    disabled={user.id === currentUserId}
                  >
                    削除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {addOpen && (
        <UserDialog
          onClose={() => setAddOpen(false)}
          onSuccess={() => { setAddOpen(false); onRefresh() }}
        />
      )}

      {editUser && (
        <UserDialog
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => { setEditUser(null); onRefresh() }}
        />
      )}
    </div>
  )
}
