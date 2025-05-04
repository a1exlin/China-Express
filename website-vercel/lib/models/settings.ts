import { firestoreAdmin } from "../firebase-utils"

export interface MapCoordinates {
  lat: number
  lng: number
}

export interface SettingsData {
  taxPercentage: number
  deliveryFee: number
  serviceCharge: number
  minimumOrderAmount: number
  restaurantName: string
  phoneNumber: string
  address: string
  openingHours: string
  enableDelivery: boolean
  mapCoordinates: MapCoordinates
  updatedAt?: number
}

// Default settings
const defaultSettings: SettingsData = {
  taxPercentage: 8.25,
  deliveryFee: 3.99,
  serviceCharge: 0,
  minimumOrderAmount: 0,
  restaurantName: "China Express",
  phoneNumber: "(555) 123-4567",
  address: "123 Main Street, Anytown",
  openingHours: "Mon-Sun: 11:00 AM - 10:00 PM",
  enableDelivery: true,
  mapCoordinates: {
    lat: 40.712776,
    lng: -74.005974,
  },
  updatedAt: Date.now(),
}

// Settings model for Firestore
const Settings = {
  // Find settings
  async findOne(): Promise<SettingsData> {
    try {
      const settingsRef = firestoreAdmin.doc("settings", "global")
      const snapshot = await firestoreAdmin.getDoc(settingsRef)

      if (snapshot.exists) {
        return snapshot.data() as SettingsData
      }

      // If no settings exist, create default settings
      await firestoreAdmin.setDoc(settingsRef, defaultSettings)
      return defaultSettings
    } catch (error: any) {
      throw new Error(`Error finding settings: ${error.message}`)
    }
  },

  // Update settings
  async updateSettings(updateData: Partial<SettingsData>): Promise<SettingsData> {
    try {
      const settingsRef = firestoreAdmin.doc("settings", "global")
      const snapshot = await firestoreAdmin.getDoc(settingsRef)

      let currentSettings: SettingsData
      if (snapshot.exists) {
        currentSettings = snapshot.data() as SettingsData
      } else {
        currentSettings = defaultSettings
      }

      const updatedSettings = {
        ...currentSettings,
        ...updateData,
        updatedAt: Date.now(),
      }

      await firestoreAdmin.updateDoc(settingsRef, updatedSettings)

      return updatedSettings
    } catch (error: any) {
      throw new Error(`Error updating settings: ${error.message}`)
    }
  },
}

export default Settings
