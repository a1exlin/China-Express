"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "@/components/icons"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders")
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast.error("Failed to load orders", {
          description: "Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter)

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update order status")

      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)))

      toast.success("Order status updated", {
        description: `Order #${orderId.slice(-6)} is now ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status", {
        description: "Please try again later.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-2">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-500">Manage and track customer orders</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-lg text-gray-500">No orders found</p>
            {statusFilter !== "all" && (
              <Button variant="outline" onClick={() => setStatusFilter("all")}>
                View All Orders
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Showing {filteredOrders.length} {statusFilter !== "all" ? statusFilter : ""} orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">#{order._id.slice(-6)}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span
                          className={`mr-2 h-2 w-2 rounded-full ${
                            order.status === "completed"
                              ? "bg-green-500"
                              : order.status === "processing"
                                ? "bg-blue-500"
                                : order.status === "cancelled"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                          }`}
                        />
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/admin/orders/${order._id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => handleStatusChange(order._id, value)}
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
