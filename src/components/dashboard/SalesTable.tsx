"use client"

import { Badge } from "@/components/ui/badge"

interface SalesRow {
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

interface SalesTableProps {
  data: SalesRow[]
  year: number
  month: number
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

function WeekCell({ orders, profit }: { orders: number | null; profit: number | null }) {
  return (
    <td className="px-3 py-2 whitespace-nowrap">
      <div className="text-xs text-muted-foreground">受注: {formatYen(orders)}</div>
      <div className="text-xs font-medium">粗利: {formatYen(profit)}</div>
    </td>
  )
}

export function SalesTable({ data, year, month }: SalesTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {year}年{month}月のデータがありません
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold sticky left-0 bg-muted/50 border-r border-border min-w-[100px]">
              担当
            </th>
            <th className="px-3 py-3 text-left font-semibold border-r border-border">第1週</th>
            <th className="px-3 py-3 text-left font-semibold border-r border-border">第2週</th>
            <th className="px-3 py-3 text-left font-semibold border-r border-border">第3週</th>
            <th className="px-3 py-3 text-left font-semibold border-r border-border">第4週</th>
            <th className="px-3 py-3 text-left font-semibold border-r border-border">第5週</th>
            <th className="px-3 py-3 text-left font-semibold bg-blue-50 border-r border-border">
              当月合計<br />
              <span className="text-xs text-muted-foreground">受注 / 粗利</span>
            </th>
            <th className="px-3 py-3 text-left font-semibold bg-green-50 border-r border-border">
              累計合計<br />
              <span className="text-xs text-muted-foreground">受注 / 粗利</span>
            </th>
            <th className="px-3 py-3 text-center font-semibold">粗利<br />達成率</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, idx) => (
            <tr
              key={row.id}
              className={`hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/10"}`}
            >
              <td className="px-4 py-3 font-medium sticky left-0 bg-background border-r border-border">
                {row.staffName}
              </td>
              <WeekCell orders={row.week1Orders} profit={row.week1Profit} />
              <WeekCell orders={row.week2Orders} profit={row.week2Profit} />
              <WeekCell orders={row.week3Orders} profit={row.week3Profit} />
              <WeekCell orders={row.week4Orders} profit={row.week4Profit} />
              <WeekCell orders={row.week5Orders} profit={row.week5Profit} />
              <td className="px-3 py-2 bg-blue-50/50 border-r border-border">
                <div className="text-xs text-muted-foreground">受注: {formatYen(row.monthTotalOrders)}</div>
                <div className="text-sm font-semibold text-blue-700">粗利: {formatYen(row.monthTotalProfit)}</div>
                <div className="text-xs text-muted-foreground">率: {formatRate(row.monthTotalRate)}</div>
              </td>
              <td className="px-3 py-2 bg-green-50/50 border-r border-border">
                <div className="text-xs text-muted-foreground">受注: {formatYen(row.grandTotalOrders)}</div>
                <div className="text-sm font-semibold text-green-700">粗利: {formatYen(row.grandTotalProfit)}</div>
                <div className="text-xs text-muted-foreground">率: {formatRate(row.grandTotalRate)}</div>
              </td>
              <td className="px-3 py-2 text-center">
                {row.achievementRateProfit !== null ? (
                  <Badge
                    variant={row.achievementRateProfit >= 1 ? "success" : "destructive"}
                  >
                    {formatRate(row.achievementRateProfit)}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
