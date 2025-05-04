"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Loader2 } from "@/components/icons"

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchData() {
      try {
        const [menuRes, categoriesRes] = await Promise.all([fetch("/api/menu"), fetch("/api/categories")])

        if (!menuRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const menuData = await menuRes.json()
        const categoriesData = await categoriesRes.json()

        setMenuItems(menuData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load menu", {
          description: "Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredItems =
    activeCategory === "all" ? menuItems : menuItems.filter((item) => item.category === activeCategory)

  const handleAddToCart = (item) => {
    addToCart({
      ...item,
      quantity: 1,
    })
    toast.success(`Added to cart`, {
      description: `${item.name} has been added to your cart.`,
    })
  }

  if (isLoading) {
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
          Explore our wide range of delicious dishes, prepared with the freshest ingredients and served with love.
        </p>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="mb-8 flex flex-wrap justify-center gap-2">
          <TabsTrigger value="all" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
            All Items
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category._id}
              value={category._id}
              className="data-[state=active]:bg-secondary data-[state=active]:text-white"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 text-lg font-semibold">{item.name}</h3>
                    <p className="mb-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <p className="text-lg font-bold text-secondary">${item.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={() => handleAddToCart(item)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No items found in this category.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
