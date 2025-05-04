"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, MapPin, CreditCard } from "lucide-react"
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
import { useSettings } from "@/contexts/settings-context"
import { StripePaymentWrapper } from "@/components/stripe-payment-element"

// Define types for cart items and settings
interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
}

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
}

interface FormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  address: Address
  notes: string
}

interface Settings {
  taxPercentage: number
  deliveryFee: number
  enableDelivery: boolean
  restaurantName: string
  address: string
  phoneNumber: string
}

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [orderType, setOrderType] = useState("delivery")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([])
  const [orderNumber, setOrderNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const { cartItems, getCartTotal, clearCart } = useCart() as {
    cartItems: CartItem[]
    getCartTotal: () => number
    clearCart: () => void
  }
  const { settings, loading: loadingSettings } = useSettings() as {
    settings: Settings
    loading: boolean
  }
  const router = useRouter()
  const searchParams = useSearchParams()

  // Form state
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    notes: "",
  })

  // Store form data in session storage to persist across redirects
  useEffect(() => {
    // Load saved form data from session storage
    const savedFormData = sessionStorage.getItem("checkoutFormData")
    const savedOrderType = sessionStorage.getItem("checkoutOrderType")

    if (savedFormData) {
      setFormData(JSON.parse(savedFormData))
    }

    if (savedOrderType) {
      setOrderType(savedOrderType)
    }
  }, [])

  // Save form data when it changes
  useEffect(() => {
    sessionStorage.setItem("checkoutFormData", JSON.stringify(formData))
    sessionStorage.setItem("checkoutOrderType", orderType)
  }, [formData, orderType])

  // Calculate order summary
  const subtotal = getCartTotal()
  const tax = subtotal * (settings.taxPercentage / 100)
  const deliveryFee = orderType === "delivery" ? settings.deliveryFee : 0
  const total = subtotal + tax + deliveryFee

  // Check for payment status on page load
  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent")
    const paymentStatus = searchParams.get("redirect_status")
    const savedOrderData = sessionStorage.getItem("pendingOrderData")

    if (paymentIntentId && paymentStatus && savedOrderData) {
      setIsCheckingPayment(true)

      const checkPaymentStatus = async () => {
        try {
          // Verify payment status with your backend
          const verifyResponse = await fetch(`/api/payment/verify-payment?payment_intent=${paymentIntentId}`)

          if (!verifyResponse.ok) {
            throw new Error("Failed to verify payment")
          }

          const verifyData = await verifyResponse.json()

          if (verifyData.status === "succeeded") {
            // Payment succeeded, create the order
            const orderData = JSON.parse(savedOrderData)

            const response = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...orderData,
                paymentIntentId,
                paymentStatus: "paid",
              }),
            })

            if (!response.ok) {
              throw new Error("Failed to place order")
            }

            const data = await response.json()

            // Save the ordered items
            if (cartItems.length > 0) {
              setOrderedItems([...cartItems])
            } else {
              // If cart is empty (due to page refresh), try to use saved items
              const savedItems = sessionStorage.getItem("orderedItems")
              if (savedItems) {
                setOrderedItems(JSON.parse(savedItems))
              }
            }

            setOrderNumber(data.orderNumber)
            setOrderPlaced(true)
            clearCart()

            // Clean up session storage
            sessionStorage.removeItem("pendingOrderData")
            sessionStorage.removeItem("checkoutFormData")
            sessionStorage.removeItem("checkoutOrderType")

            toast.success("Payment successful! Order placed.", {
              description: "Your order has been received and is being prepared.",
            })
          } else {
            // Payment failed or is pending
            toast.error("Payment was not completed", {
              description: "Please try again or use a different payment method.",
            })
          }
        } catch (error) {
          console.error("Error verifying payment:", error)
          toast.error("Failed to verify payment", {
            description: "Please contact customer support with your payment confirmation.",
          })
        } finally {
          setIsCheckingPayment(false)
        }
      }

      checkPaymentStatus()
    }
  }, [searchParams, cartItems, clearCart])

  // Redirect to cart if empty and not checking payment
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced && !isCheckingPayment) {
      // Check if we have saved items
      const savedItems = sessionStorage.getItem("orderedItems")
      if (!savedItems) {
        // Only redirect if we don't have saved items (not after payment)
        const timer = setTimeout(() => {
          router.push("/order")
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [cartItems, orderPlaced, router, isCheckingPayment])

  useEffect(() => {
    if (!settings.enableDelivery) {
      setOrderType("pickup")
    }
  }, [settings.enableDelivery])

  // Fix the handleInputChange function to use proper TypeScript typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => {
        // Create a properly typed copy of the nested object
        const parentKey = parent as keyof typeof prev
        const parentObj = prev[parentKey]

        // Handle the case where parentObj might be any type
        if (typeof parentObj === "object" && parentObj !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value,
            },
          }
        }

        // Fallback for unexpected types
        return prev
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const [clientSecret, setClientSecret] = useState("")
  const [orderDataForStripe, setOrderDataForStripe] = useState<Record<string, any> | null>(null)

  const validateForm = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast.error("Please fill in all required fields")
      return false
    }

    if (orderType === "delivery" && (!formData.address.street || !formData.address.city || !formData.address.zipCode)) {
      toast.error("Please provide a complete delivery address")
      return false
    }

    return true
  }

  // Fix the handlePlaceOrder function to use proper TypeScript typing
  const handlePlaceOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Save the current cart items before clearing
      const items = cartItems.map((item) => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      // Save ordered items to session storage in case of redirect
      sessionStorage.setItem("orderedItems", JSON.stringify(cartItems))
      setOrderedItems([...cartItems])

      // Create order object
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        address: orderType === "delivery" ? formData.address : null,
        items,
        subtotal,
        tax,
        deliveryFee,
        total,
        paymentMethod,
        orderType,
        notes: formData.notes,
      }

      if (paymentMethod === "cash") {
        // For cash payments, proceed with the original flow
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        if (!response.ok) {
          throw new Error("Failed to place order")
        }

        const data = await response.json()

        // Set order placed to true BEFORE clearing the cart
        setOrderPlaced(true)
        setOrderNumber(data.orderNumber)
        clearCart()

        // Clean up session storage
        sessionStorage.removeItem("pendingOrderData")
        sessionStorage.removeItem("checkoutFormData")
        sessionStorage.removeItem("checkoutOrderType")

        toast.success("Order placed successfully!", {
          description: "Your order has been received and is being prepared.",
        })
      } else if (paymentMethod === "credit-card") {
        // For credit card payments, create a payment intent first
        // The actual order will be created after payment confirmation
        const paymentMetadata = {
          customerEmail: formData.customerEmail,
          orderType,
        }

        // Create a payment intent
        const paymentResponse = await fetch("/api/payment/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: total,
            metadata: paymentMetadata,
          }),
        })

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json()
          throw new Error(errorData.error || "Failed to initialize payment")
        }

        const { clientSecret } = await paymentResponse.json()

        // Save order data to session storage for after redirect
        sessionStorage.setItem("pendingOrderData", JSON.stringify(orderData))

        setClientSecret(clientSecret)
        setOrderDataForStripe(orderData as Record<string, any>)
        toast.success("Ready for payment", {
          description: "Please complete your payment with Stripe.",
        })
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order", {
        description: "Please try again or contact customer support.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fix the handlePaymentSuccess function to use proper TypeScript typing
  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Create a properly typed object for the request body
      const orderPayload = {
        ...(orderDataForStripe as Record<string, any>),
        paymentIntentId: paymentIntent.id,
        paymentStatus: "paid",
      }

      // Create the order after successful payment
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      })

      if (!response.ok) {
        throw new Error("Failed to place order")
      }

      const data = await response.json()

      // Set order placed to true BEFORE clearing the cart
      setOrderPlaced(true)
      setOrderNumber(data.orderNumber)
      clearCart()

      // Clean up session storage
      sessionStorage.removeItem("pendingOrderData")
      sessionStorage.removeItem("checkoutFormData")
      sessionStorage.removeItem("checkoutOrderType")

      toast.success("Payment successful! Order placed.", {
        description: "Your order has been received and is being prepared.",
      })
    } catch (error) {
      console.error("Error creating order after payment:", error)
      toast.error("Payment successful, but order creation failed", {
        description: "Please contact customer support with your payment confirmation.",
      })
    }
  }

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error)
    toast.error("Payment failed", {
      description: error.message || "Please try again or use a different payment method.",
    })
    setIsSubmitting(false)
  }

  if (isCheckingPayment) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
          </div>
          <p className="text-lg font-medium">Verifying your payment...</p>
          <p className="text-sm text-muted-foreground">Please wait while we confirm your order.</p>
        </div>
      </div>
    )
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
              <p className="font-medium">Order #{orderNumber}</p>
              <p className="text-sm text-gray-500">Estimated delivery: 30-45 minutes</p>
            </div>
            <Separator className="my-4" />
            {orderedItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Order Summary</h3>
                {orderedItems.map((item, index) => (
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
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Link href={`/track-order?id=${orderNumber}`} className="w-full">
              <Button className="w-full bg-secondary hover:bg-secondary/90">Track Your Order</Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (cartItems.length === 0 && !sessionStorage.getItem("orderedItems")) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <p className="mb-4">Redirecting to cart...</p>
        </div>
      </div>
    )
  }

  if (loadingSettings) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <p className="mb-4">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          {/* Customer Information Section */}
          {settings.enableDelivery ? (
            <Tabs defaultValue="delivery" value={orderType} onValueChange={setOrderType} className="w-full">
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
                        <Label htmlFor="customerName">Full Name</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">Phone Number</Label>
                        <Input
                          id="customerPhone"
                          name="customerPhone"
                          type="tel"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address.street">Street Address</Label>
                      <Input
                        id="address.street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="address.city">City</Label>
                        <Input
                          id="address.city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address.state">State</Label>
                        <Input
                          id="address.state"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address.zipCode">ZIP Code</Label>
                        <Input
                          id="address.zipCode"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Delivery Instructions (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Apartment number, gate code, etc."
                      />
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
                      <h3 className="mb-2 font-medium">{settings.restaurantName}</h3>
                      <p className="text-sm text-gray-600">{settings.address}</p>
                      <p className="text-sm text-gray-600">Phone: {settings.phoneNumber}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Full Name</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">Phone Number</Label>
                        <Input
                          id="customerPhone"
                          name="customerPhone"
                          type="tel"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Special Instructions (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special instructions for your order"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            // When delivery is disabled, only show pickup option
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Pickup Information</CardTitle>
                <CardDescription>Your order will be available for pickup at our restaurant.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 font-medium">{settings.restaurantName}</h3>
                  <p className="text-sm text-gray-600">{settings.address}</p>
                  <p className="text-sm text-gray-600">Phone: {settings.phoneNumber}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Full Name</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for your order"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div
                  className={`flex items-center space-x-2 rounded-lg border p-4 ${paymentMethod === "credit-card" ? "border-secondary bg-secondary/5" : ""}`}
                >
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pay with Stripe
                      <span className="text-xs text-muted-foreground">(Credit/Debit cards and more)</span>
                    </div>
                  </Label>
                </div>
                <div
                  className={`flex items-center space-x-2 rounded-lg border p-4 ${paymentMethod === "cash" ? "border-secondary bg-secondary/5" : ""}`}
                >
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cash on {orderType === "delivery" ? "Delivery" : "Pickup"}
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* Stripe Payment Element - Show immediately when credit card is selected */}
              {paymentMethod === "credit-card" && (
                <div className="mt-6">
                  {clientSecret ? (
                    <StripePaymentWrapper
                      clientSecret={clientSecret}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      amount={total}
                    />
                  ) : (
                    <div className="p-4 border rounded-md bg-gray-50">
                      <p className="text-sm text-center text-muted-foreground">
                        Complete your information above and click "Continue to Payment" to proceed with Stripe checkout.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Place Order Button */}
          <div className="mt-8 text-center md:text-right">
            <Button onClick={handlePlaceOrder} className="bg-secondary hover:bg-secondary/90" disabled={isSubmitting}>
              {isSubmitting
                ? "Processing..."
                : paymentMethod === "credit-card" && !clientSecret
                  ? "Continue to Payment"
                  : "Place Order"}
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length > 0 && (
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
                    <span>Tax ({settings.taxPercentage}%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {orderType === "delivery" && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
