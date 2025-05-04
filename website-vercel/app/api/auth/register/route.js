import { NextResponse } from "next/server"
import User from "@/lib/models/user"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Please provide all required fields" }, { status: 400 })
    }

    // Check if this is the first user being created
    const userCount = await User.countDocuments()
    const isFirstUser = userCount === 0

    // If not the first user, check if the request is from the first admin
    if (!isFirstUser) {
      // Get token from cookies
      const cookieStore = await cookies()
      const token = cookieStore.get("auth_token")?.value

      if (!token) {
        return NextResponse.json({ error: "Not authorized to create users" }, { status: 401 })
      }

      try {
        // Verify token
        const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key")

        // Check if the user is the first admin
        if (!decoded.isFirstAdmin) {
          return NextResponse.json({ error: "Only the first admin can create new users" }, { status: 403 })
        }
      } catch (error) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      isFirstAdmin: isFirstUser, // First user is the first admin
    })

    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isFirstAdmin: user.isFirstAdmin,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
