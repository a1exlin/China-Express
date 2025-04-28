import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/user"
import nodemailer from "nodemailer"

export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Please provide an email" }, { status: 400 })
    }

    await dbConnect()

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return NextResponse.json({
        message: "If your email is registered, you will receive a password reset link",
      })
    }

    // Generate reset token
    const resetToken = user.generateResetToken()
    await user.save()

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/reset-password/${resetToken}`

    // Create email message
    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `

    // In a real application, you would send an email here
    // For this example, we'll just log the reset URL
    console.log("Reset URL:", resetUrl)

    // Simulate sending email (in a real app, you would configure a real email service)
    try {
      // Create a test account if no SMTP settings are provided
      const testAccount = await nodemailer.createTestAccount()

      // Create a transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.ethereal.email",
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER || testAccount.user,
          pass: process.env.EMAIL_PASS || testAccount.pass,
        },
      })

      // Send email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"China Express" <admin@chinaexpress.com>',
        to: email,
        subject: "Password Reset",
        html: message,
      })

      console.log("Message sent: %s", info.messageId)
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    } catch (error) {
      console.error("Error sending email:", error)
      // Don't return an error to the client for security reasons
    }

    return NextResponse.json({
      message: "If your email is registered, you will receive a password reset link",
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
