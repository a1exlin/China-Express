"use client"

import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { ShoppingCart } from "react-native-feather"
import { useNavigation } from "@react-navigation/native"
import { useCart } from "../contexts/CartContext"

type Dish = {
  id: number
  name: string
  description: string
  price: number
  image: string
}

const featuredDishes: Dish[] = [
  {
    id: 1,
    name: "General Tso's Chicken",
    description: "Crispy chicken with a sweet and spicy sauce, served with broccoli and rice.",
    price: 14.99,
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 2,
    name: "Beef with Broccoli",
    description: "Tender beef slices stir-fried with fresh broccoli in a savory brown sauce.",
    price: 15.99,
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 3,
    name: "Shrimp Lo Mein",
    description: "Stir-fried noodles with shrimp, vegetables, and our special sauce.",
    price: 13.99,
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 4,
    name: "Vegetable Fried Rice",
    description: "Wok-fried rice with mixed vegetables, eggs, and our house seasoning.",
    price: 10.99,
    image: "https://via.placeholder.com/400x300",
  },
]

export default function FeaturedDishes() {
  const { addToCart } = useCart()
  const navigation = useNavigation()

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Our Featured Dishes</Text>
      <Text style={styles.subheader}>
        Try our most popular dishes, prepared with authentic recipes and the freshest ingredients.
      </Text>

      {featuredDishes.map((dish) => (
        <View key={dish.id} style={styles.card}>
          <Image source={{ uri: dish.image }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.name}>{dish.name}</Text>
            <Text style={styles.description}>{dish.description}</Text>
            <Text style={styles.price}>${dish.price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.button} onPress={() => addToCart(dish)}>
              <ShoppingCart stroke="#fff" width={18} height={18} />
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subheader: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#c34428",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#c34428",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
