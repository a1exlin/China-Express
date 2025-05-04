import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

type Settings = {
  restaurantName: string
  phoneNumber: string
  address: string
  openingHours: string
}

type Props = {
  settings: Settings
}

export default function HeroSection({ settings }: Props) {
  return (
    <section className="relative bg-black text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Chinese food"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>
      <div className="container relative z-10 mx-auto flex min-h-[600px] flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">China Express</h1>
        <p className="mb-2 text-xl font-medium">Authentic Chinese Cuisine</p>
        <div className="mb-8 h-1 w-20 bg-tertiary"></div>
        <p className="mb-8 max-w-2xl text-lg text-gray-200">
          Experience the rich flavors of traditional Chinese cooking with our carefully crafted dishes, available for
          dine-in, takeout, or delivery.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/menu">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90">
              View Our Menu
            </Button>
          </Link>
          <Link href="/order">
            <Button size="lg" variant="outline" className="border-white hover:bg-white/10">
              Order Online
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
