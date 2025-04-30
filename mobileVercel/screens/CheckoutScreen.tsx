"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { RootStackParamList } from "../types/navigation"
import { useCart } from "../contexts/CartContext"
import { useSettings } from "../contexts/SettingsContext"
import { API_URL } from "../config"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type FormData = {
  customerName: string
  customerEmail: string
  customerPhone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  notes: string
}

export default function CheckoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { settings } = useSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")

  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    notes: "",
  })

  const subtotal = getCartTotal()
  const tax = subtotal * (settings.taxPercentage / 100)
  const deliveryFee = orderType === "delivery" ? settings.deliveryFee : 0
  const total = subtotal + tax + deliveryFee

  const handleInputChange = (name: string, value: string) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const validateForm = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      Alert.alert("Missing Information", "Please fill in all required fields.")
      return false
    }

    if (
      orderType === "delivery" &&
      (!formData.address.street || !formData.address.city || !formData.address.zipCode)
    ) {
      Alert.alert("Missing Address", "Please provide a complete delivery address.")
      return false
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const items = cartItems.map((item) => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        address: orderType === "delivery" ? formData.address : null,
        items,
        subtotal,
        tax,
        deliveryFee,
        total,
        paymentMethod,
        orderType,
        notes: formData.notes,
      }

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Failed to place order")
      }

      const data = await response.json()

      clearCart()
      navigation.navigate("OrderConfirmation", {
        orderNumber: data.orderNumber,
        total,
        orderType,
      })
      
    } catch (error) {
      console.error("Error placing order:", error)
      Alert.alert(
        "Order Failed",
        "There was a problem placing your order. Please try again or contact customer support.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Checkout</Text>
        </View>

        {/* Form UI omitted here for brevity — insert from your previous JSX body (no changes needed) */}

        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
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
 pickupOnlyContainer: {
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "center",
   padding: 16,
   gap: 8,
 },
 pickupOnlyText: {
   fontSize: 14,
   color: "#666",
 },
 section: {
   padding: 16,
   borderTopWidth: 1,
   borderTopColor: "#eee",
 },
 sectionTitle: {
   fontSize: 18,
   fontWeight: "bold",
   marginBottom: 16,
 },
 inputContainer: {
   marginBottom: 16,
 },
 inputLabel: {
   fontSize: 14,
   fontWeight: "500",
   marginBottom: 8,
 },
 input: {
   borderWidth: 1,
   borderColor: "#ddd",
   borderRadius: 4,
   padding: 12,
   fontSize: 16,
 },
 textArea: {
   height: 100,
 },
 row: {
   flexDirection: "row",
 },
 pickupInfoContainer: {
   backgroundColor: "#f9f9f9",
   padding: 16,
   borderRadius: 4,
 },
 pickupInfoTitle: {
   fontSize: 16,
   fontWeight: "bold",
   marginBottom: 8,
 },
 pickupInfoText: {
   fontSize: 14,
   color: "#666",
   marginBottom: 4,
 },
 paymentOption: {
   flexDirection: "row",
   alignItems: "center",
   padding: 16,
   borderWidth: 1,
   borderColor: "#ddd",
   borderRadius: 4,
   marginBottom: 12,
 },
 selectedPaymentOption: {
   borderColor: "#c34428",
   backgroundColor: "rgba(195, 68, 40, 0.05)",
 },
 paymentOptionIcon: {
   width: 40,
   height: 40,
   borderRadius: 20,
   backgroundColor: "#f5f5f5",
   justifyContent: "center",
   alignItems: "center",
   marginRight: 12,
 },
 paymentOptionContent: {
   flex: 1,
 },
 paymentOptionTitle: {
   fontSize: 16,
   fontWeight: "500",
   marginBottom: 4,
 },
 paymentOptionDescription: {
   fontSize: 14,
   color: "#666",
 },
 paymentOptionRadio: {
   width: 20,
   height: 20,
   borderRadius: 10,
   borderWidth: 1,
   borderColor: "#c34428",
   justifyContent: "center",
   alignItems: "center",
 },
 paymentOptionRadioSelected: {
   width: 12,
   height: 12,
   borderRadius: 6,
   backgroundColor: "#c34428",
 },
 summaryItem: {
   flexDirection: "row",
   marginBottom: 8,
 },
 summaryItemQuantity: {
   width: 30,
   fontSize: 14,
   fontWeight: "500",
 },
 summaryItemName: {
   flex: 1,
   fontSize: 14,
 },
 summaryItemPrice: {
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
 placeOrderButton: {
   backgroundColor: "#c34428",
   padding: 16,
   borderRadius: 4,
   margin: 16,
   alignItems: "center",
 },
 placeOrderButtonText: {
   color: "#fff",
   fontWeight: "bold",
   fontSize: 16,
 },
})



