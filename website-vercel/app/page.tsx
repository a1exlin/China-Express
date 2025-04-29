"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Clock, MapPin, Phone, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FeaturedDishes from "@/components/featured-dishes"
import HeroSection from "@/components/hero-section"

export default function Home() {
  const [settings, setSettings] = useState({
    restaurantName: "China Express",
    phoneNumber: "(555) 123-4567",
    address: "123 Main Street, Anytown",
    openingHours: "Mon-Sun: 11:00 AM - 10:00 PM",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings")
        const data = await res.json()
        if (data) {
          setSettings(data)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection settings={settings} />

      {/* Quick Info Section */}
      <section className="container mx-auto grid grid-cols-1 gap-4 px-4 py-8 md:grid-cols-3 md:gap-6">
        <Card className="bg-white shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-tertiary p-3">
              <Clock className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-medium">Opening Hours</h3>
              <p className="text-sm text-muted-foreground">{settings.openingHours}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-tertiary p-3">
              <Phone className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-medium">Call For Order</h3>
              <p className="text-sm text-muted-foreground">{settings.phoneNumber}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-tertiary p-3">
              <MapPin className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-medium">Our Location</h3>
              <p className="text-sm text-muted-foreground">{settings.address}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">{settings.restaurantName}</h2>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-tertiary text-tertiary" />
                ))}
              </div>
              <p className="mb-6 text-gray-700">
                Welcome to {settings.restaurantName}, where authentic Chinese cuisine meets modern dining experience.
                For over 20 years, we've been serving the community with traditional recipes passed down through
                generations, using only the freshest ingredients and traditional cooking techniques.
              </p>
              <div className="flex gap-4">
                <Button className="bg-secondary hover:bg-secondary/90">View Our Menu</Button>
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                  Book A Table
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] overflow-hidden rounded-lg md:h-auto">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <FeaturedDishes />

      {/* Order Online CTA */}
      <section className="bg-gradient-to-r from-secondary to-secondary/80 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Order?</h2>
          <p className="mx-auto mb-8 max-w-2xl">
            Enjoy our delicious meals from the comfort of your home. We offer quick delivery and easy online ordering.
          </p>
          <Link href="/menu">
            <Button size="lg" className="bg-tertiary text-secondary hover:bg-tertiary/90">
              Order Online Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
