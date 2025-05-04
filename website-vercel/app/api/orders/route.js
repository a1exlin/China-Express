import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/lib/models/order"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import Settings from "@/lib/models/settings"

// Generate a unique order number
function generateOrderNumber() {
  const timestamp = new Date().getTime().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `ORD-${timestamp}-${random}`
}

// Update the POST function to include payment information
export async function POST(request) {
  try {
    const body = await request.json()
    await dbConnect()

    // Check if delivery is enabled when order type is delivery
    if (body.orderType === "delivery") {
      // Get settings
      const settings = await Settings.findOne({})
      if (settings && !settings.enableDelivery) {
        return NextResponse.json({ error: "Delivery is currently not available" }, { status: 400 })
      }
    }

    // Generate a unique order number
    const orderNumber = generateOrderNumber()

    // Create the order with payment information if available
    const order = new Order({
      ...body,
      orderNumber,
      status: "pending",
      paymentIntentId: body.paymentIntentId || null,
      paymentStatus: body.paymentStatus || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Calculate estimated delivery time (30-45 minutes from now)
    const estimatedDeliveryTime = new Date()
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 30 + Math.floor(Math.random() * 15))
    order.estimatedDeliveryTime = estimatedDeliveryTime

    await order.save()

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Get all orders (admin only)
export async function GET(request) {
  try {
    // Check if user is authenticated as admin
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
      // Verify token
      const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key")

      // Connect to database
      await dbConnect()

      // Get query parameters
      const { searchParams } = new URL(request.url)
      const limit = Number.parseInt(searchParams.get("limit") || "50")
      const page = Number.parseInt(searchParams.get("page") || "1")
      const status = searchParams.get("status")

      // Build query
      const query = {}
      if (status) {
        query.status = status
      }

      // Get orders with pagination
      const skip = (page - 1) * limit
      const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

      const total = await Order.countDocuments(query)

      return NextResponse.json({
        orders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
