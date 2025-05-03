"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"

type CartItem = {
  _id: string
  name: string
  price: number
  quantity: number
  image?: string
}

type CartContextType = {
  cartItems: CartItem[]
  isLoading: boolean
  addToCart: (item: any) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from AsyncStorage on initial render
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem("cart")
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error("Failed to load cart from AsyncStorage:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem("cart", JSON.stringify(cartItems))
        } catch (error) {
          console.error("Failed to save cart to AsyncStorage:", error)
        }
      }
    }

    saveCart()
  }, [cartItems, isLoading])

  const addToCart = (item: any) => {
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

    Toast.show({
      type: "success",
      text1: "Added to cart",
      text2: `${item.name} has been added to your cart.`,
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id))

    Toast.show({
      type: "success",
      text1: "Item removed",
      text2: "The item has been removed from your cart.",
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return

    setCartItems((prevItems) => prevItems.map((item) => (item._id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
    Toast.show({
      type: "success",
      text1: "Cart cleared",
      text2: "All items have been removed from your cart.",
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
