import { NextResponse } from "next/server"
import User from "@/lib/models/user"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Please provide email and password" }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if password is correct
    const isValid = user.validatePassword(password)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create token
    const secret = process.env.JWT_SECRET || "your-secret-key"
    const token = sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        isFirstAdmin: user.isFirstAdmin,
      },
      secret,
      { expiresIn: "1d" },
    )

    // Set cookie with proper options
    const cookieStore = await cookies()
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "lax",
    })

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isFirstAdmin: user.isFirstAdmin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
