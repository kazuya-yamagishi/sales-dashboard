import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ImportForm } from "@/components/admin/ImportForm"

export default function ImportPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Excelインポート</h1>
        <p className="text-muted-foreground mt-1">
          売上速報Excelファイルをアップロードしてデータを取り込みます
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ファイルアップロード</CardTitle>
          <CardDescription>
            同じ月のデータが既にある場合は上書きされます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImportForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">対応ファイル形式</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>・ファイル形式：.xlsx / .xls（Excelファイル）</p>
          <p>・シート名：<code className="bg-muted px-1.5 py-0.5 rounded text-xs">2026.4月確定</code> のような形式（年月を自動認識）</p>
          <p>・5行目以降に担当者データが入っているファイル</p>
          <p>・A列に担当者名、B〜V列に週別・合計データが入っているファイル</p>
        </CardContent>
      </Card>
    </div>
  )
}
