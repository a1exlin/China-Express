import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/user"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

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
      return NextResponse.json({ error: "Only the first admin can delete users" }, { status: 403 })
    }

    await dbConnect()

    // Find user to delete
    const userToDelete = await User.findById(id)

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent deleting the first admin
    if (userToDelete.isFirstAdmin) {
      return NextResponse.json({ error: "Cannot delete the first admin" }, { status: 403 })
    }

    // Delete user
    await User.findByIdAndDelete(id)

    return NextResponse.json({
      message: "User deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
