"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore"

// Types
export type MenuItem = {
  id: string
  name: string
  price: number
  category: string
  image?: string
  description?: string
  itemCode?: string
  isAvailable?: boolean
  createdAt?: number
  updatedAt?: number
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

// Update the Order type to include orderType and deliveryMethod
export type Order = {
  id: string
  orderNumber?: number
  items: CartItem[]
  total: number
  paymentMethod: "cash" | "credit"
  timestamp: string
  status: "completed" | "cancelled"
  orderType: "in-store" | "pickup" | "delivery"
  deliveryMethod?: "doordash" | "ubereats" | "grubhub" | "other"
  createdAt?: any
}

// New type for order tabs
export type OrderTab = {
  id: string
  name: string
  orderNumber: number
  cart: CartItem[]
  notes?: string
  createdAt: string
}

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase with validation
let app: any
let db: any

try {
  // Check if Firebase is already initialized to prevent duplicate apps
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }
  db = getFirestore(app)
} catch (error) {
  console.error("Firebase initialization error:", error)
}

// Update the initial orders to include orderType
const initialOrders: Order[] = [
  {
    id: "1",
    orderNumber: 1,
    items: [
      { id: "1", menuItemId: "1", name: "Cheeseburger", price: 8.99, quantity: 2 },
      { id: "2", menuItemId: "3", name: "French Fries", price: 3.99, quantity: 1 },
    ],
    total: 21.97,
    paymentMethod: "credit",
    timestamp: "2023-05-01T12:30:00Z",
    status: "completed",
    orderType: "in-store",
  },
  {
    id: "2",
    orderNumber: 2,
    items: [
      { id: "1", menuItemId: "4", name: "Caesar Salad", price: 6.99, quantity: 1 },
      { id: "2", menuItemId: "8", name: "Soda", price: 1.99, quantity: 1 },
    ],
    total: 8.98,
    paymentMethod: "cash",
    timestamp: "2023-05-01T13:15:00Z",
    status: "completed",
    orderType: "in-store",
  },
  {
    id: "3",
    orderNumber: 3,
    items: [
      { id: "1", menuItemId: "7", name: "Chicken Wings", price: 10.99, quantity: 1 },
      { id: "2", menuItemId: "5", name: "Onion Rings", price: 4.99, quantity: 1 },
      { id: "3", menuItemId: "9", name: "Milkshake", price: 4.99, quantity: 2 },
    ],
    total: 25.96,
    paymentMethod: "credit",
    timestamp: "2023-05-01T18:45:00Z",
    status: "completed",
    orderType: "pickup",
  },
  {
    id: "4",
    orderNumber: 4,
    items: [
      { id: "1", menuItemId: "2", name: "Chicken Sandwich", price: 7.99, quantity: 1 },
      { id: "2", menuItemId: "3", name: "French Fries", price: 3.99, quantity: 1 },
      { id: "3", menuItemId: "8", name: "Soda", price: 1.99, quantity: 1 },
    ],
    total: 13.97,
    paymentMethod: "cash",
    timestamp: "2023-05-02T12:10:00Z",
    status: "completed",
    orderType: "delivery",
    deliveryMethod: "doordash",
  },
  {
    id: "5",
    orderNumber: 5,
    items: [
      { id: "1", menuItemId: "6", name: "Veggie Burger", price: 9.99, quantity: 1 },
      { id: "2", menuItemId: "3", name: "French Fries", price: 3.99, quantity: 1 },
    ],
    total: 13.98,
    paymentMethod: "credit",
    timestamp: "2023-05-02T13:30:00Z",
    status: "completed",
    orderType: "delivery",
    deliveryMethod: "ubereats",
  },
]

// Context type
type PosContextType = {
  menuItems: MenuItem[]
  categories: Category[]
  orders: Order[]
  orderTabs: OrderTab[]
  activeTabId: string
  cart: CartItem[] // Current active tab's cart
  isLoading: boolean
  error: string | null
  searchTerm: string
  setSearchTerm: (term: string) => void
  activeCategory: string
  setActiveCategory: (category: string) => void
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
  refreshMenuItems: () => Promise<void>
  // New tab management functions
  createNewTab: (name?: string) => void
  switchTab: (tabId: string) => void
  closeTab: (tabId: string) => void
  updateTabName: (tabId: string, name: string) => void
  getTabTotal: (tabId: string) => number
}

// Create context
const PosContext = createContext<PosContextType | undefined>(undefined)

