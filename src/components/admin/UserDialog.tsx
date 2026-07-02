"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  id: string
  email: string
  name: string
  staffName: string | null
  role: "ADMIN" | "USER"
}

interface UserDialogProps {
  user?: User
  onClose: () => void
  onSuccess: () => void
}

export function UserDialog({ user, onClose, onSuccess }: UserDialogProps) {
  const isEdit = !!user

  const [form, setForm] = useState({
    email: user?.email ?? "",
    name: user?.name ?? "",
    staffName: user?.staffName ?? "",
    password: "",
    role: user?.role ?? "USER",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = isEdit ? `/api/admin/users/${user!.id}` : "/api/admin/users"
      const method = isEdit ? "PUT" : "POST"

      const body: Record<string, string> = {
        email: form.email,
        name: form.name,
        staffName: form.staffName,
        role: form.role,
      }
      if (!isEdit || form.password) {
        body.password = form.password
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        onSuccess()
        onClose()
      } else {
        setError(data.error)
      }
    } catch {
      setError("通信エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">
            {isEdit ? "ユーザー編集" : "ユーザー追加"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isEdit && (
            <div className="space-y-1">
              <Label htmlFor="email">メールアドレス *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                placeholder="user@example.com"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="name">表示名 *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              placeholder="山田 太郎"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="staffName">
              担当者名
              <span className="text-xs text-muted-foreground ml-1">
                （ExcelのA列と完全一致する名前）
              </span>
            </Label>
            <Input
              id="staffName"
              value={form.staffName}
              onChange={(e) => update("staffName", e.target.value)}
              placeholder="山田"
            />
            <p className="text-xs text-muted-foreground">
              ※ 管理者は空白でも可。一般ユーザーは自分のExcel担当者名と正確に一致させてください
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">
              パスワード {isEdit && <span className="text-xs text-muted-foreground">（変更する場合のみ入力）</span>}
            </Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required={!isEdit}
              placeholder={isEdit ? "変更しない場合は空白" : "8文字以上推奨"}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">権限</Label>
            <Select
              id="role"
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
            >
              <option value="USER">一般ユーザー（自分のデータのみ閲覧）</option>
              <option value="ADMIN">管理者（全データ閲覧・インポート・ユーザー管理）</option>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "保存中..." : isEdit ? "更新" : "追加"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              キャンセル
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
