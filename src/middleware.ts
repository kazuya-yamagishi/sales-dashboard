import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  if (pathname.startsWith("/login") || pathname.startsWith("/setup")) {
    if (isLoggedIn && pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/admin") && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
