import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/user"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get token from cookies
    const token = cookies().get("auth_token")?.value

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

    await dbConnect()

    // Get all users (excluding password fields)
    const users = await User.find({}).select("-hashedPassword -salt -resetPasswordToken -resetPasswordExpire")

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
