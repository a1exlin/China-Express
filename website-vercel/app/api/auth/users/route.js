import { NextResponse } from "next/server"
import User from "@/lib/models/user"
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

    let decoded
    try {
      // Verify token
      decoded = verify(token, process.env.JWT_SECRET || "your-secret-key")
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Check if the user is the first admin
    if (!decoded.isFirstAdmin) {
      return NextResponse.json({ error: "Only the first admin can view users" }, { status: 403 })
    }

    // Get all users (excluding password fields)
    const users = await User.find()

    // Filter out sensitive information
    const filteredUsers = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      isFirstAdmin: user.isFirstAdmin,
      createdAt: user.createdAt,
    }))

    return NextResponse.json(filteredUsers)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
