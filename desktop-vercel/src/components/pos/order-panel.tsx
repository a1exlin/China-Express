"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useSettings } from "@/contexts/settings-context"

type OrderPanelProps = {
  onNewOrder: () => void
}

export default function OrderPanel({ onNewOrder }: OrderPanelProps) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart()
  const { settings } = useSettings()
  const [customerName, setCustomerName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [orderType, setOrderType] = useState("dine-in")

  // Calculate order summary
  const subtotal = getCartTotal()
  const tax = subtotal * (settings.taxPercentage / 100)
  const total = subtotal + tax

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Please add items to the cart before checkout")
      return
    }
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }

    if (paymentMethod === "cash") {
      const amount = Number.parseFloat(paymentAmount)
      if (isNaN(amount) || amount < total) {
        alert("Please enter a valid payment amount")
        return
      }
    }

    setIsProcessing(true)

    try {
      // Create order object
      const orderData = {
        customerName: customerName || "Walk-in Customer",
        items: cartItems.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        tax,
        total,
        paymentMethod,
        orderType,
        status: "completed",
        createdAt: new Date(),
      }

      // Save order to database
      const order = await window.api.createOrder(orderData)

      // Print receipt
      await window.api.printReceipt({
        order,
        change: paymentMethod === "cash" ? Number.parseFloat(paymentAmount) - total : 0,
      })

      // Open cash drawer for cash payments
      if (paymentMethod === "cash") {
        await window.api.openCashDrawer()
      }

      // Reset state
      clearCart()
      setCustomerName("")
      setPaymentMethod("cash")
      setPaymentAmount("")
      setShowPaymentModal(false)
      onNewOrder()

      // Show success message
      alert("Order completed successfully!")
    } catch (error) {
      console.error("Error processing order:", error)
      alert("Failed to process order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Order Type Selection */}
      <div className="p-4 border-b">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              orderType === "dine-in" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setOrderType("dine-in")}
          >
            Dine In
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              orderType === "takeout" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setOrderType("takeout")}
          >
            Takeout
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              orderType === "delivery" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setOrderType("delivery")}
          >
            Delivery
          </button>
        </div>
      </div>

      {/* Customer Name */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Customer Name (Optional)"
          className="w-full p-2 border rounded"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p>Cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700"
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700"
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="w-20 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                <button className="ml-2 text-red-500" onClick={() => removeFromCart(item._id)}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax ({settings.taxPercentage}%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t flex space-x-2">
        <button className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300" onClick={clearCart}>
          Clear
        </button>
        <button className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleCheckout}>
          Checkout
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Payment</h2>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Payment Method</label>
                <div className="flex space-x-2">
                  <button
                    className={`px-4 py-2 rounded ${
                      paymentMethod === "cash" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    Cash
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      paymentMethod === "card" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    Card
                  </button>
                </div>
              </div>

              {paymentMethod === "cash" && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Amount Received</label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    min={total}
                    step="0.01"
                  />
                  {paymentAmount &&
                    !isNaN(Number.parseFloat(paymentAmount)) &&
                    Number.parseFloat(paymentAmount) >= total && (
                      <div className="mt-2 text-right">
                        <span className="text-sm text-gray-600">Change: </span>
                        <span className="font-bold">${(Number.parseFloat(paymentAmount) - total).toFixed(2)}</span>
                      </div>
                    )}
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Complete Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
