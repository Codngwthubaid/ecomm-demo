import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

const protectedRoutes = ["/checkout", "/orders", "/profile", "/dashboard"]
const authRoutes = ["/login", "/register"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Verify token
  const user = token ? verifyToken(token) : null

  // Redirect to login if accessing protected route without valid token
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to home if accessing auth routes with valid token
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
