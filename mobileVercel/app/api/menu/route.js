import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import MenuItem from "@/lib/models/menu-item"

export async function GET() {
  try {
    await dbConnect()
    const menuItems = await MenuItem.find({})
    return NextResponse.json(menuItems)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    await dbConnect()

    const menuItem = new MenuItem(body)
    await menuItem.save()

    return NextResponse.json(menuItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
