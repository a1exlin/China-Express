"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"

type MenuItemType = {
  _id: string
  name: string
  itemCode: string
  description: string
  price: number
  category: string
  image: string
  isAvailable: boolean
}

type MenuSectionProps = {
  categoryId: string
}

export default function MenuSection({ categoryId }: MenuSectionProps) {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!categoryId) return

      try {
        setLoading(true)
        const items = await window.api.getMenuItems()
        const filteredItems = items.filter((item: MenuItemType) => item.category === categoryId && item.isAvailable)
        setMenuItems(filteredItems)
      } catch (error) {
        console.error("Error fetching menu items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [categoryId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (menuItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <svg className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>No items available in this category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {menuItems.map((item) => (
        <button
          key={item._id}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          onClick={() => addToCart(item)}
        >
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            {item.image ? (
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">No Image</div>
            )}
          </div>
          <div className="p-3">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
              <span className="text-sm text-gray-500">{item.itemCode}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
            <div className="mt-2 font-bold text-blue-600">${item.price.toFixed(2)}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
