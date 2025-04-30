import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Category from "@/lib/models/category"

export async function GET() {
  try {
    await dbConnect()
    const categories = await Category.find({}).sort({ order: 1 })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    await dbConnect()

    const category = new Category(body)
    await category.save()

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
