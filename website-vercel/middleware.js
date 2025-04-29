import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

export async function middleware(request) {
  // Check if the request is for the admin area
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Public admin routes that don't require authentication
    const publicAdminRoutes = ["/admin/login", "/admin/setup", "/admin/forgot-password"]

    // Check if the current path is a public route or starts with reset-password
    const isPublicRoute =
      publicAdminRoutes.includes(request.nextUrl.pathname) ||
      request.nextUrl.pathname.startsWith("/admin/reset-password")

    if (isPublicRoute) {
      return NextResponse.next()
    }

    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value

    // If there's no token, redirect to login
    if (!token) {
      console.log("No auth token found, redirecting to login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      // Verify token
      const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key")

      // Add user info to request headers for debugging
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-user-id", decoded.id)

      // Token is valid, continue to the admin page
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.log("Invalid token:", error.message)
      // Clear the invalid token
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.set("auth_token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      })
      return response
    }
  }

  // For all other routes, continue
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
