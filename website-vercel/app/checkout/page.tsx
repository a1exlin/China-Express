"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Check, CreditCard, MapPin } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [settings, setSettings] = useState({
    taxPercentage: 8.25,
    deliveryFee: 3.99,
  })
  const [loadingSettings, setLoadingSettings] = useState(true)
  const { cartItems, getCartTotal, clearCart } = useCart()
  const router = useRouter()

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

  // Calculate order summary
  const subtotal = getCartTotal()
  const tax = subtotal * (settings.taxPercentage / 100)
  const deliveryFee = settings.deliveryFee
  const total = subtotal + tax + deliveryFee

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      router.push("/order")
    }
  }, [cartItems, orderPlaced, router])

  const handlePlaceOrder = (e) => {
    e.preventDefault()

    // In a real app, you would process the payment and submit the order here

    // Simulate order processing
    setTimeout(() => {
      setOrderPlaced(true)
      clearCart()
      toast.success("Order placed successfully!", {
        description: "Your order has been received and is being prepared.",
      })
    }, 1500)
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            <CardDescription>
              Thank you for your order. Your food is being prepared and will be on its way shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
              <p className="font-medium">Order #{Math.floor(Math.random() * 90000) + 10000}</p>
              <p className="text-sm text-gray-500">Estimated delivery: 30-45 minutes</p>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h3 className="font-medium">Order Summary</h3>
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/" className="w-full">
              <Button className="w-full bg-red-600 hover:bg-red-700">Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <p className="mb-4">Redirecting to cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handlePlaceOrder}>
            <Tabs defaultValue="delivery" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
                <TabsTrigger value="pickup">Pickup</TabsTrigger>
              </TabsList>

              <TabsContent value="delivery" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" required />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                      <Textarea id="instructions" placeholder="Apartment number, gate code, etc." />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pickup" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pickup Information</CardTitle>
                    <CardDescription>Your order will be available for pickup at our restaurant.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="mb-2 font-medium">Golden Dragon Restaurant</h3>
                      <p className="text-sm text-gray-600">123 Main Street, Anytown</p>
                      <p className="text-sm text-gray-600">Phone: (555) 123-4567</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="pickup-name">Full Name</Label>
                        <Input id="pickup-name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickup-phone">Phone Number</Label>
                        <Input id="pickup-phone" type="tel" required />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      PayPal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "credit-card" && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="expiry-month">Expiry Month</Label>
                        <Input id="expiry-month" placeholder="MM" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiry-year">Expiry Year</Label>
                        <Input id="expiry-year" placeholder="YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name-on-card">Name on Card</Label>
                      <Input id="name-on-card" required />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 text-center md:text-right">
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Place Order
              </Button>
            </div>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
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
          </Card>
        </div>
      </div>
    </div>
  )
}
