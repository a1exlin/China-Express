"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingCart, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/contexts/cart-context"

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("")
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState({})
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const categoriesRes = await fetch("/api/categories")
        const categoriesData = await categoriesRes.json()

        if (categoriesData.length === 0) {
          // If no categories exist, create default ones
          await createDefaultCategories()
          const newCategoriesRes = await fetch("/api/categories")
          const newCategoriesData = await newCategoriesRes.json()
          setCategories(newCategoriesData)
          if (newCategoriesData.length > 0) {
            setActiveTab(newCategoriesData[0].id)
          }
        } else {
          setCategories(categoriesData)
          setActiveTab(categoriesData[0].id)
        }

        // Fetch menu items
        const menuItemsRes = await fetch("/api/menu")
        const menuItemsData = await menuItemsRes.json()

        // Group menu items by category
        const itemsByCategory = {}
        categoriesData.forEach((category) => {
          itemsByCategory[category.id] = menuItemsData.filter((item) => item.category === category.id)
        })

        if (Object.values(itemsByCategory).flat().length === 0) {
          // If no menu items exist, create default ones
          await createDefaultMenuItems()
          const newMenuItemsRes = await fetch("/api/menu")
          const newMenuItemsData = await newMenuItemsRes.json()

          // Group new menu items by category
          categoriesData.forEach((category) => {
            itemsByCategory[category.id] = newMenuItemsData.filter((item) => item.category === category.id)
          })
        }

        setMenuItems(itemsByCategory)
      } catch (error) {
        console.error("Error fetching menu data:", error)
        toast.error("Failed to load menu", {
          description: "Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  async function createDefaultCategories() {
    const defaultCategories = [
      { id: "appetizers", name: "Appetizers", order: 1 },
      { id: "soups", name: "Soups", order: 2 },
      { id: "main-dishes", name: "Main Dishes", order: 3 },
      { id: "rice-noodles", name: "Rice & Noodles", order: 4 },
      { id: "vegetarian", name: "Vegetarian", order: 5 },
      { id: "desserts", name: "Desserts", order: 6 },
      { id: "beverages", name: "Beverages", order: 7 },
    ]

    for (const category of defaultCategories) {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      })
    }
  }

  async function createDefaultMenuItems() {
    const defaultItems = [
      {
        name: "Spring Rolls (2)",
        itemCode: "APP001",
        description: "Crispy rolls filled with vegetables",
        price: 4.99,
        category: "appetizers",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Crab Rangoon (6)",
        itemCode: "APP002",
        description: "Cream cheese and crab meat in crispy wonton",
        price: 6.99,
        category: "appetizers",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Wonton Soup",
        itemCode: "SOU001",
        description: "Clear broth with pork wontons and vegetables",
        price: 3.99,
        category: "soups",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "General Tso's Chicken",
        itemCode: "MAIN001",
        description: "Crispy chicken with a sweet and spicy sauce",
        price: 14.99,
        category: "main-dishes",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Vegetable Fried Rice",
        itemCode: "RICE001",
        description: "Wok-fried rice with mixed vegetables",
        price: 10.99,
        category: "rice-noodles",
        image: "/placeholder.svg?height=200&width=300",
      },
    ]

    for (const item of defaultItems) {
      await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-2">Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Our Menu</h1>
        <div className="mx-auto mb-4 h-1 w-20 bg-secondary"></div>
        <p className="mx-auto max-w-2xl text-gray-600">
          Explore our wide selection of authentic Chinese dishes, prepared with traditional recipes and the freshest
          ingredients.
        </p>
      </div>

      {categories.length > 0 ? (
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8 overflow-x-auto">
            <TabsList className="h-auto flex-wrap justify-start rounded-md bg-gray-100 p-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="rounded-sm data-[state=active]:bg-white data-[state=active]:text-secondary"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">{category.name}</h2>
              {menuItems[category.id]?.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {menuItems[category.id].map((item) => (
                    <Card key={item._id} className="overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <h3 className="mb-1 font-semibold">{item.name}</h3>
                          <span className="text-xs text-gray-500">{item.itemCode}</span>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">{item.description}</p>
                        <p className="text-lg font-bold text-secondary">${item.price.toFixed(2)}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={() => addToCart(item)}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No items available in this category.</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p className="text-center text-gray-500">No menu categories available.</p>
      )}
    </div>
  )
}
