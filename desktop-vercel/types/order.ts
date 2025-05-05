// Shared types for the application
export type OrderItem = {
    id: string
    menuItemId: string
    name: string
    price: number
    quantity: number
  }
  
  export type Order = {
    id: string
    orderNumber?: number
    items: OrderItem[]
    total: number
    paymentMethod: "cash" | "credit" | "credit-card"
    timestamp: string | Date
    status: "completed" | "cancelled" | "preparing" | "ready" | "delivered"
    orderType: "in-store" | "pickup" | "delivery"
    deliveryMethod?: "doordash" | "ubereats" | "grubhub" | "other"
    createdAt?: any // Using any for Firebase Timestamp compatibility
    customerName?: string
    customerPhone?: string
    deliveryAddress?: string
    notes?: string
  }
  