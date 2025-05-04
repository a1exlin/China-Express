import { firestoreAdmin } from "../firebase-utils"
import { generateId } from "./category"

export interface OrderItem {
  menuItemId?: string
  name: string
  price: number
  quantity: number
}

export interface OrderAddress {
  street?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface OrderData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address?: OrderAddress
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod?: "credit-card" | "paypal" | "cash"
  paymentIntentId?: string | null
  paymentStatus?: "pending" | "paid" | "failed" | "refunded"
  orderType?: "pickup"
  status?: "pending" | "confirmed" | "preparing" | "ready" | "cancelled" | "completed"
  notes?: string
  createdAt?: number
  updatedAt?: number
}

// Generate a unique order number
function generateOrderNumber(): string {
  const timestamp = new Date().getTime().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `ORD-${timestamp}-${random}`
}

// Order model for Firestore
const Order = {
  // Find all orders
  async find(
    queryOptions: {
      status?: string
      limit?: number
      skip?: number
    } = {},
  ): Promise<Array<OrderData & { _id: string }>> {
    try {
      const ordersCollection = firestoreAdmin.collection("orders")
      let ordersQuery

      // Apply filters
      if (queryOptions.status) {
        ordersQuery = firestoreAdmin.query(
          ordersCollection,
          firestoreAdmin.where("status", "==", queryOptions.status),
          firestoreAdmin.orderBy("createdAt", "desc"),
        )
      } else {
        // Default sort by createdAt
        ordersQuery = firestoreAdmin.query(ordersCollection, firestoreAdmin.orderBy("createdAt", "desc"))
      }

      // Apply pagination
      if (queryOptions.limit) {
        ordersQuery = firestoreAdmin.query(ordersQuery, firestoreAdmin.limit(queryOptions.limit))
      }

      const snapshot = await firestoreAdmin.getDocs(ordersQuery)
      const orders: Array<OrderData & { _id: string }> = []

      snapshot.forEach((doc) => {
        orders.push({
          _id: doc.id,
          ...(doc.data() as OrderData),
        })
      })

      // Apply skip for pagination (Firestore doesn't have a skip option, so we do it client-side)
      if (queryOptions.skip) {
        return orders.slice(queryOptions.skip)
      }

      return orders
    } catch (error: any) {
      throw new Error(`Error finding orders: ${error.message}`)
    }
  },

  // Find order by ID or order number
  async findOne(criteria: { orderNumber?: string; _id?: string }): Promise<(OrderData & { _id: string }) | null> {
    try {
      if (criteria.orderNumber) {
        const ordersCollection = firestoreAdmin.collection("orders")
        const orderQuery = firestoreAdmin.query(
          ordersCollection,
          firestoreAdmin.where("orderNumber", "==", criteria.orderNumber),
          firestoreAdmin.limit(1),
        )
        const snapshot = await firestoreAdmin.getDocs(orderQuery)

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          return {
            _id: doc.id,
            ...(doc.data() as OrderData),
          }
        }
      } else if (criteria._id) {
        const orderRef = firestoreAdmin.doc("orders", criteria._id)
        const snapshot = await firestoreAdmin.getDoc(orderRef)

        if (snapshot.exists) {
          return {
            _id: criteria._id,
            ...(snapshot.data() as OrderData),
          }
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error finding order: ${error.message}`)
    }
  },

  // Create a new order
  async create(orderData: OrderData): Promise<OrderData & { _id: string }> {
    try {
      // Generate a unique ID
      const id = generateId()

      // Generate a unique order number if not provided
      const orderNumber = orderData.orderNumber || generateOrderNumber()

      const newOrder = {
        ...orderData,
        orderNumber,
        paymentStatus: orderData.paymentStatus || "pending",
        orderType: orderData.orderType || "pickup",
        status: orderData.status || "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      await firestoreAdmin.setDoc(firestoreAdmin.doc("orders", id), newOrder)

      return {
        _id: id,
        ...newOrder,
      }
    } catch (error: any) {
      throw new Error(`Error creating order: ${error.message}`)
    }
  },

  // Find order by ID or order number and update
  async findOneAndUpdate(
    criteria: { orderNumber?: string; _id?: string },
    updateData: Partial<OrderData>,
  ): Promise<(OrderData & { _id: string }) | null> {
    try {
      let orderId: string | null = null
      let orderData: OrderData | null = null

      if (criteria.orderNumber) {
        const ordersCollection = firestoreAdmin.collection("orders")
        const orderQuery = firestoreAdmin.query(
          ordersCollection,
          firestoreAdmin.where("orderNumber", "==", criteria.orderNumber),
          firestoreAdmin.limit(1),
        )
        const snapshot = await firestoreAdmin.getDocs(orderQuery)

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          orderId = doc.id
          orderData = doc.data() as OrderData
        }
      } else if (criteria._id) {
        orderId = criteria._id
        const snapshot = await firestoreAdmin.getDoc(firestoreAdmin.doc("orders", orderId))

        if (snapshot.exists) {
          orderData = snapshot.data() as OrderData
        }
      }

      if (orderId && orderData) {
        const updatedOrder = {
          ...updateData,
          updatedAt: Date.now(),
        }

        await firestoreAdmin.updateDoc(firestoreAdmin.doc("orders", orderId), updatedOrder)

        const updatedSnapshot = await firestoreAdmin.getDoc(firestoreAdmin.doc("orders", orderId))
        return {
          _id: orderId,
          ...(updatedSnapshot.data() as OrderData),
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error updating order: ${error.message}`)
    }
  },

  // Count documents
  async countDocuments(criteria: { status?: string } = {}): Promise<number> {
    try {
      const ordersCollection = firestoreAdmin.collection("orders")
      let ordersQuery

      if (criteria.status) {
        ordersQuery = firestoreAdmin.query(ordersCollection, firestoreAdmin.where("status", "==", criteria.status))
      } else {
        ordersQuery = ordersCollection
      }

      const snapshot = await firestoreAdmin.getDocs(ordersQuery)
      return snapshot.size
    } catch (error: any) {
      throw new Error(`Error counting orders: ${error.message}`)
    }
  },
}

export default Order
