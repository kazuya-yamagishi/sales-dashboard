import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignOutButton } from "@/components/auth/SignOutButton"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const isAdmin = session.user.role === "ADMIN"

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="font-bold text-lg">
                売上ダッシュボード
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isAdmin ? "全体データ" : "自分のデータ"}
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      href="/admin/import"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Excelインポート
                    </Link>
                    <Link
                      href="/admin/users"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ユーザー管理
                    </Link>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground hidden sm:block">
                {session.user.name}
                {isAdmin && (
                  <span className="ml-1.5 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                    管理者
                  </span>
                )}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
