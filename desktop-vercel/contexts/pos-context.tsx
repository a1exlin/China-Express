"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
export type MenuItem = {
  id: string
  name: string
  price: number
  category: string
  image?: string
}

export type CartItem = {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
}

export type Category = {
  id: string
  name: string
}

export type Order = {
  id: string
  items: CartItem[]
  total: number
  paymentMethod: "cash" | "credit"
  timestamp: string
  status: "completed" | "cancelled"
}

// Initial data
const initialMenuItems: MenuItem[] = [
  { id: "1", name: "Cheeseburger", price: 8.99, category: "burgers" },
  { id: "2", name: "Chicken Sandwich", price: 7.99, category: "sandwiches" },
  { id: "3", name: "French Fries", price: 3.99, category: "sides" },
  { id: "4", name: "Caesar Salad", price: 6.99, category: "salads" },
  { id: "5", name: "Onion Rings", price: 4.99, category: "sides" },
  { id: "6", name: "Veggie Burger", price: 9.99, category: "burgers" },
  { id: "7", name: "Chicken Wings", price: 10.99, category: "appetizers" },
  { id: "8", name: "Soda", price: 1.99, category: "drinks" },
  { id: "9", name: "Milkshake", price: 4.99, category: "drinks" },
  { id: "10", name: "Ice Cream", price: 3.99, category: "desserts" },
  { id: "11", name: "Apple Pie", price: 5.99, category: "desserts" },
  { id: "12", name: "Chicken Tenders", price: 8.99, category: "appetizers" },
]

const initialCategories: Category[] = [
  { id: "1", name: "burgers" },
  { id: "2", name: "sandwiches" },
  { id: "3", name: "sides" },
  { id: "4", name: "salads" },
  { id: "5", name: "appetizers" },
  { id: "6", name: "drinks" },
  { id: "7", name: "desserts" },
]

const initialOrders: Order[] = [
  {
    id: "1",
    items: [
      { id: "1", menuItemId: "1", name: "Cheeseburger", price: 8.99, quantity: 2 },
      { id: "2", menuItemId: "3", name: "French Fries", price: 3.99, quantity: 1 },
    ],
    total: 21.97,
    paymentMethod: "credit",
    timestamp: "2023-05-01T12:30:00Z",
    status: "completed",
  },
  {
    id: "2",
    items: [
      { id: "1", menuItemId: "4", name: "Caesar Salad", price: 6.99, quantity: 1 },
      { id: "2", menuItemId: "8", name: "Soda", price: 1.99, quantity: 1 },
    ],
    total: 8.98,
    paymentMethod: "cash",
    timestamp: "2023-05-01T13:15:00Z",
    status: "completed",
  },
  {
    id: "3",
    items: [
      { id: "1", menuItemId: "7", name: "Chicken Wings", price: 10.99, quantity: 1 },
      { id: "2", menuItemId: "5", name: "Onion Rings", price: 4.99, quantity: 1 },
      { id: "3", menuItemId: "9", name: "Milkshake", price: 4.99, quantity: 2 },
    ],
    total: 25.96,
    paymentMethod: "credit",
    timestamp: "2023-05-01T18:45:00Z",
    status: "completed",
  },
  {
    id: "4",
    items: [
      { id: "1", menuItemId: "2", name: "Chicken Sandwich", price: 7.99, quantity: 1 },
      { id: "2", menuItemId: "3", name: "French Fries", price: 3.99, quantity: 1 },
      { id: "3", menuItemId: "8", name: "Soda", price: 1.99, quantity: 1 },
    ],
    total: 13.97,
    paymentMethod: "cash",
    timestamp: "2023-05-02T12:10:00Z",
    status: "completed",
  },
  {
    id: "5",
    items: [
      { id: "1", menuItemId: "6", name: "Veggie Burger", price: 9.99, quantity: 1 },
      { id: "2", menuItemId: "3", name: "French Fries", price: 3.99, quantity: 1 },
    ],
    total: 13.98,
    paymentMethod: "credit",
    timestamp: "2023-05-02T13:30:00Z",
    status: "completed",
  },
]

// Context type
type PosContextType = {
  menuItems: MenuItem[]
  categories: Category[]
  orders: Order[]
  cart: CartItem[]
  addToCart: (item: MenuItem) => void
  removeFromCart: (itemId: string) => void
  updateCartItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  completeOrder: (paymentMethod: "cash" | "credit") => void
  updateMenuItem: (item: MenuItem) => void
  addMenuItem: (item: MenuItem) => void
  deleteMenuItem: (itemId: string) => void
  addCategory: (category: Category) => void
  deleteCategory: (categoryId: string) => void
}

// Create context
const PosContext = createContext<PosContextType | undefined>(undefined)

// Provider component
export function PosProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [cart, setCart] = useState<CartItem[]>([])

  // Load initial data from localStorage or use defaults
  useEffect(() => {
    const storedMenuItems = localStorage.getItem("menuItems")
    const storedCategories = localStorage.getItem("categories")
    const storedOrders = localStorage.getItem("orders")

    setMenuItems(storedMenuItems ? JSON.parse(storedMenuItems) : initialMenuItems)
    setCategories(storedCategories ? JSON.parse(storedCategories) : initialCategories)
    setOrders(storedOrders ? JSON.parse(storedOrders) : initialOrders)
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (menuItems.length > 0) localStorage.setItem("menuItems", JSON.stringify(menuItems))
    if (categories.length > 0) localStorage.setItem("categories", JSON.stringify(categories))
    if (orders.length > 0) localStorage.setItem("orders", JSON.stringify(orders))
  }, [menuItems, categories, orders])

  // Cart functions
  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.menuItemId === item.id)

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.menuItemId === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        return [
          ...prevCart,
          {
            id: Date.now().toString(),
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
          },
        ]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  // Order functions
  const completeOrder = (paymentMethod: "cash" | "credit") => {
    if (cart.length === 0) return

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total,
      paymentMethod,
      timestamp: new Date().toISOString(),
      status: "completed",
    }

    setOrders((prevOrders) => [...prevOrders, newOrder])
    clearCart()
  }

  // Menu management functions
  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prevItems) => prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }

  const addMenuItem = (newItem: MenuItem) => {
    setMenuItems((prevItems) => [...prevItems, newItem])
  }

  const deleteMenuItem = (itemId: string) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  // Category functions
  const addCategory = (newCategory: Category) => {
    setCategories((prevCategories) => [...prevCategories, newCategory])
  }

  const deleteCategory = (categoryId: string) => {
    setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId))
  }

  const value = {
    menuItems,
    categories,
    orders,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    completeOrder,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    addCategory,
    deleteCategory,
  }

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>
}

// Custom hook to use the context
export function usePosContext() {
  const context = useContext(PosContext)
  if (context === undefined) {
    throw new Error("usePosContext must be used within a PosProvider")
  }
  return context
}
