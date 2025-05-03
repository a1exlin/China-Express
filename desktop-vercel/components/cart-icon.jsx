"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"

export default function CartIcon() {
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  return (
    <Button variant="outline" size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-white">
          {cartCount}
        </span>
      )}
    </Button>
  )
}
