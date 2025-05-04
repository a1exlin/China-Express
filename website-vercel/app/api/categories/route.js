import { NextResponse } from "next/server"
import Category from "@/lib/models/category"

export async function GET() {
  try {
    const categories = await Category.find()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const category = await Category.create(body)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
