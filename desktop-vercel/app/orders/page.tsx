"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Search, CreditCard, Banknote, Calendar, Clock, Store, Package, Truck } from "lucide-react"
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, collection, getDocs, query, orderBy, limit, type Timestamp } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import OrderDetailsModal from "@/components/order-details-modal"
import { formatCurrency } from "@/lib/utils"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let app: any
let db: any

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }
  db = getFirestore(app)
} catch (error) {
  console.error("Firebase initialization error:", error)
}

// Types
type OrderItem = {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
}

type Order = {
  id: string
  orderNumber?: number
  items: OrderItem[]
  total: number
  paymentMethod: "cash" | "credit" | "credit-card"
  timestamp: string | Date
  status: "completed" | "cancelled" | "preparing" | "ready" | "delivered"
  orderType: "in-store" | "pickup" | "delivery"
  deliveryMethod?: "doordash" | "ubereats" | "grubhub" | "other"
  createdAt?: Timestamp
  customerName?: string
  customerPhone?: string
  deliveryAddress?: string
  notes?: string
}

// Delivery service icons
const DeliveryServiceIcon = ({ service }: { service: string }) => {
  switch (service) {
    case "doordash":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          DoorDash
        </Badge>
      )
    case "ubereats":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          Uber Eats
        </Badge>
      )
    case "grubhub":
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
          Grubhub
        </Badge>
      )
    default:
      return <Badge variant="outline">Other</Badge>
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("all")
  const [activeDeliveryTab, setActiveDeliveryTab] = useState<string>("all")

  // State for order details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Format date function
  const formatDate = (dateInput: string | Date | Timestamp) => {
    let date: Date

    if (typeof dateInput === "string") {
      date = new Date(dateInput)
    } else if (dateInput instanceof Date) {
      date = dateInput
    } else if (dateInput && typeof dateInput.toDate === "function") {
      // Handle Firebase Timestamp
      date = dateInput.toDate()
    } else {
      date = new Date()
    }

    // Format the date using native JavaScript
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }

    return new Intl.DateTimeFormat("en-US", options).format(date)
  }

  // Handle opening the order details modal
  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  // Fetch orders from Firebase
  const fetchOrders = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!db) {
        throw new Error("Firebase database not initialized")
      }

      const ordersCollection = collection(db, "orders")
      const ordersQuery = query(ordersCollection, orderBy("createdAt", "desc"), limit(100))
      const ordersSnapshot = await getDocs(ordersQuery)

      const ordersList: Order[] = ordersSnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          orderNumber: data.orderNumber || null,
          items: data.items || [],
          total: data.total || 0,
          paymentMethod: data.paymentMethod || "cash",
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || "completed",
          orderType: data.orderType || "in-store",
          deliveryMethod: data.deliveryMethod,
          createdAt: data.createdAt,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          deliveryAddress: data.deliveryAddress,
          notes: data.notes,
        }
      })

      setOrders(ordersList)
      setFilteredOrders(ordersList)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError(`Failed to load orders: ${(err as Error).message || "Unknown error"}`)

      // Load from localStorage as fallback
      const storedOrders = localStorage.getItem("orders")
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders)
        setOrders(parsedOrders)
        setFilteredOrders(parsedOrders)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch orders on initial load
  useEffect(() => {
    fetchOrders()
  }, [])

  // Filter orders based on search, date, and tabs
  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((order) => {
        // Search by order ID or order number
        if (order.id.toLowerCase().includes(term) || (order.orderNumber && order.orderNumber.toString().includes(term)))
          return true

        // Search by items
        if (order.items.some((item) => item.name.toLowerCase().includes(term))) return true

        // Search by payment method
        if (order.paymentMethod.toLowerCase().includes(term)) return true

        // Search by customer name if available
        if (order.customerName && order.customerName.toLowerCase().includes(term)) return true

        return false
      })
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((order) => {
        let orderDate: Date

        if (order.createdAt && typeof order.createdAt.toDate === "function") {
          // Handle Firebase Timestamp
          orderDate = order.createdAt.toDate()
        } else if (typeof order.timestamp === "string") {
          orderDate = new Date(order.timestamp)
        } else if (order.timestamp instanceof Date) {
          orderDate = order.timestamp
        } else {
          return false
        }

        const filterDate = new Date(dateFilter)

        return (
          orderDate.getFullYear() === filterDate.getFullYear() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getDate() === filterDate.getDate()
        )
      })
    }

    // Filter by order type tab
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.orderType === activeTab)

      // Further filter by delivery method if on delivery tab
      if (activeTab === "delivery" && activeDeliveryTab !== "all") {
        filtered = filtered.filter((order) => order.deliveryMethod === activeDeliveryTab)
      }
    }

    setFilteredOrders(filtered)
  }, [searchTerm, dateFilter, activeTab, activeDeliveryTab, orders])

  // Calculate total sales
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0)

  // Get order type icon
  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case "in-store":
        return <Store className="h-4 w-4 mr-1 text-blue-500" />
      case "pickup":
        return <Package className="h-4 w-4 mr-1 text-green-500" />
      case "delivery":
        return <Truck className="h-4 w-4 mr-1 text-orange-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <h1 className="text-xl font-bold">Orders</h1>
          <div className="w-[100px]"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto p-4 flex-1">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredOrders.length ? formatCurrency(totalSales / filteredOrders.length) : formatCurrency(0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Type Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="in-store">In-Store</TabsTrigger>
            <TabsTrigger value="pickup">Pickup</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
          </TabsList>

          {/* Delivery Method Sub-tabs (only show when delivery tab is active) */}
          {activeTab === "delivery" && (
            <div className="mt-2 mb-4">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setActiveDeliveryTab("all")}>
                  All Delivery
                </TabsTrigger>
                <TabsTrigger value="doordash" onClick={() => setActiveDeliveryTab("doordash")}>
                  DoorDash
                </TabsTrigger>
                <TabsTrigger value="ubereats" onClick={() => setActiveDeliveryTab("ubereats")}>
                  Uber Eats
                </TabsTrigger>
                <TabsTrigger value="grubhub" onClick={() => setActiveDeliveryTab("grubhub")}>
                  Grubhub
                </TabsTrigger>
                <TabsTrigger value="other" onClick={() => setActiveDeliveryTab("other")}>
                  Other
                </TabsTrigger>
              </TabsList>
            </div>
          )}

          <TabsContent value={activeTab} className="mt-0">
            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === "all"
                    ? "All Orders"
                    : activeTab === "in-store"
                      ? "In-Store Orders"
                      : activeTab === "pickup"
                        ? "Pickup Orders"
                        : activeDeliveryTab === "all"
                          ? "All Delivery Orders"
                          : `${activeDeliveryTab.charAt(0).toUpperCase() + activeDeliveryTab.slice(1)} Orders`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-center text-destructive p-4">{error}</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4">No orders found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleOpenOrderDetails(order)}
                        >
                          <TableCell className="font-medium">
                            {order.orderNumber ? `#${order.orderNumber}` : order.id.substring(0, 8) + "..."}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              {formatDate(order.timestamp)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getOrderTypeIcon(order.orderType)}
                              <span className="capitalize">{order.orderType}</span>
                              {order.orderType === "delivery" && order.deliveryMethod && (
                                <div className="ml-2">
                                  <DeliveryServiceIcon service={order.deliveryMethod} />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.paymentMethod === "credit" || order.paymentMethod === "credit-card" ? (
                              <div className="flex items-center">
                                <CreditCard className="h-4 w-4 mr-1 text-muted-foreground" />
                                Credit
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Banknote className="h-4 w-4 mr-1 text-muted-foreground" />
                                Cash
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal order={selectedOrder} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
