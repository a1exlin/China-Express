"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { API_URL } from "../../config"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"

type Settings = {
  _id: string
  restaurantName: string
  address: string
  phoneNumber: string
  email: string
  openingHours: string
  deliveryFee: number
  minOrderAmount: number
  maxDeliveryDistance: number
  isOpen: boolean
  acceptingOrders: boolean
}

export default function AdminSettingsScreen() {
  const navigation = useNavigation()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Settings>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/settings`)
      const data = await response.json()
      setSettings(data)
      setFormData(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      Alert.alert("Error", "Failed to load restaurant settings")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)

      // Validate form data
      if (!formData.restaurantName || !formData.address || !formData.phoneNumber) {
        Alert.alert("Missing Fields", "Please fill in all required fields")
        setSaving(false)
        return
      }

      const response = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "dummy-token", // Replace with actual token
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update settings")
      }

      const updatedSettings = await response.json()
      setSettings(updatedSettings)

      Alert.alert("Success", "Restaurant settings updated successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      Alert.alert("Error", "Failed to update restaurant settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c34428" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Restaurant Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <Input
            label="Restaurant Name *"
            value={formData.restaurantName || ""}
            onChangeText={(value) => handleInputChange("restaurantName", value)}
            placeholder="Enter restaurant name"
          />

          <Input
            label="Address *"
            value={formData.address || ""}
            onChangeText={(value) => handleInputChange("address", value)}
            placeholder="Enter restaurant address"
            multiline
            numberOfLines={2}
          />

          <Input
            label="Phone Number *"
            value={formData.phoneNumber || ""}
            onChangeText={(value) => handleInputChange("phoneNumber", value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <Input
            label="Email"
            value={formData.email || ""}
            onChangeText={(value) => handleInputChange("email", value)}
            placeholder="Enter email address"
            keyboardType="email-address"
          />

          <Input
            label="Opening Hours"
            value={formData.openingHours || ""}
            onChangeText={(value) => handleInputChange("openingHours", value)}
            placeholder="e.g. Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
          />
        </View>

        <Separator />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Settings</Text>

          <Input
            label="Delivery Fee ($)"
            value={formData.deliveryFee?.toString() || ""}
            onChangeText={(value) => handleInputChange("deliveryFee", Number.parseFloat(value) || 0)}
            placeholder="Enter delivery fee"
            keyboardType="decimal-pad"
          />

          <Input
            label="Minimum Order Amount ($)"
            value={formData.minOrderAmount?.toString() || ""}
            onChangeText={(value) => handleInputChange("minOrderAmount", Number.parseFloat(value) || 0)}
            placeholder="Enter minimum order amount"
            keyboardType="decimal-pad"
          />

          <Input
            label="Maximum Delivery Distance (miles)"
            value={formData.maxDeliveryDistance?.toString() || ""}
            onChangeText={(value) => handleInputChange("maxDeliveryDistance", Number.parseFloat(value) || 0)}
            placeholder="Enter maximum delivery distance"
            keyboardType="decimal-pad"
          />
        </View>

        <Separator />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant Status</Text>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Restaurant is Open</Text>
            <Switch
              value={formData.isOpen || false}
              onValueChange={(value) => handleInputChange("isOpen", value)}
              trackColor={{ false: "#d1d5db", true: "#c34428" }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Accepting Online Orders</Text>
            <Switch
              value={formData.acceptingOrders || false}
              onValueChange={(value) => handleInputChange("acceptingOrders", value)}
              trackColor={{ false: "#d1d5db", true: "#c34428" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={handleSaveSettings} disabled={saving} loading={saving} fullWidth>
            Save Settings
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
})
