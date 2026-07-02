import type { Metadata } from "next"
import { Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "売上ダッシュボード",
  description: "売上速報データ管理システム",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
