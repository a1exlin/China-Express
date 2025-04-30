import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Middleware runs in Edge Runtime – jwtVerify works here, jsonwebtoken does not
export async function middleware(request) {
  const pathname = request.nextUrl.pathname

  // Only protect /admin routes except these exceptions
  const publicPaths = ["/admin/login", "/admin/setup", "/admin/forgot-password", "/admin/reset-password"]

  // Allow listed paths to continue through
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Protect all other /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
      await jwtVerify(token, secret) // Throws if invalid or expired

      // Token valid
      return NextResponse.next()
    } catch (error) {
      console.error("Token verification failed in middleware:", error.message)
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Let everything else through
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
