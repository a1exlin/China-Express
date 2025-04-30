"use client"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useAuth } from "../../contexts/AuthContext"

export default function AdminDashboardScreen() {
  const navigation = useNavigation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#c34428" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Orders Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Pending Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>$1,250</Text>
            <Text style={styles.statLabel}>Today's Revenue</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AdminOrders" as never)}>
            <View style={[styles.actionIcon, { backgroundColor: "#e3f2fd" }]}>
              <Ionicons name="receipt-outline" size={24} color="#2196f3" />
            </View>
            <Text style={styles.actionText}>Manage Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AdminMenu" as never)}>
            <View style={[styles.actionIcon, { backgroundColor: "#e8f5e9" }]}>
              <Ionicons name="restaurant-outline" size={24} color="#4caf50" />
            </View>
            <Text style={styles.actionText}>Menu Items</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AdminSettings" as never)}>
            <View style={[styles.actionIcon, { backgroundColor: "#fff3e0" }]}>
              <Ionicons name="settings-outline" size={24} color="#ff9800" />
            </View>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <View style={styles.ordersContainer}>
          <View style={styles.orderItem}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>Order #ORD-123456-7890</Text>
              <Text style={styles.orderTime}>Today, 2:30 PM</Text>
            </View>
            <View style={styles.orderStatus}>
              <View style={[styles.statusIndicator, { backgroundColor: "#ffeb3b" }]} />
              <Text style={styles.statusText}>Preparing</Text>
            </View>
          </View>

          <View style={styles.orderItem}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>Order #ORD-123456-7889</Text>
              <Text style={styles.orderTime}>Today, 1:45 PM</Text>
            </View>
            <View style={styles.orderStatus}>
              <View style={[styles.statusIndicator, { backgroundColor: "#4caf50" }]} />
              <Text style={styles.statusText}>Delivered</Text>
            </View>
          </View>

          <View style={styles.orderItem}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>Order #ORD-123456-7888</Text>
              <Text style={styles.orderTime}>Today, 12:15 PM</Text>
            </View>
            <View style={styles.orderStatus}>
              <View style={[styles.statusIndicator, { backgroundColor: "#4caf50" }]} />
              <Text style={styles.statusText}>Delivered</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("AdminOrders" as never)}>
          <Text style={styles.viewAllButtonText}>View All Orders</Text>
          <Ionicons name="chevron-forward" size={16} color="#c34428" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoutButtonText: {
    color: "#c34428",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    textAlign: "center",
  },
  ordersContainer: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    color: "#666",
  },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 4,
  },
  viewAllButtonText: {
    color: "#c34428",
    fontWeight: "500",
  },
})
