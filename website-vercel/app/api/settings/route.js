import { NextResponse } from "next/server"
import Settings from "@/lib/models/settings"

export async function GET() {
  try {
    const settings = await Settings.findOne()
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()

    const settings = await Settings.updateSettings(body)
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
