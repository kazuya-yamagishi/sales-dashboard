"use client"

import { Select } from "@/components/ui/select"

interface MonthEntry {
  year: number
  month: number
  fileName: string
}

interface MonthSelectorProps {
  months: MonthEntry[]
  selectedYear: number
  selectedMonth: number
  onChange: (year: number, month: number) => void
}

export function MonthSelector({ months, selectedYear, selectedMonth, onChange }: MonthSelectorProps) {
  const currentValue = `${selectedYear}-${selectedMonth}`

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const [y, m] = e.target.value.split("-").map(Number)
    onChange(y, m)
  }

  if (months.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        インポートされたデータがありません
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-muted-foreground">表示月:</label>
      <Select value={currentValue} onChange={handleChange} className="w-40">
        {months.map((m) => (
          <option key={`${m.year}-${m.month}`} value={`${m.year}-${m.month}`}>
            {m.year}年{m.month}月
          </option>
        ))}
      </Select>
    </div>
  )
}
