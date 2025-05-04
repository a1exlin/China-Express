"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Loader2, Minus, Plus, Trash2 } from "@/components/icons"

export default function OrderPage() {
  const router = useRouter()
  const { cartItems, isLoading, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart()
  const [settings, setSettings] = useState({
    taxPercentage: 8.25,
    deliveryFee: 3.99,
    enableDelivery: true,
  })
  const [orderType, setOrderType] = useState("delivery")
  const [loadingSettings, setLoadingSettings] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings")
        const data = await res.json()
        setSettings(data)
      } catch (error) {
        console.error("Error fetching settings:", error)
      } finally {
        setLoadingSettings(false)
      }
    }

    fetchSettings()
  }, [])

  // Safely calculate values with null checks
  const subtotal = getCartTotal ? getCartTotal() : 0
  const tax = subtotal * (settings.taxPercentage / 100)
  const deliveryFee = settings.enableDelivery && orderType === "delivery" ? settings.deliveryFee : 0
  const total = subtotal + tax + deliveryFee

  if (isLoading || loadingSettings) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-2">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md text-center">
          <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-6 text-gray-600">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/menu">
            <Button className="bg-secondary hover:bg-secondary/90">Browse Our Menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Your Order</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="mb-4 flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="w-20 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => removeFromCart(item._id || item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/menu">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
              <Button variant="ghost" className="text-secondary" onClick={clearCart}>
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({settings.taxPercentage}%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" className="w-full">
                <Button className="w-full bg-secondary hover:bg-secondary/90">Proceed to Checkout</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
