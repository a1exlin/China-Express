"use client"

import { useState } from "react"
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { useCart } from "../contexts/CartContext"
import { useSettings } from "../contexts/SettingsContext"
import { API_URL } from "../config"

export default function CheckoutScreen() {
  const navigation = useNavigation()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { settings } = useSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderType, setOrderType] = useState("delivery")
  const [paymentMethod, setPaymentMethod] = useState("cash")

  // Form state
  const [formData, setFormData] = useState({
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

  // Calculate order summary
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
          ...prev[parent as keyof typeof prev],
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

    if (orderType === "delivery" && (!formData.address.street || !formData.address.city || !formData.address.zipCode)) {
      Alert.alert("Missing Address", "Please provide a complete delivery address.")
      return false
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Save the current cart items before clearing
      const items = cartItems.map((item) => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      // Create order object
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

      // Submit order to API
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

      // Clear cart and navigate to confirmation
      clearCart()
      navigation.navigate(
        "OrderConfirmation" as never,
        {
          orderNumber: data.orderNumber,
          total,
          orderType,
        } as never,
      )
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

        {/* Order Type Selection */}
        {settings.enableDelivery ? (
          <View style={styles.orderTypeContainer}>
            <TouchableOpacity
              style={[styles.orderTypeButton, orderType === "delivery" && styles.activeOrderTypeButton]}
              onPress={() => setOrderType("delivery")}
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
              <Text style={[styles.orderTypeText, orderType === "pickup" && styles.activeOrderTypeText]}>Pickup</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.pickupOnlyContainer}>
            <MaterialIcons name="info-outline" size={20} color="#666" />
            <Text style={styles.pickupOnlyText}>Only pickup is available at this time</Text>
          </View>
        )}

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.customerName}
              onChangeText={(value) => handleInputChange("customerName", value)}
              placeholder="Enter your full name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.customerEmail}
              onChangeText={(value) => handleInputChange("customerEmail", value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.customerPhone}
              onChangeText={(value) => handleInputChange("customerPhone", value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Delivery Address (if delivery selected) */}
        {orderType === "delivery" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Street Address *</Text>
              <TextInput
                style={styles.input}
                value={formData.address.street}
                onChangeText={(value) => handleInputChange("address.street", value)}
                placeholder="Enter your street address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.address.city}
                onChangeText={(value) => handleInputChange("address.city", value)}
                placeholder="Enter your city"
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>State *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address.state}
                  onChangeText={(value) => handleInputChange("address.state", value)}
                  placeholder="State"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>ZIP Code *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address.zipCode}
                  onChangeText={(value) => handleInputChange("address.zipCode", value)}
                  placeholder="ZIP Code"
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </View>
        )}

        {/* Pickup Information */}
        {orderType === "pickup" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Information</Text>
            <View style={styles.pickupInfoContainer}>
              <Text style={styles.pickupInfoTitle}>{settings.restaurantName}</Text>
              <Text style={styles.pickupInfoText}>{settings.address}</Text>
              <Text style={styles.pickupInfoText}>Phone: {settings.phoneNumber}</Text>
              <Text style={styles.pickupInfoText}>Hours: {settings.openingHours}</Text>
            </View>
          </View>
        )}

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(value) => handleInputChange("notes", value)}
            placeholder="Add any special instructions or requests"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "cash" && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod("cash")}
          >
            <View style={styles.paymentOptionIcon}>
              <FontAwesome name="money" size={20} color="#333" />
            </View>
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>Cash on {orderType === "delivery" ? "Delivery" : "Pickup"}</Text>
              <Text style={styles.paymentOptionDescription}>Pay with cash when you receive your order</Text>
            </View>
            <View style={styles.paymentOptionRadio}>
              {paymentMethod === "cash" && <View style={styles.paymentOptionRadioSelected} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === "card" && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod("card")}
          >
            <View style={styles.paymentOptionIcon}>
              <FontAwesome name="credit-card" size={20} color="#333" />
            </View>
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>Credit/Debit Card</Text>
              <Text style={styles.paymentOptionDescription}>Pay with your card when you receive your order</Text>
            </View>
            <View style={styles.paymentOptionRadio}>
              {paymentMethod === "card" && <View style={styles.paymentOptionRadioSelected} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item._id} style={styles.summaryItem}>
              <Text style={styles.summaryItemQuantity}>{item.quantity}x</Text>
              <Text style={styles.summaryItemName}>{item.name}</Text>
              <Text style={styles.summaryItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
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
        </View>

        {/* Place Order Button */}
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
