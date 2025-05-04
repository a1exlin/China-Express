import { NextResponse } from "next/server"
import MenuItem from "@/lib/models/menu-item"

export async function GET() {
  try {
    const menuItems = await MenuItem.find()
    return NextResponse.json(menuItems)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const menuItem = await MenuItem.create(body)
    return NextResponse.json(menuItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
