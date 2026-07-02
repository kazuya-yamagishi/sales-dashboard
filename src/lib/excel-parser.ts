import * as XLSX from "xlsx"

const COL = {
  STAFF_NAME: 0,
  WEEK1_ORDERS: 1,
  WEEK1_PROFIT: 2,
  WEEK1_RATE: 3,
  WEEK2_ORDERS: 4,
  WEEK2_PROFIT: 5,
  WEEK2_RATE: 6,
  WEEK3_ORDERS: 7,
  WEEK3_PROFIT: 8,
  WEEK3_RATE: 9,
  WEEK4_ORDERS: 10,
  WEEK4_PROFIT: 11,
  WEEK4_RATE: 12,
  WEEK5_ORDERS: 13,
  WEEK5_PROFIT: 14,
  WEEK5_RATE: 15,
  MONTH_TOTAL_ORDERS: 16,
  MONTH_TOTAL_PROFIT: 17,
  MONTH_TOTAL_RATE: 18,
  GRAND_TOTAL_ORDERS: 19,
  GRAND_TOTAL_PROFIT: 20,
  GRAND_TOTAL_RATE: 21,
  MONTH_PROFIT_CORRECTION: 22,
  CUMULATIVE_EXPENSES: 23,
  TARGET_ORDERS_MONTH: 32,
  TARGET_PROFIT_MONTH: 33,
  ACHIEVEMENT_RATE_ORDERS: 34,
  ACHIEVEMENT_RATE_PROFIT: 35,
  TARGET_ORDERS_CUMUL: 36,
  TARGET_PROFIT_CUMUL: 37,
  ACHIEVEMENT_RATE_CUMUL_ORDERS: 38,
  ACHIEVEMENT_RATE_CUMUL_PROFIT: 39,
} as const

const DATA_START_ROW = 4

export interface ParsedSalesRow {
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
  monthProfitCorrection: number | null
  cumulativeExpenses: number | null
  targetOrdersMonth: number | null
  targetProfitMonth: number | null
  achievementRateOrders: number | null
  achievementRateProfit: number | null
  targetOrdersCumul: number | null
  targetProfitCumul: number | null
  achievementRateCumulOrders: number | null
  achievementRateCumulProfit: number | null
}

export interface ParseResult {
  sheetName: string
  year: number
  month: number
  rows: ParsedSalesRow[]
}

function toNumber(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null
  if (typeof val === "string" && val.includes("DIV")) return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

export function parseExcelFile(buffer: ArrayBuffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: "array" })

  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]

  const yearMonthMatch = sheetName.match(/(\d{4})\.(\d{1,2})月/)
  const year = yearMonthMatch
    ? parseInt(yearMonthMatch[1])
    : new Date().getFullYear()
  const month = yearMonthMatch
    ? parseInt(yearMonthMatch[2])
    : new Date().getMonth() + 1

  const rawData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    raw: true,
  })

  const rows: ParsedSalesRow[] = []

  for (let i = DATA_START_ROW; i < rawData.length; i++) {
    const row = rawData[i]
    if (!row || row.length === 0) continue

    const staffNameRaw = row[COL.STAFF_NAME]
    if (!staffNameRaw || String(staffNameRaw).trim() === "") continue

    const staffName = String(staffNameRaw).trim()

    rows.push({
      staffName,
      week1Orders: toNumber(row[COL.WEEK1_ORDERS]),
      week1Profit: toNumber(row[COL.WEEK1_PROFIT]),
      week1Rate: toNumber(row[COL.WEEK1_RATE]),
      week2Orders: toNumber(row[COL.WEEK2_ORDERS]),
      week2Profit: toNumber(row[COL.WEEK2_PROFIT]),
      week2Rate: toNumber(row[COL.WEEK2_RATE]),
      week3Orders: toNumber(row[COL.WEEK3_ORDERS]),
      week3Profit: toNumber(row[COL.WEEK3_PROFIT]),
      week3Rate: toNumber(row[COL.WEEK3_RATE]),
      week4Orders: toNumber(row[COL.WEEK4_ORDERS]),
      week4Profit: toNumber(row[COL.WEEK4_PROFIT]),
      week4Rate: toNumber(row[COL.WEEK4_RATE]),
      week5Orders: toNumber(row[COL.WEEK5_ORDERS]),
      week5Profit: toNumber(row[COL.WEEK5_PROFIT]),
      week5Rate: toNumber(row[COL.WEEK5_RATE]),
      monthTotalOrders: toNumber(row[COL.MONTH_TOTAL_ORDERS]),
      monthTotalProfit: toNumber(row[COL.MONTH_TOTAL_PROFIT]),
      monthTotalRate: toNumber(row[COL.MONTH_TOTAL_RATE]),
      grandTotalOrders: toNumber(row[COL.GRAND_TOTAL_ORDERS]),
      grandTotalProfit: toNumber(row[COL.GRAND_TOTAL_PROFIT]),
      grandTotalRate: toNumber(row[COL.GRAND_TOTAL_RATE]),
      monthProfitCorrection: toNumber(row[COL.MONTH_PROFIT_CORRECTION]),
      cumulativeExpenses: toNumber(row[COL.CUMULATIVE_EXPENSES]),
      targetOrdersMonth: toNumber(row[COL.TARGET_ORDERS_MONTH]),
      targetProfitMonth: toNumber(row[COL.TARGET_PROFIT_MONTH]),
      achievementRateOrders: toNumber(row[COL.ACHIEVEMENT_RATE_ORDERS]),
      achievementRateProfit: toNumber(row[COL.ACHIEVEMENT_RATE_PROFIT]),
      targetOrdersCumul: toNumber(row[COL.TARGET_ORDERS_CUMUL]),
      targetProfitCumul: toNumber(row[COL.TARGET_PROFIT_CUMUL]),
      achievementRateCumulOrders: toNumber(row[COL.ACHIEVEMENT_RATE_CUMUL_ORDERS]),
      achievementRateCumulProfit: toNumber(row[COL.ACHIEVEMENT_RATE_CUMUL_PROFIT]),
    })
  }

  return { sheetName, year, month, rows }
}
