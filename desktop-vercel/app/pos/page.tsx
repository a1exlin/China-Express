"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePosContext } from "@/contexts/pos-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, CreditCard, Banknote, Printer } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Receipt } from "@/components/receipt"

export default function POS() {
  const router = useRouter()
  const { menuItems, categories, cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, completeOrder } =
    usePosContext()

  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit">("cash")

  // Filter menu items by category
  const filteredItems =
    activeCategory === "all" ? menuItems : menuItems.filter((item) => item.category === activeCategory)

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) return
    setCheckoutDialogOpen(true)
  }

  // Handle payment
  const handlePayment = (method: "cash" | "credit") => {
    setPaymentMethod(method)
    completeOrder(method)
    setCheckoutDialogOpen(false)
    setReceiptDialogOpen(true)
  }

  // Handle print receipt
  const handlePrintReceipt = () => {
    window.print()
    setReceiptDialogOpen(false)
  }

  return (
    <div className="flex flex-col h-screen">
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
          <h1 className="text-xl font-bold">POS Terminal</h1>
          <div className="w-[100px]"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Menu section */}
        <div className="w-2/3 flex flex-col border-r">
          {/* Categories */}
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b px-4">
              <TabsList className="mb-2">
                <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
                  All Items
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.name} onClick={() => setActiveCategory(category.name)}>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Menu items grid */}
            <TabsContent value={activeCategory} className="mt-0 flex-1">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                  {filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToCart(item)}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                          {item.image ? (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Cart section */}
        <div className="w-1/3 flex flex-col bg-muted/30">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" /> Current Order
            </h2>
          </div>

          {/* Cart items */}
          <ScrollArea className="flex-1">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-2" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 border rounded bg-background">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Cart total and actions */}
          <div className="p-4 border-t bg-background">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={clearCart} disabled={cart.length === 0}>
                Clear Cart
              </Button>
              <Button onClick={handleCheckout} disabled={cart.length === 0}>
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>Select a payment method to complete the order.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => handlePayment("cash")}
            >
              <Banknote className="h-8 w-8 mb-2" />
              Cash
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => handlePayment("credit")}
            >
              <CreditCard className="h-8 w-8 mb-2" />
              Credit Card
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setCheckoutDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Complete</DialogTitle>
            <DialogDescription>Your order has been processed successfully.</DialogDescription>
          </DialogHeader>
          <div className="border rounded p-4 bg-white">
            <Receipt items={cart} total={cartTotal} paymentMethod={paymentMethod} />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setReceiptDialogOpen(false)}>
              Close
            </Button>
            <Button type="button" onClick={handlePrintReceipt} className="flex items-center">
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
