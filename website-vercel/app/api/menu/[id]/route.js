import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import MenuItem from "@/lib/models/menu-item"

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const menuItem = await MenuItem.findById(params.id)

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json(menuItem)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    await dbConnect()

    const menuItem = await MenuItem.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json(menuItem)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const menuItem = await MenuItem.findByIdAndDelete(params.id)

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Menu item deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
