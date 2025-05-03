import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"

export default function OrderConfirmationScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { orderNumber, total, orderType } = route.params as {
    orderNumber: string
    total: number
    orderType: string
  }

  const estimatedTime = orderType === "delivery" ? "30-45 minutes" : "15-20 minutes"

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successIcon}>
          <FontAwesome name="check-circle" size={80} color="#4CAF50" />
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Thank you for your order. Your food is being prepared and will be{" "}
          {orderType === "delivery" ? "on its way" : "ready for pickup"} shortly.
        </Text>

        <View style={styles.orderInfoContainer}>
          <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
          <Text style={styles.estimatedTime}>
            Estimated {orderType === "delivery" ? "delivery" : "pickup"}: {estimatedTime}
          </Text>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate("Track" as never, { orderId: orderNumber } as never)}
        >
          <MaterialIcons name="delivery-dining" size={20} color="#fff" />
          <Text style={styles.trackButtonText}>Track Your Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home" as never)}>
          <Text style={styles.homeButtonText}>Return to Home</Text>
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
  content: {
    padding: 24,
    alignItems: "center",
  },
  successIcon: {
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  orderInfoContainer: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
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
  trackButton: {
    backgroundColor: "#c34428",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginBottom: 12,
    width: "100%",
    gap: 8,
  },
  trackButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  homeButton: {
    borderWidth: 1,
    borderColor: "#c34428",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    width: "100%",
    alignItems: "center",
  },
  homeButtonText: {
    color: "#c34428",
    fontWeight: "bold",
    fontSize: 16,
  },
})
