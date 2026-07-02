"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImportResult {
  success: boolean
  message: string
  year?: number
  month?: number
  count?: number
}

export function ImportForm() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
    setResult(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setResult({ success: true, message: data.message, year: data.year, month: data.month, count: data.count })
        setFile(null)
        if (inputRef.current) inputRef.current.value = ""
      } else {
        setResult({ success: false, message: data.error })
      }
    } catch {
      setResult({ success: false, message: "通信エラーが発生しました" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Excelファイルを選択（.xlsx / .xls）
        </label>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 cursor-pointer"
        />
      </div>

      {file && (
        <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
          選択中: <span className="font-medium text-foreground">{file.name}</span>
          　({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}

      {result && (
        <Alert variant={result.success ? "success" : "destructive"}>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={!file || loading}>
        {loading ? "インポート中..." : "インポート実行"}
      </Button>
    </form>
  )
}
