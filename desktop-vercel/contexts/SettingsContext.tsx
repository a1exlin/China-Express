"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { API_URL } from "../config"

type Settings = {
  taxPercentage: number
  deliveryFee: number
  serviceCharge: number
  minimumOrderAmount: number
  restaurantName: string
  phoneNumber: string
  address: string
  openingHours: string
  enableDelivery: boolean
  mapCoordinates: {
    lat: number
    lng: number
  }
}

type SettingsContextType = {
  settings: Settings
  loading: boolean
}

const defaultSettings: Settings = {
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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`${API_URL}/settings`)
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
