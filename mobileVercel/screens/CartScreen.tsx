"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { useCart } from "../contexts/CartContext"
import { useSettings } from "../contexts/SettingsContext"

// Type for cart items
type CartItem = {
  _id: string
  name: string
  image?: string
  price: number
  quantity: number
}

export default function CartScreen() {
  const navigation = useNavigation()
  const { cartItems, isLoading, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart()
  const { settings, loading: loadingSettings } = useSettings()
  const [orderType, setOrderType] = useState("delivery")

  // Calculate order summary
  const subtotal = getCartTotal()
  const tax = subtotal * (settings.taxPercentage / 100)
  const deliveryFee = orderType === "delivery" ? settings.deliveryFee : 0
  const total = subtotal + tax + deliveryFee

  const handleCheckout = () => {
    if (subtotal < settings.minimumOrderAmount && orderType === "delivery") {
      Alert.alert(
        "Minimum Order Amount",
        `The minimum order amount for delivery is $${settings.minimumOrderAmount.toFixed(
          2
        )}. Your current subtotal is $${subtotal.toFixed(2)}.`,
        [{ text: "OK" }]
      )
      return
    }

    navigation.navigate("Checkout" as never)
  }

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.image || "https://placehold.co/100x100/FFFFFF/CCCCCC/png" }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item._id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <FontAwesome name="minus" size={12} color="#333" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item._id, item.quantity + 1)}
        >
          <FontAwesome name="plus" size={12} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item._id)}>
        <FontAwesome name="trash" size={18} color="#c34428" />
      </TouchableOpacity>
    </View>
  )

  if (isLoading || loadingSettings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c34428" />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    )
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyCartContainer}>
          <FontAwesome name="shopping-cart" size={64} color="#ddd" />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartText}>Looks like you haven't added any items to your cart yet.</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Menu" as never)}>
            <Text style={styles.browseButtonText}>Browse Our Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Order</Text>
      </View>

      <View style={styles.orderTypeContainer}>
        <TouchableOpacity
          style={[styles.orderTypeButton, orderType === "delivery" && styles.activeOrderTypeButton]}
          onPress={() => setOrderType("delivery")}
          disabled={!settings.enableDelivery}
        >
          <MaterialIcons name="delivery-dining" size={20} color={orderType === "delivery" ? "#fff" : "#333"} />
          <Text style={[styles.orderTypeText, orderType === "delivery" && styles.activeOrderTypeText]}>
            Delivery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.orderTypeButton, orderType === "pickup" && styles.activeOrderTypeButton]}
          onPress={() => setOrderType("pickup")}
        >
          <MaterialIcons name="store" size={20} color={orderType === "pickup" ? "#fff" : "#333"} />
          <Text style={[styles.orderTypeText, orderType === "pickup" && styles.activeOrderTypeText]}>
            Pickup
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.cartList}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax ({settings.taxPercentage}%)</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>
        {orderType === "delivery" && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              Alert.alert("Clear Cart", "Are you sure you want to remove all items from your cart?", [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", onPress: () => clearCart() },
              ])
            }}
          >
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  orderTypeContainer: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "center",
    gap: 16,
  },
  orderTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    gap: 8,
  },
  activeOrderTypeButton: {
    backgroundColor: "#c34428",
  },
  orderTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  activeOrderTypeText: {
    color: "#fff",
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    width: 60,
    textAlign: "right",
  },
  removeButton: {
    marginLeft: 12,
    padding: 8,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  clearButton: {
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#c34428",
  },
  clearButtonText: {
    color: "#c34428",
    fontWeight: "500",
    fontSize: 14,
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: "#c34428",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#c34428",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  browseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})
