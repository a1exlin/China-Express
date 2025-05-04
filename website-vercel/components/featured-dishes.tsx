"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "@/components/icons"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart, type CartItem } from "@/contexts/cart-context"

interface Dish {
  id: number
  name: string
  description: string
  price: number
  image: string
  _id?: string | number // Adding _id for compatibility with cart items
}

const featuredDishes: Dish[] = [
  {
    id: 1,
    _id: 1, // Adding _id for cart compatibility
    name: "General Tso's Chicken",
    description: "Crispy chicken with a sweet and spicy sauce, served with broccoli and rice.",
    price: 14.99,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    _id: 2,
    name: "Beef with Broccoli",
    description: "Tender beef slices stir-fried with fresh broccoli in a savory brown sauce.",
    price: 15.99,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    _id: 3,
    name: "Shrimp Lo Mein",
    description: "Stir-fried noodles with shrimp, vegetables, and our special sauce.",
    price: 13.99,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    _id: 4,
    name: "Vegetable Fried Rice",
    description: "Wok-fried rice with mixed vegetables, eggs, and our house seasoning.",
    price: 10.99,
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default function FeaturedDishes() {
  const { addToCart } = useCart()

  // Helper function to convert Dish to CartItem
  const handleAddToCart = (dish: Dish) => {
    const cartItem: CartItem = {
      _id: dish._id || dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      image: dish.image,
      description: dish.description,
    }
    addToCart(cartItem)
  }

  return (
    <section className="container mx-auto py-16 px-4">
      <div className="mb-10 text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Our Featured Dishes</h2>
        <div className="mx-auto mb-4 h-1 w-20 bg-secondary"></div>
        <p className="mx-auto max-w-2xl text-gray-600">
          Try our most popular dishes, prepared with authentic recipes and the freshest ingredients.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredDishes.map((dish) => (
          <Card key={dish.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={dish.image || "/placeholder.svg"}
                alt={dish.name}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="mb-1 font-semibold">{dish.name}</h3>
              <p className="mb-3 text-sm text-gray-600 line-clamp-2">{dish.description}</p>
              <p className="text-lg font-bold text-secondary">${dish.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={() => handleAddToCart(dish)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/menu">
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
            View Full Menu
          </Button>
        </Link>
      </div>
    </section>
  )
}
