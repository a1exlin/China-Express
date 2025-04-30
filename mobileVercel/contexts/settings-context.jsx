"use client"

import { createContext, useContext, useEffect, useState } from "react"

const SettingsContext = createContext(undefined)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    taxPercentage: 8.25,
    deliveryFee: 3.99,
    serviceCharge: 0,
    minimumOrderAmount: 15,
    restaurantName: "China Express",
    phoneNumber: "(555) 123-4567",
    address: "123 Main Street, Anytown",
    openingHours: "Mon-Sun: 11:00 AM - 10:00 PM",
    enableDelivery: true,
    mapCoordinates: {
      lat: 40.712776,
      lng: -74.005974,
    },
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
    <SettingsContext.Provider
      value={{
        settings,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
