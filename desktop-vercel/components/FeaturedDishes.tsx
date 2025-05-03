import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, Dimensions } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useCart } from "../contexts/CartContext"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.8

const featuredDishes = [
  {
    _id: "1",
    name: "General Tso's Chicken",
    description: "Crispy chicken with a sweet and spicy sauce, served with broccoli and rice.",
    price: 14.99,
    image: "https://placehold.co/300x200/FFFFFF/CCCCCC/png",
  },
  {
    _id: "2",
    name: "Beef with Broccoli",
    description: "Tender beef slices stir-fried with fresh broccoli in a savory brown sauce.",
    price: 15.99,
    image: "https://placehold.co/300x200/FFFFFF/CCCCCC/png",
  },
  {
    _id: "3",
    name: "Shrimp Lo Mein",
    description: "Stir-fried noodles with shrimp, vegetables, and our special sauce.",
    price: 13.99,
    image: "https://placehold.co/300x200/FFFFFF/CCCCCC/png",
  },
  {
    _id: "4",
    name: "Vegetable Fried Rice",
    description: "Wok-fried rice with mixed vegetables, eggs, and our house seasoning.",
    price: 10.99,
    image: "https://placehold.co/300x200/FFFFFF/CCCCCC/png",
  },
]

export default function FeaturedDishes() {
  const { addToCart } = useCart()

  const renderDishItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.dishPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <FontAwesome name="shopping-cart" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Featured Dishes</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>
          Try our most popular dishes, prepared with authentic recipes and the freshest ingredients.
        </Text>
      </View>

      <FlatList
        data={featuredDishes}
        renderItem={renderDishItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        snapToInterval={cardWidth + 20}
        decelerationRate="fast"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: "#c34428",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    maxWidth: 500,
  },
  listContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  dishName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dishPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c34428",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#c34428",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 4,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
})
