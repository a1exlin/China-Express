import { NextResponse } from "next/server"
import User from "@/lib/models/user"
import crypto from "crypto"

export async function POST(request, { params }) {
  try {
    const { token } = params
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: "Please provide a new password" }, { status: 400 })
    }

    // Hash the token from the URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    // Find user with the token and check if token is expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
    })

    if (!user || user.resetPasswordExpire < Date.now()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Set new password
    user.setPassword(password)

    // Clear reset token fields
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    return NextResponse.json({
      message: "Password has been reset successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
