"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Loader2, Clock, Check } from "@/components/icons"

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [orderIdInput, setOrderIdInput] = useState(orderId || "")
  const [error, setError] = useState("")

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
    }
  }, [orderId])

  const fetchOrder = async (id) => {
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/orders/${id}`)

      if (!res.ok) {
        throw new Error("Order not found")
      }

      const data = await res.json()
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
      setError("Order not found. Please check the order ID and try again.")
      toast.error("Failed to find order", {
        description: "Please check the order ID and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!orderIdInput.trim()) {
      setError("Please enter an order ID")
      return
    }
    fetchOrder(orderIdInput)
  }

  const getStatusStep = (status) => {
    switch (status) {
      case "pending":
        return 1
      case "processing":
        return 2
      case "completed":
        return 3
      case "cancelled":
        return -1
      default:
        return 0
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Track Your Order</h1>
        <div className="mx-auto mb-4 h-1 w-20 bg-secondary"></div>
        <p className="mx-auto max-w-2xl text-gray-600">Enter your order ID to track the status of your order.</p>
      </div>

      <div className="mx-auto max-w-3xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Order</CardTitle>
            <CardDescription>Enter the order ID you received in your confirmation email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                placeholder="Enter order ID"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Track Order
              </Button>
            </form>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : order ? (
          <Card>
            <CardHeader>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <CardTitle>Order #{order._id.slice(-6)}</CardTitle>
                  <CardDescription>
                    Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </CardDescription>
                </div>
                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium capitalize">{order.status}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {order.status !== "cancelled" &&
                (
                  <div className="space-y-6">
                  <h3 className="text-lg font-medium">Order Status</h3>
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>
                    <div
                      className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-secondary transition-all"
                      style={{
                        width: `${
                          order.status === "cancelled"
                            ? "0%"
                            : `${Math.max(0, (getStatusStep(order.status) - 1) * 50)}%`
                        }`,
                      }}
                    ></div>
                    <div className="relative flex justify-between">
                      <div className="flex flex-col items-center">
                        <div
                          className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                            getStatusStep(order.status) >= 1
                              ? "bg-secondary text-white"\
                              : "  >= 1
                              ? "bg-secondary text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {getStatusStep(order.status) >= 1 ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span>1</span>
                          )}
                        </div>
                        <span className="mt-2 text-sm">Order Placed</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                            getStatusStep(order.status) >= 2
                              ? "bg-secondary text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {getStatusStep(order.status) >= 2 ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span>2</span>
                          )}
                        </div>
                        <span className="mt-2 text-sm">Preparing</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                            getStatusStep(order.status) >= 3
                              ? "bg-secondary text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {getStatusStep(order.status) >= 3 ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span>3</span>
                          )}
                        </div>
                        <span className="mt-2 text-sm">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
                )}

              <div>
                <h3 className="mb-4 text-lg font-medium">Order Details</h3>
                <div className="rounded-md border">
                  <div className="divide-y">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between p-4">
                        <div>
                          <span className="font-medium">{item.quantity}x </span>
                          {item.name}
                        </div>
                        <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2 p-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>${order.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Customer Information</h3>
                  <div className="rounded-md border p-4">
                    <p className="font-medium">{order.customerName}</p>
                    <p>{order.customerEmail}</p>
                    <p>{order.customerPhone}</p>
                  </div>
                </div>
                {order.orderType === "delivery" && order.address && (
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Delivery Address</h3>
                    <div className="rounded-md border p-4">
                      <p>{order.address.street}</p>
                      <p>
                        {order.address.city}, {order.address.state} {order.address.zipCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {order.notes && (
                <div>
                  <h3 className="mb-2 text-lg font-medium">Order Notes</h3>
                  <div className="rounded-md border p-4">
                    <p>{order.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-1 h-4 w-4" />
                {order.status === "completed"
                  ? "Your order has been completed"
                  : order.status === "cancelled"
                    ? "This order has been cancelled"
                    : "We're working on your order"}
              </div>
              <Button variant="outline" onClick={() => window.print()}>
                Print Receipt
              </Button>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
