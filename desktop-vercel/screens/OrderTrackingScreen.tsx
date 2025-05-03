"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { API_URL } from "../config"

type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "out-for-delivery" | "delivered" | "cancelled"

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
  const route = useRoute()
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

      if (!response.ok) {
        throw new Error("Order not found")
      }

      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error("Error tracking order:", error)
      setError("Order not found. Please check your order number and try again.")
      Alert.alert("Order Not Found", "Please check your order number and try again.")
    } finally {
      setLoading(false)
    }
  }

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
        return <Ionicons name="time-outline" size={32} color="#666" />
    }
  }

  const getStatusText = (status: OrderStatus, orderType: string) => {
    if (orderType === "pickup") {
      switch (status) {
        case "pending":
          return "Order Received"
        case "confirmed":
          return "Order Confirmed"
        case "preparing":
          return "Preparing Your Order"
        case "ready":
          return "Ready for Pickup"
        case "out-for-delivery":
          return "Ready for Pickup"
        case "delivered":
          return "Order Completed"
        case "cancelled":
          return "Cancelled"
        default:
          return "Unknown Status"
      }
    } else {
      switch (status) {
        case "pending":
          return "Order Received"
        case "confirmed":
          return "Order Confirmed"
        case "preparing":
          return "Preparing Your Order"
        case "ready":
          return "Ready for Delivery"
        case "out-for-delivery":
          return "Out for Delivery"
        case "delivered":
          return "Delivered"
        case "cancelled":
          return "Cancelled"
        default:
          return "Unknown Status"
      }
    }
  }

  const getStatusDescription = (status: OrderStatus, orderType: string) => {
    if (orderType === "pickup") {
      switch (status) {
        case "pending":
          return "We've received your order and are processing it."
        case "confirmed":
          return "Your order has been confirmed and will be prepared soon."
        case "preparing":
          return "Our chefs are preparing your delicious meal."
        case "ready":
          return "Your order is ready for pickup at our restaurant."
        case "out-for-delivery":
          return "Your order is ready for pickup at our restaurant."
        case "delivered":
          return "Your order has been picked up. Enjoy your meal!"
        case "cancelled":
          return "Your order has been cancelled."
        default:
          return "Status information unavailable."
      }
    } else {
      switch (status) {
        case "pending":
          return "We've received your order and are processing it."
        case "confirmed":
          return "Your order has been confirmed and will be prepared soon."
        case "preparing":
          return "Our chefs are preparing your delicious meal."
        case "ready":
          return "Your order is ready and will be out for delivery soon."
        case "out-for-delivery":
          return "Your order is on its way to you."
        case "delivered":
          return "Your order has been delivered. Enjoy your meal!"
        case "cancelled":
          return "Your order has been cancelled."
        default:
          return "Status information unavailable."
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Track Your Order</Text>
        <Text style={styles.subtitle}>Enter your order number to check the status of your order.</Text>
      </View>

      <View style={styles.trackingForm}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={orderNumber}
            onChangeText={setOrderNumber}
            placeholder="Enter order number (e.g. ORD-123456-7890)"
          />
          <TouchableOpacity style={styles.trackButton} onPress={() => trackOrder()} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.trackButtonText}>Track</Text>
            )}
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {order ? (
        <ScrollView style={styles.orderDetails}>
          <View style={styles.orderInfoCard}>
            <View style={styles.orderInfoHeader}>
              <View>
                <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
                <Text style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</Text>
              </View>
              <View style={styles.orderTypeTag}>
                <Text style={styles.orderTypeText}>{order.orderType === "delivery" ? "Delivery" : "Pickup"}</Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              <View style={styles.statusIconContainer}>{getStatusIcon(order.status)}</View>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>{getStatusText(order.status, order.orderType)}</Text>
                <Text style={styles.statusDescription}>{getStatusDescription(order.status, order.orderType)}</Text>
                <Text style={styles.statusTime}>{order.updatedAt && `Updated: ${formatDate(order.updatedAt)}`}</Text>
              </View>
            </View>

            {order.estimatedDeliveryTime && order.status !== "delivered" && order.status !== "cancelled" && (
              <View style={styles.estimatedTimeContainer}>
                <Ionicons name="time-outline" size={24} color="#666" />
                <View style={styles.estimatedTimeTextContainer}>
                  <Text style={styles.estimatedTimeTitle}>
                    Estimated {order.orderType === "delivery" ? "Delivery" : "Pickup"}
                  </Text>
                  <Text style={styles.estimatedTimeValue}>{formatDate(order.estimatedDeliveryTime)}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${order.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${order.tax.toFixed(2)}</Text>
            </View>
            {order.orderType === "delivery" && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>${order.deliveryFee.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
            </View>
          </View>

          {order.orderType === "delivery" && order.address && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <Text style={styles.addressText}>
                {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipCode}
              </Text>
            </View>
          )}

          {order.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Notes</Text>
              <Text style={styles.notesText}>{order.notes}</Text>
            </View>
          )}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  trackingForm: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  trackButton: {
    backgroundColor: "#c34428",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  trackButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#e74c3c",
    marginTop: 8,
  },
  orderDetails: {
    flex: 1,
    padding: 16,
  },
  orderInfoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  orderInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderTypeTag: {
    backgroundColor: "rgba(195, 68, 40, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  orderTypeText: {
    color: "#c34428",
    fontSize: 12,
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  statusIconContainer: {
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statusTime: {
    fontSize: 12,
    color: "#999",
  },
  estimatedTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  estimatedTimeTextContainer: {
    marginLeft: 16,
  },
  estimatedTimeTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  estimatedTimeValue: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  orderItemQuantity: {
    width: 30,
    fontSize: 14,
    fontWeight: "500",
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 14,
    color: "#666",
  },
  notesText: {
    fontSize: 14,
    color: "#666",
  },
})
