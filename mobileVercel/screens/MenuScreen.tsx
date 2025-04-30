"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useCart } from "../contexts/CartContext"
import { API_URL } from "../config"

type Category = {
  _id: string
  id: string
  name: string
  order: number
}

type MenuItem = {
  _id: string
  name: string
  itemCode: string
  description: string
  price: number
  category: string
  image: string
  isAvailable: boolean
}

export default function MenuScreen() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<{ [key: string]: MenuItem[] }>({})
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch categories
      const categoriesRes = await fetch(`${API_URL}/categories`)
      const categoriesData = await categoriesRes.json()

      if (categoriesData.length > 0) {
        setCategories(categoriesData)
        setActiveCategory(categoriesData[0].id)

        // Fetch menu items
        const menuItemsRes = await fetch(`${API_URL}/menu`)
        const menuItemsData = await menuItemsRes.json()

        // Group menu items by category
        const itemsByCategory: { [key: string]: MenuItem[] } = {}
        categoriesData.forEach((category: Category) => {
          itemsByCategory[category.id] = menuItemsData.filter((item: MenuItem) => item.category === category.id)
        })

        setMenuItems(itemsByCategory)
      }
    } catch (error) {
      console.error("Error fetching menu data:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categoryButton, activeCategory === item.id && styles.activeCategoryButton]}
      onPress={() => setActiveCategory(item.id)}
    >
      <Text style={[styles.categoryButtonText, activeCategory === item.id && styles.activeCategoryButtonText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  )

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItemCard}>
      <Image
        source={{ uri: item.image || "https://placehold.co/300x200/FFFFFF/CCCCCC/png" }}
        style={styles.menuItemImage}
      />
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemCode}>{item.itemCode}</Text>
        </View>
        <Text style={styles.menuItemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <FontAwesome name="shopping-cart" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c34428" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Menu</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>
          Explore our wide selection of authentic Chinese dishes, prepared with traditional recipes and the freshest
          ingredients.
        </Text>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {activeCategory && menuItems[activeCategory] ? (
        <>
          <Text style={styles.categoryTitle}>{categories.find((c) => c.id === activeCategory)?.name}</Text>

          <FlatList
            data={menuItems[activeCategory]}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.menuItemsList}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items available in this category.</Text>
        </View>
      )}
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
  },
  categoriesContainer: {
    marginVertical: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
  },
  activeCategoryButton: {
    backgroundColor: "#c34428",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  activeCategoryButtonText: {
    color: "#fff",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  menuItemsList: {
    padding: 16,
  },
  menuItemCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemImage: {
    width: "100%",
    height: 150,
  },
  menuItemContent: {
    padding: 16,
  },
  menuItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuItemCode: {
    fontSize: 12,
    color: "#999",
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  menuItemPrice: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
})
