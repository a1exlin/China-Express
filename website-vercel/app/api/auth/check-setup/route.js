import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/user"

export async function GET() {
  try {
    await dbConnect()

    // Check if any users exist
    const userCount = await User.countDocuments()
    const needsSetup = userCount === 0

    return NextResponse.json({ needsSetup })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
