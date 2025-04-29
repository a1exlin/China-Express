"use client"

import { MapPin, Phone } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

export default function ContactInfo() {
  const { settings, loading } = useSettings()

  if (loading) {
    return (
      <address className="not-italic">
        <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          Loading...
        </p>
        <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          Loading...
        </p>
      </address>
    )
  }

  return (
    <address className="not-italic">
      <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4" />
        {settings.address}
      </p>
      <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
        <Phone className="h-4 w-4" />
        {settings.phoneNumber}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Hours:</span> {settings.openingHours}
      </p>
    </address>
  )
}
