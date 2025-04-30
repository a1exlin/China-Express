"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRoute, RouteProp } from "@react-navigation/native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { API_URL } from "../config"
import type { RootStackParamList } from "../types/navigation"

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"

type Order = {
  _id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  } | null
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  paymentMethod: string
  orderType: string
  status: OrderStatus
  notes: string
  createdAt: string
  updatedAt: string
  estimatedDeliveryTime: string
}

export default function OrderTrackingScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "Track">>()
  const initialOrderId = route.params?.orderId || ""

  const [orderNumber, setOrderNumber] = useState(initialOrderId)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (initialOrderId) {
      trackOrder(initialOrderId)
    }
  }, [initialOrderId])

  const trackOrder = async (id = orderNumber) => {
    if (!id) {
      setError("Please enter an order number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/orders/${id}`)

      if (!response.ok) throw new Error("Order not found")

      const data = await response.json()
      setOrder(data)
    } catch (err) {
      console.error("Error tracking order:", err)
      setError("Order not found. Please check your order number and try again.")
      Alert.alert("Order Not Found", "Please check your order number and try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Ionicons name="time-outline" size={32} color="#666" />
      case "confirmed":
        return <Ionicons name="checkmark-circle-outline" size={32} color="#3498db" />
      case "preparing":
        return <Ionicons name="restaurant-outline" size={32} color="#f1c40f" />
      case "ready":
        return <Ionicons name="cube-outline" size={32} color="#2ecc71" />
      case "out-for-delivery":
        return <Ionicons name="bicycle-outline" size={32} color="#9b59b6" />
      case "delivered":
        return <Ionicons name="checkmark-done-outline" size={32} color="#27ae60" />
      case "cancelled":
        return <Ionicons name="close-circle-outline" size={32} color="#e74c3c" />
      default:
        return <Ionicons name="help-circle-outline" size={32} color="#999" />
    }
  }

  const getStatusText = (status: OrderStatus, type: string) => {
    const base = {
      pending: "Order Received",
      confirmed: "Order Confirmed",
      preparing: "Preparing Your Order",
      ready: type === "pickup" ? "Ready for Pickup" : "Ready for Delivery",
      "out-for-delivery": type === "pickup" ? "Ready for Pickup" : "Out for Delivery",
      delivered: "Order Completed",
      cancelled: "Cancelled",
    }
    return base[status] || "Unknown Status"
  }

  const getStatusDescription = (status: OrderStatus, type: string) => {
    const desc = {
      pending: "We've received your order and are processing it.",
      confirmed: "Your order has been confirmed and will be prepared soon.",
      preparing: "Our chefs are preparing your delicious meal.",
      ready: type === "pickup"
        ? "Your order is ready for pickup at our restaurant."
        : "Your order is ready and will be out for delivery soon.",
      "out-for-delivery": "Your order is on its way to you.",
      delivered: "Your order has been delivered. Enjoy your meal!",
      cancelled: "Your order has been cancelled.",
    }
    return desc[status] || "Status information unavailable."
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Track Your Order</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={orderNumber}
            onChangeText={setOrderNumber}
            placeholder="Enter order number"
          />
          <TouchableOpacity style={styles.trackButton} onPress={() => trackOrder()} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.trackButtonText}>Track</Text>}
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {order && (
          <View style={styles.orderCard}>
            <Text style={styles.orderNum}>Order #{order.orderNumber}</Text>
            <Text style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</Text>

            <View style={styles.statusRow}>
              {getStatusIcon(order.status)}
              <View style={styles.statusText}>
                <Text style={styles.statusTitle}>{getStatusText(order.status, order.orderType)}</Text>
                <Text style={styles.statusSub}>{getStatusDescription(order.status, order.orderType)}</Text>
              </View>
            </View>

            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  inputContainer: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  trackButton: {
    backgroundColor: "#c34428",
    paddingHorizontal: 20,
    borderRadius: 4,
    justifyContent: "center",
  },
  trackButtonText: { color: "#fff", fontWeight: "bold" },
  errorText: { color: "#e74c3c", marginTop: 8 },
  orderCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  orderNum: { fontWeight: "bold", fontSize: 16 },
  orderDate: { color: "#666", marginBottom: 12 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  statusText: { flex: 1 },
  statusTitle: { fontWeight: "bold", fontSize: 16 },
  statusSub: { color: "#666", marginTop: 4 },
  summary: { marginTop: 12, flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 16 },
  summaryValue: { fontSize: 16, fontWeight: "bold" },
})
