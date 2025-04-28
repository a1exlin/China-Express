import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

export async function middleware(request) {
  // Check if the request is for the admin area
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip authentication check for login, setup, and password reset pages
    if (
      request.nextUrl.pathname.startsWith("/admin/login") ||
      request.nextUrl.pathname.startsWith("/admin/setup") ||
      request.nextUrl.pathname.startsWith("/admin/forgot-password") ||
      request.nextUrl.pathname.startsWith("/admin/reset-password")
    ) {
      return NextResponse.next()
    }

    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value

    // If there's no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      // Verify token
      verify(token, process.env.JWT_SECRET || "your-secret-key")

      // Token is valid, continue to the admin page
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // For all other routes, continue
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
