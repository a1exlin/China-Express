import { NextResponse } from "next/server"
import Order from "@/lib/models/order"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

// Get a specific order
export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Check if it's an order number (starts with ORD-)
    const query = id.startsWith("ORD-") ? { orderNumber: id } : { _id: id }

    const order = await Order.findOne(query)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Update an order (admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if user is authenticated as admin
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
      // Verify token
      verify(token, process.env.JWT_SECRET || "your-secret-key")

      // Find and update the order
      const query = id.startsWith("ORD-") ? { orderNumber: id } : { _id: id }

      const order = await Order.findOneAndUpdate(query, { ...body, updatedAt: Date.now() })

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      return NextResponse.json(order)
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
