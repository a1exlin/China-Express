import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the auth cookie
    cookies().set("auth_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
