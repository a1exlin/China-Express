"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Store, Package, Truck, CreditCard, Banknote, Clock, User, MapPin, Phone } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"
import { Order } from "@/types/order"

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

// Format date function
const formatDate = (dateInput: string | Date | any) => {
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

// Get order type icon and color
const getOrderTypeDisplay = (type: string) => {
  switch (type) {
    case "in-store":
      return {
        icon: <Store className="h-5 w-5 mr-2 text-blue-500" />,
        label: "In-Store",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      }
    case "pickup":
      return {
        icon: <Package className="h-5 w-5 mr-2 text-green-500" />,
        label: "Pickup",
        color: "bg-green-50 text-green-700 border-green-200",
      }
    case "delivery":
      return {
        icon: <Truck className="h-5 w-5 mr-2 text-orange-500" />,
        label: "Delivery",
        color: "bg-orange-50 text-orange-700 border-orange-200",
      }
    default:
      return {
        icon: null,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        color: "",
      }
  }
}

// Get delivery service display
const getDeliveryServiceDisplay = (service?: string) => {
  if (!service) return null

  switch (service) {
    case "doordash":
      return {
        label: "DoorDash",
        color: "bg-red-50 text-red-700 border-red-200",
      }
    case "ubereats":
      return {
        label: "Uber Eats",
        color: "bg-green-50 text-green-700 border-green-200",
      }
    case "grubhub":
      return {
        label: "Grubhub",
        color: "bg-orange-50 text-orange-700 border-orange-200",
      }
    default:
      return {
        label: service.charAt(0).toUpperCase() + service.slice(1),
        color: "bg-gray-50 text-gray-700 border-gray-200",
      }
  }
}

// Get payment method display
const getPaymentMethodDisplay = (method: string) => {
  if (method === "credit" || method === "credit-card") {
    return {
      icon: <CreditCard className="h-5 w-5 mr-2 text-purple-500" />,
      label: "Credit Card",
    }
  } else {
    return {
      icon: <Banknote className="h-5 w-5 mr-2 text-green-500" />,
      label: "Cash",
    }
  }
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null

  const orderType = getOrderTypeDisplay(order.orderType)
  const paymentMethod = getPaymentMethodDisplay(order.paymentMethod)
  const deliveryService = order.deliveryMethod ? getDeliveryServiceDisplay(order.deliveryMethod) : null

  // Calculate subtotal and tax
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.0825 // 8.25% tax rate
  const tax = subtotal * taxRate
  const total = order.total || subtotal + tax

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order {order.orderNumber ? `#${order.orderNumber}` : order.id.substring(0, 8)}</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={orderType.color}>
                <span className="flex items-center">
                  {orderType.icon}
                  {orderType.label}
                </span>
              </Badge>
              {deliveryService && (
                <Badge variant="outline" className={deliveryService.color}>
                  {deliveryService.label}
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{formatDate(order.timestamp)}</span>
            </div>
            <div className="flex items-center">
              <span className="flex items-center text-sm">
                {paymentMethod.icon}
                {paymentMethod.label}
              </span>
            </div>
          </div>

          {/* Customer Info (if available) */}
          {(order.customerName || order.customerPhone || order.deliveryAddress) && (
            <div className="border rounded-md p-3 bg-muted/20">
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                {order.customerName && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{order.customerName}</span>
                  </div>
                )}
                {order.customerPhone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{order.customerPhone}</span>
                  </div>
                )}
                {order.deliveryAddress && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="font-medium mb-2">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-2">
            <div className="flex justify-between text-sm py-1">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span>Tax (8.25%):</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t mt-1">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="border rounded-md p-3 bg-muted/20">
              <h3 className="font-medium mb-1">Notes</h3>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
