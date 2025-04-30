import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
      // Verify token
      const secret = process.env.JWT_SECRET || "your-secret-key"
      const decoded = verify(token, secret)

      return NextResponse.json({
        user: {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          isFirstAdmin: decoded.isFirstAdmin,
        },
      })
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
