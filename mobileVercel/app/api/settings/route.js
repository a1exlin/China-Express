import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Settings from "@/lib/models/settings"

export async function GET() {
  try {
    await dbConnect()
    let settings = await Settings.findOne({})

    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings()
      await settings.save()
    }

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    await dbConnect()

    let settings = await Settings.findOne({})

    if (!settings) {
      settings = new Settings(body)
    } else {
      // Update the settings with the new values
      Object.keys(body).forEach((key) => {
        settings[key] = body[key]
      })
      settings.updatedAt = Date.now()
    }

    await settings.save()

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
