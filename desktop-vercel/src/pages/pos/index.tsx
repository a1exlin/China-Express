"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/auth-context"
import PosLayout from "@/components/layouts/pos-layout"
import MenuSection from "@/components/pos/menu-section"
import OrderPanel from "@/components/pos/order-panel"
import { useCart } from "@/contexts/cart-context"

export default function POS() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { clearCart } = useCart()
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await window.api.getCategories()
        setCategories(categoriesData)
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id)
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleNewOrder = () => {
    clearCart()
  }

  if (loading || isLoading) {
    return (
      <PosLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </PosLayout>
    )
  }

  return (
    <PosLayout>
      <div className="flex h-full">
        {/* Menu Section (Left Side) */}
        <div className="w-2/3 h-full overflow-hidden flex flex-col">
          <div className="bg-white shadow-sm p-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <MenuSection categoryId={activeCategory} />
          </div>
        </div>

        {/* Order Panel (Right Side) */}
        <div className="w-1/3 h-full border-l border-gray-200">
          <OrderPanel onNewOrder={handleNewOrder} />
        </div>
      </div>
    </PosLayout>
  )
}
