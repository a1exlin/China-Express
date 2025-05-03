"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/auth-context"
import AdminLayout from "@/components/layouts/admin-layout"
import Link from "next/link"

type MenuItem = {
  _id: string
  name: string
  itemCode: string
  description: string
  price: number
  category: string
  image: string
  isAvailable: boolean
}

type Category = {
  _id: string
  id: string
  name: string
}

export default function EditMenuItem() {
  const router = useRouter()
  const { id } = router.query
  const { user, loading } = useAuth()

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    itemCode: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
  })

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        setIsLoading(true)

        // Fetch categories
        const categoriesData = await window.api.getCategories()
        setCategories(categoriesData)

        // Fetch menu item
        const menuItemData = await window.api.getMenuItem(id as string)
        setMenuItem(menuItemData)

        // Set form data
        setFormData({
          name: menuItemData.name,
          itemCode: menuItemData.itemCode,
          description: menuItemData.description,
          price: menuItemData.price.toString(),
          category: menuItemData.category,
          image: menuItemData.image || "",
          isAvailable: menuItemData.isAvailable,
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
        alert("Failed to load menu item")
        router.push("/admin/menu")
      }
    }

    fetchData()
  }, [id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement
      setFormData({
        ...formData,
        [name]: target.checked,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.itemCode || !formData.price || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setIsSaving(true)

      const updatedData = {
        ...formData,
        price: Number.parseFloat(formData.price),
      }

      await window.api.updateMenuItem(id as string, updatedData)

      alert("Menu item updated successfully")
      router.push("/admin/menu")
    } catch (error) {
      console.error("Error updating menu item:", error)
      alert("Failed to update menu item")
      setIsSaving(false)
    }
  }

  if (loading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Menu Item</h1>
          <Link href="/admin/menu" className="text-blue-500 hover:text-blue-700">
            Back to Menu
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemCode">
                  Item Code *
                </label>
                <input
                  type="text"
                  id="itemCode"
                  name="itemCode"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.itemCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isAvailable: e.target.checked,
                    })
                  }
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                  Item is available
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                href="/admin/menu"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
