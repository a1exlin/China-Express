"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoading])

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((cartItem) => cartItem._id === item._id)

      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
        return updatedItems
      } else {
        // Item doesn't exist, add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })

    toast.success("Added to cart", {
      description: `${item.name} has been added to your cart.`,
    })
  }

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id))

    toast.success("Item removed", {
      description: "The item has been removed from your cart.",
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return

    setCartItems((prevItems) => prevItems.map((item) => (item._id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
    toast.success("Cart cleared", {
      description: "All items have been removed from your cart.",
    })
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
