import { NextResponse } from "next/server"
import User from "@/lib/models/user"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(request) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Please provide current and new password" }, { status: 400 })
    }

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    let decoded
    try {
      // Verify token
      decoded = verify(token, process.env.JWT_SECRET || "your-secret-key")
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Find user by ID
    const user = await User.findById(decoded.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if current password is correct
    const isValid = user.validatePassword(currentPassword)

    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Set new password
    user.setPassword(newPassword)
    await user.save()

    return NextResponse.json({
      message: "Password changed successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
