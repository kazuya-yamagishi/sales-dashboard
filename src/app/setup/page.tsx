"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  async function handleSetup() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/setup", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setResult({ ok: true, message: data.message + "\n初期パスワード: admin1234" })
      } else {
        setResult({ ok: false, message: data.error })
      }
    } catch {
      setResult({ ok: false, message: "通信エラーが発生しました" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">初回セットアップ</h1>
          <p className="text-muted-foreground mt-1">売上ダッシュボード</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>管理者アカウント作成</CardTitle>
            <CardDescription>
              この操作はユーザーが一人もいない場合のみ実行できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>・メールアドレス: <strong>matsumoto@po.yamagishi-p.co.jp</strong></p>
              <p>・初期パスワード: <strong>admin1234</strong></p>
              <p>・権限: 管理者</p>
            </div>

            {result && (
              <Alert variant={result.ok ? "success" : "destructive"}>
                <AlertDescription className="whitespace-pre-line">{result.message}</AlertDescription>
              </Alert>
            )}

            {!result?.ok && (
              <Button onClick={handleSetup} disabled={loading} className="w-full">
                {loading ? "作成中..." : "管理者アカウントを作成する"}
              </Button>
            )}

            {result?.ok && (
              <Button
                onClick={() => (window.location.href = "/login")}
                className="w-full"
              >
                ログイン画面へ
              </Button>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          ⚠️ ログイン後すぐにパスワードを変更してください
        </p>
      </div>
    </div>
  )
}
