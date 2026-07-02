"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { SalesTable } from "@/components/dashboard/SalesTable"
import { MonthSelector } from "@/components/dashboard/MonthSelector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MonthEntry {
  year: number
  month: number
  fileName: string
}

interface SalesData {
  id: string
  staffName: string
  week1Orders: number | null
  week1Profit: number | null
  week1Rate: number | null
  week2Orders: number | null
  week2Profit: number | null
  week2Rate: number | null
  week3Orders: number | null
  week3Profit: number | null
  week3Rate: number | null
  week4Orders: number | null
  week4Profit: number | null
  week4Rate: number | null
  week5Orders: number | null
  week5Profit: number | null
  week5Rate: number | null
  monthTotalOrders: number | null
  monthTotalProfit: number | null
  monthTotalRate: number | null
  grandTotalOrders: number | null
  grandTotalProfit: number | null
  grandTotalRate: number | null
  achievementRateProfit: number | null
}

function formatYen(value: number | null): string {
  if (value === null || value === undefined) return "—"
  return new Intl.NumberFormat("ja-JP", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatRate(value: number | null): string {
  if (value === null || value === undefined) return "—"
  return `${(value * 100).toFixed(1)}%`
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [months, setMonths] = useState<MonthEntry[]>([])
  const [salesData, setSalesData] = useState<SalesData[] | null>(null)
  const [sheetName, setSheetName] = useState("")
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    fetch("/api/sales/months")
      .then((r) => r.json())
      .then((d) => {
        const list: MonthEntry[] = d.months ?? []
        setMonths(list)
        if (list.length > 0) {
          setSelectedYear(list[0].year)
          setSelectedMonth(list[0].month)
        }
      })
  }, [])

  const fetchSales = useCallback(async (year: number, month: number) => {
    setLoading(true)
    setNoData(false)
    try {
      const res = await fetch(`/api/sales?year=${year}&month=${month}`)
      const d = await res.json()
      if (!d.data) {
        setNoData(true)
        setSalesData([])
      } else {
        setSalesData(d.data)
        setSheetName(d.sheetName ?? "")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (months.length > 0) {
      fetchSales(selectedYear, selectedMonth)
    } else {
      setLoading(false)
    }
  }, [selectedYear, selectedMonth, months.length, fetchSales])

  function handleMonthChange(year: number, month: number) {
    setSelectedYear(year)
    setSelectedMonth(month)
  }

  const totalOrders = salesData?.reduce((sum, r) => sum + (r.monthTotalOrders ?? 0), 0) ?? 0
  const totalProfit = salesData?.reduce((sum, r) => sum + (r.monthTotalProfit ?? 0), 0) ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isAdmin ? "売上速報 — 全体データ" : "売上速報 — 自分のデータ"}
          </h1>
          {sheetName && (
            <p className="text-sm text-muted-foreground mt-1">
              シート: {sheetName}
            </p>
          )}
        </div>
        <MonthSelector
          months={months}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onChange={handleMonthChange}
        />
      </div>

      {isAdmin && salesData && salesData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                当月合計受注
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatYen(totalOrders)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                当月合計粗利
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{formatYen(totalProfit)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                担当者数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{salesData.length} 名</p>
            </CardContent>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : noData || months.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">データがありません</p>
            {isAdmin ? (
              <p className="text-sm">
                <a href="/admin/import" className="text-primary underline">
                  Excelインポート
                </a>
                からデータをアップロードしてください
              </p>
            ) : (
              <p className="text-sm">管理者にデータのインポートを依頼してください</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <SalesTable
          data={salesData ?? []}
          year={selectedYear}
          month={selectedMonth}
        />
      )}
    </div>
  )
}