// Provider component
export function PosProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // New state for order tabs
  const [orderTabs, setOrderTabs] = useState<OrderTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>("")

  // Add a function to determine the next order number based on existing orders
  const determineNextOrderNumber = (existingOrders: Order[]): number => {
    if (existingOrders.length === 0) return 1

    // Find the highest order number from completed orders
    const highestOrderNumber = existingOrders.reduce((highest, order) => {
      // Only use the orderNumber property if it's a reasonable number
      const orderNumber = order.orderNumber && order.orderNumber < 10000 ? order.orderNumber : 0
      return Math.max(highest, orderNumber)
    }, 0)

    return highestOrderNumber + 1
  }

  // Update the state initialization
  const [nextOrderNumber, setNextOrderNumber] = useState<number>(1)

  // Initialize with a default tab
  useEffect(() => {
    if (orderTabs.length === 0) {
      const defaultTab: OrderTab = {
        id: "tab-" + Date.now(),
        name: `Order ${nextOrderNumber}`,
        orderNumber: nextOrderNumber,
        cart: [],
        createdAt: new Date().toISOString(),
      }
      setOrderTabs([defaultTab])
      setActiveTabId(defaultTab.id)

      // Increment the next order number
      setNextOrderNumber((prev) => prev + 1)
      localStorage.setItem("nextOrderNumber", String(nextOrderNumber + 1))
    }
  }, [orderTabs.length, nextOrderNumber])

  // Get the current active tab's cart
  const cart = orderTabs.find((tab) => tab.id === activeTabId)?.cart || []

  // Fetch menu items from Firebase with improved error handling
  const fetchMenuItems = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate Firebase initialization
      if (!db) {
        throw new Error("Firebase database not initialized")
      }

      console.log("Fetching menu items from collection: menuItems")
      const menuItemsCollection = collection(db, "menuItems")
      const menuItemsSnapshot = await getDocs(menuItemsCollection)

      console.log(`Retrieved ${menuItemsSnapshot.docs.length} documents`)

      const menuItemsList: MenuItem[] = menuItemsSnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || "",
          price: data.price || 0,
          category: data.category || "",
          image: data.image || "",
          description: data.description || "",
          itemCode: data.itemCode || "",
          isAvailable: data.isAvailable !== false, // Default to true if not specified
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      })

      setMenuItems(menuItemsList)

      // Extract unique categories from menu items
      const uniqueCategories = Array.from(new Set(menuItemsList.map((item) => item.category)))
        .filter((category) => category) // Filter out empty categories
        .sort() // Sort alphabetically

      setCategories(
        uniqueCategories.map((name) => ({
          id: name,
          name: name,
        })),
      )
    } catch (err) {
      console.error("Error fetching menu items:", err)
      setError(`Failed to load menu items: ${(err as Error).message || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh menu items function
  const refreshMenuItems = async () => {
    await fetchMenuItems()
  }

  // Load data on initial render
  useEffect(() => {
    // We need to add a flag to prevent multiple fetches
    let isMounted = true

    const loadInitialData = async () => {
      try {
        if (isMounted) {
          await fetchMenuItems()
        }
      } catch (error) {
        console.error("Failed to load initial data:", error)
      }
    }

    loadInitialData()

    // Load orders from localStorage
    const storedOrders = localStorage.getItem("orders")
    let loadedOrders: Order[] = []
    if (storedOrders) {
      loadedOrders = JSON.parse(storedOrders)
      setOrders(loadedOrders)
    }

    // Load tabs from localStorage
    const storedTabs = localStorage.getItem("orderTabs")
    if (storedTabs) {
      setOrderTabs(JSON.parse(storedTabs))

      // Set active tab to the first one if it exists
      const tabs = JSON.parse(storedTabs)
      if (tabs.length > 0) {
        setActiveTabId(tabs[0].id)
      }
    }

    // Determine the next order number based on completed orders
    const nextNumber = determineNextOrderNumber(loadedOrders)
    setNextOrderNumber(nextNumber)
    localStorage.setItem("nextOrderNumber", String(nextNumber))

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false
    }
  }, [])

  // Save orders to localStorage when they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [orders])

  // Save tabs to localStorage when they change
  useEffect(() => {
    if (orderTabs.length > 0) {
      localStorage.setItem("orderTabs", JSON.stringify(orderTabs))
    }
  }, [orderTabs])

  // Tab management functions
  const createNewTab = (name?: string) => {
    // Get the current nextOrderNumber value before updating state
    const currentOrderNumber = nextOrderNumber

    const newTab: OrderTab = {
      id: "tab-" + Date.now(),
      name: name || `Order ${currentOrderNumber}`,
      orderNumber: currentOrderNumber,
      cart: [],
      createdAt: new Date().toISOString(),
    }

    setOrderTabs((prev) => [...prev, newTab])
    setActiveTabId(newTab.id)

    // Increment the next order number for future orders
    const newNextOrderNumber = currentOrderNumber + 1
    setNextOrderNumber(newNextOrderNumber)
    localStorage.setItem("nextOrderNumber", String(newNextOrderNumber))
  }

  const switchTab = (tabId: string) => {
    if (orderTabs.some((tab) => tab.id === tabId)) {
      setActiveTabId(tabId)
    }
  }

  const closeTab = (tabId: string) => {
    // Don't allow closing the last tab
    if (orderTabs.length <= 1) return

    setOrderTabs((prev) => prev.filter((tab) => tab.id !== tabId))

    // If we're closing the active tab, switch to another one
    if (activeTabId === tabId) {
      const remainingTabs = orderTabs.filter((tab) => tab.id !== tabId)
      if (remainingTabs.length > 0) {
        setActiveTabId(remainingTabs[0].id)
      }
    }
  }

  const updateTabName = (tabId: string, name: string) => {
    setOrderTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, name } : tab)))
  }

  const getTabTotal = (tabId: string) => {
    const tab = orderTabs.find((tab) => tab.id === tabId)
    if (!tab) return 0

    return tab.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  // Cart functions - updated to work with tabs
  const addToCart = (item: MenuItem) => {
    setOrderTabs((prevTabs) => {
      return prevTabs.map((tab) => {
        if (tab.id !== activeTabId) return tab

        const existingItem = tab.cart.find((cartItem) => cartItem.menuItemId === item.id)

        if (existingItem) {
          // Update existing item quantity
          return {
            ...tab,
            cart: tab.cart.map((cartItem) =>
              cartItem.menuItemId === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
            ),
          }
        } else {
          // Add new item to cart
          return {
            ...tab,
            cart: [
              ...tab.cart,
              {
                id: Date.now().toString(),
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
              },
            ],
          }
        }
      })
    })
  }

  const removeFromCart = (itemId: string) => {
    setOrderTabs((prevTabs) => {
      return prevTabs.map((tab) => {
        if (tab.id !== activeTabId) return tab

        return {
          ...tab,
          cart: tab.cart.filter((item) => item.id !== itemId),
        }
      })
    })
  }

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setOrderTabs((prevTabs) => {
      return prevTabs.map((tab) => {
        if (tab.id !== activeTabId) return tab

        return {
          ...tab,
          cart: tab.cart.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        }
      })
    })
  }

  const clearCart = () => {
    setOrderTabs((prevTabs) => {
      return prevTabs.map((tab) => {
        if (tab.id !== activeTabId) return tab

        return {
          ...tab,
          cart: [],
        }
      })
    })
  }

  // Add a function to save orders to Firebase
  const saveOrderToFirebase = async (order: Order) => {
    try {
      if (!db) {
        throw new Error("Firebase database not initialized")
      }

      const ordersCollection = collection(db, "orders")
      await addDoc(ordersCollection, {
        ...order,
        createdAt: serverTimestamp(),
      })

      console.log("Order saved to Firebase successfully")
      return true
    } catch (error) {
      console.error("Error saving order to Firebase:", error)
      return false
    }
  }

  // Update the completeOrder function to include orderType
  const completeOrder = async (paymentMethod: "cash" | "credit") => {
    const activeTab = orderTabs.find((tab) => tab.id === activeTabId)
    if (!activeTab || activeTab.cart.length === 0) return

    const total = activeTab.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: activeTab.orderNumber,
      items: [...activeTab.cart],
      total,
      paymentMethod,
      timestamp: new Date().toISOString(),
      status: "completed",
      orderType: "in-store", // Set default order type to in-store for POS orders
    }

    // Add to local orders state
    setOrders((prevOrders) => [...prevOrders, newOrder])

    // Save to Firebase
    await saveOrderToFirebase(newOrder)

    // Clear the cart of the active tab
    clearCart()

    // If there are multiple tabs, close this one after completing the order
    if (orderTabs.length > 1) {
      closeTab(activeTabId)
    }
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
    orderTabs,
    activeTabId,
    cart,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
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
    refreshMenuItems,
    createNewTab,
    switchTab,
    closeTab,
    updateTabName,
    getTabTotal,
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
