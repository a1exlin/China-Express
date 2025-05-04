"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, CheckCircle2, Clock, ChefHat, Package, Truck, XCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const initialOrderId = searchParams.get("id") || ""

  const [orderNumber, setOrderNumber] = useState(initialOrderId)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (initialOrderId) {
      trackOrder(initialOrderId)
    }
  }, [initialOrderId])

  const trackOrder = async (id = orderNumber) => {
    if (!id) {
      setError("Please enter an order number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/orders/${id}`)

      if (!response.ok) {
        throw new Error("Order not found")
      }

      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error("Error tracking order:", error)
      setError("Order not found. Please check your order number and try again.")
      toast.error("Order not found", {
        description: "Please check your order number and try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    trackOrder()
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-8 w-8 text-gray-500" />
      case "confirmed":
        return <CheckCircle2 className="h-8 w-8 text-blue-500" />
      case "preparing":
        return <ChefHat className="h-8 w-8 text-yellow-500" />
      case "ready":
        return <Package className="h-8 w-8 text-green-500" />
      case "out-for-delivery":
        return <Truck className="h-8 w-8 text-purple-500" />
      case "delivered":
        return <CheckCircle2 className="h-8 w-8 text-green-600" />
      case "cancelled":
        return <XCircle className="h-8 w-8 text-red-500" />
      default:
        return <Clock className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusText = (status, orderType) => {
    if (orderType === "pickup") {
      switch (status) {
        case "pending":
          return "Order Received"
        case "confirmed":
          return "Order Confirmed"
        case "preparing":
          return "Preparing Your Order"
        case "ready":
          return "Ready for Pickup"
        case "out-for-delivery": // This shouldn't happen for pickup, but just in case
          return "Ready for Pickup"
        case "delivered":
          return "Order Completed"
        case "cancelled":
          return "Cancelled"
        default:
          return "Unknown Status"
      }
    } else {
      switch (status) {
        case "pending":
          return "Order Received"
        case "confirmed":
          return "Order Confirmed"
        case "preparing":
          return "Preparing Your Order"
        case "ready":
          return "Ready for Delivery"
        case "out-for-delivery":
          return "Out for Delivery"
        case "delivered":
          return "Delivered"
        case "cancelled":
          return "Cancelled"
        default:
          return "Unknown Status"
      }
    }
  }

  const getStatusDescription = (status, orderType) => {
    if (orderType === "pickup") {
      switch (status) {
        case "pending":
          return "We've received your order and are processing it."
        case "confirmed":
          return "Your order has been confirmed and will be prepared soon."
        case "preparing":
          return "Our chefs are preparing your delicious meal."
        case "ready":
          return "Your order is ready for pickup at our restaurant."
        case "out-for-delivery": // This shouldn't happen for pickup, but just in case
          return "Your order is ready for pickup at our restaurant."
        case "delivered":
          return "Your order has been picked up. Enjoy your meal!"
        case "cancelled":
          return "Your order has been cancelled."
        default:
          return "Status information unavailable."
      }
    } else {
      switch (status) {
        case "pending":
          return "We've received your order and are processing it."
        case "confirmed":
          return "Your order has been confirmed and will be prepared soon."
        case "preparing":
          return "Our chefs are preparing your delicious meal."
        case "ready":
          return "Your order is ready and will be out for delivery soon."
        case "out-for-delivery":
          return "Your order is on its way to you."
        case "delivered":
          return "Your order has been delivered. Enjoy your meal!"
        case "cancelled":
          return "Your order has been cancelled."
        default:
          return "Status information unavailable."
      }
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Track Your Order</h1>
        <div className="mx-auto mb-4 h-1 w-20 bg-secondary"></div>
        <p className="mx-auto max-w-2xl text-gray-600">Enter your order number to check the status of your order.</p>
      </div>

      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
            <CardDescription>Enter your order number to track your order status.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  placeholder="e.g. ORD-123456-7890"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>
              <Button type="submit" className="mt-6 bg-secondary hover:bg-secondary/90 sm:mt-8" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  "Track Order"
                )}
              </Button>
            </form>

            {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-500">{error}</div>}

            {order && (
              <div className="mt-8">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="font-medium">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
                        {order.orderType === "delivery" ? "Delivery" : "Pickup"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-4 font-medium">Order Status</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                    <div className="space-y-8">
                      <div className="relative flex items-start gap-4 pb-2">
                        <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-200"></div>
                        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                          {getStatusIcon(order.status)}
                        </div>
                        <div className="flex-1 pt-1">
                          <h4 className="font-medium">{getStatusText(order.status, order.orderType)}</h4>
                          <p className="text-sm text-gray-600">{getStatusDescription(order.status, order.orderType)}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {order.updatedAt && `Updated: ${formatDate(order.updatedAt)}`}
                          </p>
                        </div>
                      </div>

                      {order.estimatedDeliveryTime && order.status !== "delivered" && order.status !== "cancelled" && (
                        <div className="relative flex items-start gap-4">
                          <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                            <Clock className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className="font-medium">
                              Estimated {order.orderType === "delivery" ? "Delivery" : "Pickup"}
                            </h4>
                            <p className="text-sm text-gray-600">{formatDate(order.estimatedDeliveryTime)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="mb-4 font-medium">Order Details</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    {order.orderType === "delivery" && (
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

                {order.orderType === "delivery" && order.address && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="mb-2 font-medium">Delivery Address</h3>
                      <p className="text-sm text-gray-600">
                        {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipCode}
                      </p>
                    </div>
                  </>
                )}

                {order.notes && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="mb-2 font-medium">Order Notes</h3>
                      <p className="text-sm text-gray-600">{order.notes}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-gray-500">Need help? Contact us at support@chinaexpress.com</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
