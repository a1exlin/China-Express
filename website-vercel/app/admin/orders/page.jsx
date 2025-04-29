"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  Truck,
  XCircle,
  Filter,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isViewingOrder, setIsViewingOrder] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    if (!user) {
      return
    }

    fetchOrders()
  }, [user, pagination.page, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      let url = `/api/orders?page=${pagination.page}&limit=${pagination.limit}`
      if (statusFilter) {
        url += `&status=${statusFilter}`
      }

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await res.json()
      setOrders(data.orders)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders", {
        description: "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    // This would typically search by order number or customer name
    console.log("Searching for:", searchQuery)
    // For now, we'll just filter the orders client-side
    if (searchQuery.trim() === "") {
      fetchOrders()
      return
    }

    const filteredOrders = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setOrders(filteredOrders)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const viewOrder = (order) => {
    setSelectedOrder(order)
    setIsViewingOrder(true)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setIsUpdatingStatus(true)

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error("Failed to update order status")
      }

      const updatedOrder = await res.json()

      // Update the order in the list
      setOrders(orders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)))

      // Update the selected order if it's currently being viewed
      if (selectedOrder && selectedOrder._id === updatedOrder._id) {
        setSelectedOrder(updatedOrder)
      }

      toast.success("Order status updated", {
        description: `Order #${updatedOrder.orderNumber} status changed to ${getStatusText(newStatus)}.`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status", {
        description: "Please try again later.",
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Confirmed
          </Badge>
        )
      case "preparing":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Preparing
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Ready
          </Badge>
        )
      case "out-for-delivery":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Out for Delivery
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-gray-500" />
      case "confirmed":
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />
      case "preparing":
        return <ChefHat className="h-5 w-5 text-yellow-500" />
      case "ready":
        return <Package className="h-5 w-5 text-green-500" />
      case "out-for-delivery":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "confirmed":
        return "Confirmed"
      case "preparing":
        return "Preparing"
      case "ready":
        return "Ready"
      case "out-for-delivery":
        return "Out for Delivery"
      case "delivered":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return "Unknown"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const getNextStatus = (currentStatus, orderType) => {
    if (orderType === "pickup") {
      const pickupStatusFlow = {
        pending: "confirmed",
        confirmed: "preparing",
        preparing: "ready",
        ready: "delivered", // For pickup, we go directly from ready to delivered (picked up)
      }
      return pickupStatusFlow[currentStatus] || null
    } else {
      const deliveryStatusFlow = {
        pending: "confirmed",
        confirmed: "preparing",
        preparing: "ready",
        ready: "out-for-delivery",
        "out-for-delivery": "delivered",
      }
      return deliveryStatusFlow[currentStatus] || null
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">View and manage customer orders.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="border-secondary text-secondary" onClick={() => router.push("/admin")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage and track customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by order #, name, or email"
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                  Search
                </Button>
              </form>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        <span className="capitalize">{order.orderType}</span>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => viewOrder(order)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500">No orders found.</p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isViewingOrder} onOpenChange={setIsViewingOrder}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Order #{selectedOrder.orderNumber}</span>
                  {getStatusBadge(selectedOrder.status)}
                </DialogTitle>
                <DialogDescription>Placed on {formatDate(selectedOrder.createdAt)}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-medium">Customer Information</h3>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p>
                      <span className="font-medium">Name:</span> {selectedOrder.customerName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedOrder.customerEmail}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {selectedOrder.customerPhone}
                    </p>
                  </div>
                </div>

                {selectedOrder.orderType === "delivery" && selectedOrder.address && (
                  <div>
                    <h3 className="mb-2 font-medium">Delivery Address</h3>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p>
                        {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state}{" "}
                        {selectedOrder.address.zipCode}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="mb-2 font-medium">Order Details</h3>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-medium">Order Type:</span>
                      <span className="capitalize">{selectedOrder.orderType}</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-medium">Payment Method:</span>
                      <span className="capitalize">{selectedOrder.paymentMethod.replace("-", " ")}</span>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      {selectedOrder.orderType === "delivery" && (
                        <div className="flex justify-between">
                          <span>Delivery Fee</span>
                          <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <h3 className="mb-2 font-medium">Order Notes</h3>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p>{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="mb-2 font-medium">Order Status</h3>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="font-medium">{getStatusText(selectedOrder.status)}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Last updated: {formatDate(selectedOrder.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <div className="flex gap-2">
                  {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                    <Button
                      variant="destructive"
                      onClick={() => updateOrderStatus(selectedOrder._id, "cancelled")}
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus ? "Updating..." : "Cancel Order"}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsViewingOrder(false)}>
                    Close
                  </Button>
                  {getNextStatus(selectedOrder.status, selectedOrder.orderType) && (
                    <Button
                      className="bg-secondary hover:bg-secondary/90"
                      onClick={() =>
                        updateOrderStatus(
                          selectedOrder._id,
                          getNextStatus(selectedOrder.status, selectedOrder.orderType),
                        )
                      }
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        `Mark as ${getStatusText(getNextStatus(selectedOrder.status, selectedOrder.orderType))}`
                      )}
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
