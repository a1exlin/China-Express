"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePosContext } from "@/contexts/pos-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  CreditCard,
  Banknote,
  Printer,
  Search,
  Loader2,
  PlusIcon,
  X,
  Edit,
  Save,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Receipt } from "@/components/receipt"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function POS() {
  const router = useRouter()
  const {
    menuItems,
    categories,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    completeOrder,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    refreshMenuItems,
    // New tab-related props
    orderTabs,
    activeTabId,
    createNewTab,
    switchTab,
    closeTab,
    updateTabName,
    getTabTotal,
  } = usePosContext()

  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit">("cash")
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editingTabName, setEditingTabName] = useState("")

  // Refresh menu items on initial load
  useEffect(() => {
    // Only fetch once when the component mounts
    refreshMenuItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Remove refreshMenuItems from dependencies to prevent infinite loop

  // Filter menu items by category and search term
  const filteredItems = menuItems
    .filter((item) => item.isAvailable !== false) // Only show available items
    .filter((item) => activeCategory === "all" || item.category === activeCategory)
    .filter(
      (item) =>
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

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

  // Handle tab editing
  const startEditingTab = (tabId: string, name: string) => {
    setEditingTabId(tabId)
    setEditingTabName(name)
  }

  const saveTabName = () => {
    if (editingTabId && editingTabName.trim()) {
      updateTabName(editingTabId, editingTabName.trim())
      setEditingTabId(null)
      setEditingTabName("")
    }
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
          {/* Search bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <div className="border-b px-4">
              <TabsList className="mb-2">
                <TabsTrigger value="all">All Items</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.name}>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Menu items grid */}
            <TabsContent value={activeCategory} className="mt-0 flex-1">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading menu items...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full text-destructive">
                    <p>{error}</p>
                    <Button variant="outline" onClick={refreshMenuItems} className="ml-2">
                      Retry
                    </Button>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p>No menu items found</p>
                    {searchTerm && (
                      <Button variant="ghost" onClick={() => setSearchTerm("")} className="mt-2">
                        Clear search
                      </Button>
                    )}
                  </div>
                ) : (
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
                          {item.itemCode && <span className="text-xs text-muted-foreground">{item.itemCode}</span>}
                          <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Cart section */}
        <div className="w-1/3 flex flex-col bg-muted/30">
          {/* Order tabs */}
          <div className="border-b">
            <div className="flex items-center p-2 overflow-x-auto">
              <TooltipProvider>
                {orderTabs.map((tab) => (
                  <div key={tab.id} className="flex-shrink-0 mr-1">
                    <div
                      className={`flex items-center rounded-md px-3 py-1.5 text-sm font-medium cursor-pointer ${
                        activeTabId === tab.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => switchTab(tab.id)}
                    >
                      {editingTabId === tab.id ? (
                        <div className="flex items-center">
                          <Input
                            value={editingTabName}
                            onChange={(e) => setEditingTabName(e.target.value)}
                            className="h-6 w-24 px-1 py-0 text-xs"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveTabName()
                              if (e.key === "Escape") setEditingTabId(null)
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              saveTabName()
                            }}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="truncate max-w-[100px]">{tab.name}</span>
                          {getTabTotal(tab.id) > 0 && (
                            <Badge
                              variant="outline"
                              className={`ml-2 ${
                                activeTabId === tab.id ? "bg-primary-foreground/20" : "bg-background"
                              }`}
                            >
                              ${getTabTotal(tab.id).toFixed(2)}
                            </Badge>
                          )}
                          <div className="flex ml-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 ml-1 opacity-60 hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    startEditingTab(tab.id, tab.name)
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Rename tab</TooltipContent>
                            </Tooltip>

                            {orderTabs.length > 1 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 ml-1 opacity-60 hover:opacity-100 text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      closeTab(tab.id)
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Close tab</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </TooltipProvider>

              {/* Add new order button */}
              <Button variant="ghost" size="sm" className="h-8 px-2 flex-shrink-0" onClick={() => createNewTab()}>
                <PlusIcon className="h-4 w-4 mr-1" />
                New Order
              </Button>
            </div>
          </div>

          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />{" "}
              {orderTabs.find((tab) => tab.id === activeTabId)?.name || "Current Order"}
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
