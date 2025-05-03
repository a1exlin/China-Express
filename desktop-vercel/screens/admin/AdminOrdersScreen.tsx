"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { API_URL } from "../../config"
import { Badge } from "../../components/ui/badge"

type Order = {
  _id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: Array<{
    _id: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  orderType: "pickup" | "delivery"
  createdAt: string
  updatedAt: string
}

export default function AdminOrdersScreen() {
  const navigation = useNavigation()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      let url = `${API_URL}/orders`

      if (statusFilter) {
        url += `?status=${statusFilter}`
      }

      const response = await fetch(url)
      const data = await response.json()

      // Sort orders by date (newest first)
      const sortedOrders = data.sort(
        (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      setOrders(sortedOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      Alert.alert("Error", "Failed to load orders")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchOrders()
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "dummy-token", // Replace with actual token
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      // Update order in state
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: newStatus as any } : order)))

      Alert.alert("Success", "Order status updated successfully")
    } catch (error) {
      console.error("Error updating order status:", error)
      Alert.alert("Error", "Failed to update order status")
    }
  }

  const handleStatusChange = (orderId: string, currentStatus: string) => {
    const statusOptions = [
      { label: "Pending", value: "pending" },
      { label: "Preparing", value: "preparing" },
      { label: "Ready", value: "ready" },
      { label: "Delivered", value: "delivered" },
      { label: "Cancelled", value: "cancelled" },
    ]

    Alert.alert(
      "Update Order Status",
      "Select the new status for this order:",
      statusOptions.map((option) => ({
        text: option.label,
        onPress: () => {
          if (option.value !== currentStatus) {
            updateOrderStatus(orderId, option.value)
          }
        },
        style: option.value === "cancelled" ? "destructive" : "default",
      })),
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"
      case "preparing":
        return "primary"
      case "ready":
        return "success"
      case "delivered":
        return "secondary"
      case "cancelled":
        return "danger"
      default:
        return "default"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <TouchableOpacity onPress={() => handleStatusChange(item._id, item.status)}>
          <Badge variant={getStatusBadgeVariant(item.status)}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </TouchableOpacity>
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.customer.name}</Text>
        <Text style={styles.customerContact}>{item.customer.phone}</Text>
      </View>

      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.orderItemQuantity}>{orderItem.quantity}x</Text>
            <Text style={styles.orderItemName}>{orderItem.name}</Text>
            <Text style={styles.orderItemPrice}>${(orderItem.price * orderItem.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.orderType}>
          <Ionicons
            name={item.orderType === "delivery" ? "bicycle-outline" : "bag-handle-outline"}
            size={16}
            color="#666"
          />
          <Text style={styles.orderTypeText}>{item.orderType === "delivery" ? "Delivery" : "Pickup"}</Text>
        </View>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Orders</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          <TouchableOpacity
            style={[styles.filterOption, statusFilter === null && styles.filterOptionSelected]}
            onPress={() => setStatusFilter(null)}
          >
            <Text style={[styles.filterOptionText, statusFilter === null && styles.filterOptionTextSelected]}>All</Text>
          </TouchableOpacity>

          {["pending", "preparing", "ready", "delivered", "cancelled"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterOption, statusFilter === status && styles.filterOptionSelected]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={[styles.filterOptionText, statusFilter === status && styles.filterOptionTextSelected]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c34428" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#c34428"]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
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
  filterContainer: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filtersScrollContent: {
    paddingHorizontal: 16,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  filterOptionSelected: {
    backgroundColor: "#c34428",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#333",
  },
  filterOptionTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "500",
  },
  customerContact: {
    fontSize: 12,
    color: "#666",
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  orderItemQuantity: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
    width: 24,
  },
  orderItemName: {
    fontSize: 14,
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "500",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  orderType: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderTypeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#c34428",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
})
