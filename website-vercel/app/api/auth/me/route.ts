import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { firestoreAdmin } from "@/lib/firebase-utils"

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
      const decoded = verify(token, secret) as { id: string; name: string; email: string; isFirstAdmin: boolean }

      // Get user data from Firestore
      const userRef = firestoreAdmin.doc("users", decoded.id)
      const userSnap = await firestoreAdmin.getDoc(userRef)

      if (!userSnap.exists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json({
        user: {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          isFirstAdmin: decoded.isFirstAdmin,
        },
      })
    } catch (error: any) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error: any) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
