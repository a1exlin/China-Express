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
  TextInput,
  Modal,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { API_URL } from "../../config"

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

type Category = {
  _id: string
  id: string
  name: string
  order: number
}

export default function AdminMenuScreen() {
  const navigation = useNavigation()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  // Form state for new menu item
  const [newItem, setNewItem] = useState({
    name: "",
    itemCode: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
  })

  useEffect(() => {
    fetchData()
  }, [categoryFilter])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch categories
      const categoriesRes = await fetch(`${API_URL}/categories`)
      const categoriesData = await categoriesRes.json()
      setCategories(categoriesData)

      // Fetch menu items
      const menuItemsRes = await fetch(`${API_URL}/menu`)
      const menuItemsData = await menuItemsRes.json()

      // Filter by category if needed
      if (categoryFilter !== "all") {
        const filtered = menuItemsData.filter((item: MenuItem) => item.category === categoryFilter)
        setMenuItems(filtered)
      } else {
        setMenuItems(menuItemsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      Alert.alert("Error", "Failed to load menu data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const handleSearch = (text: string) => {
    setSearchQuery(text)

    if (!text.trim()) {
      fetchData()
      return
    }

    // Filter items based on search query
    const filtered = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(text.toLowerCase()) ||
        item.description.toLowerCase().includes(text.toLowerCase()),
    )

    setMenuItems(filtered)
  }

  const handleInputChange = (field: string, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: field === "price" ? value.replace(/[^0-9.]/g, "") : value,
    }))
  }

  const handleAddItem = async () => {
    // Validate form
    if (!newItem.name || !newItem.itemCode || !newItem.description || !newItem.price || !newItem.category) {
      Alert.alert("Missing Fields", "Please fill in all required fields")
      return
    }

    try {
      const response = await fetch(`${API_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "dummy-token", // Replace with actual token
        },
        body: JSON.stringify({
          ...newItem,
          price: Number.parseFloat(newItem.price),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add menu item")
      }

      // Reset form and close modal
      setNewItem({
        name: "",
        itemCode: "",
        description: "",
        price: "",
        category: "",
        image: "",
        isAvailable: true,
      })

      setShowAddModal(false)

      // Refresh menu items
      fetchData()

      Alert.alert("Success", "Menu item added successfully")
    } catch (error) {
      console.error("Error adding menu item:", error)
      Alert.alert("Error", "Failed to add menu item")
    }
  }

  const handleDeleteItem = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this menu item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/menu/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + "dummy-token", // Replace with actual token
              },
            })

            if (!response.ok) {
              throw new Error("Failed to delete menu item")
            }

            // Remove item from state
            setMenuItems((prev) => prev.filter((item) => item._id !== id))

            Alert.alert("Success", "Menu item deleted successfully")
          } catch (error) {
            console.error("Error deleting menu item:", error)
            Alert.alert("Error", "Failed to delete menu item")
          }
        },
      },
    ])
  }

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemHeader}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemCode}>{item.itemCode}</Text>
      </View>

      <Text style={styles.menuItemDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.menuItemFooter}>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.menuItemActions}>
          <TouchableOpacity
            style={[styles.menuItemAction, styles.editButton]}
            onPress={() => Alert.alert("Edit", `Edit ${item.name}`)}
          >
            <Ionicons name="create-outline" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItemAction, styles.deleteButton]}
            onPress={() => handleDeleteItem(item._id)}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryTag}>
        <Text style={styles.categoryTagText}>
          {categories.find((c) => c.id === item.category)?.name || item.category}
        </Text>
      </View>

      {!item.isAvailable && (
        <View style={styles.unavailableOverlay}>
          <Text style={styles.unavailableText}>Unavailable</Text>
        </View>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Menu Items</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="#c34428" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery("")
                fetchData()
              }}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          <TouchableOpacity
            style={[styles.filterOption, categoryFilter === "all" && styles.filterOptionSelected]}
            onPress={() => setCategoryFilter("all")}
          >
            <Text style={[styles.filterOptionText, categoryFilter === "all" && styles.filterOptionTextSelected]}>
              All
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.filterOption, categoryFilter === category.id && styles.filterOptionSelected]}
              onPress={() => setCategoryFilter(category.id)}
            >
              <Text
                style={[styles.filterOptionText, categoryFilter === category.id && styles.filterOptionTextSelected]}
              >
                {category.name}
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
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No menu items found</Text>
            </View>
          }
        />
      )}

      {/* Add Menu Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Menu Item</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newItem.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  placeholder="Enter item name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Item Code *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newItem.itemCode}
                  onChangeText={(value) => handleInputChange("itemCode", value)}
                  placeholder="Enter item code (e.g. APP001)"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description *</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={newItem.description}
                  onChangeText={(value) => handleInputChange("description", value)}
                  placeholder="Enter item description"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Price *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newItem.price}
                  onChangeText={(value) => handleInputChange("price", value)}
                  placeholder="Enter price (e.g. 9.99)"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category *</Text>
                <View style={styles.pickerContainer}>
                  {/* In a real app, you would use a proper picker component */}
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => {
                      Alert.alert(
                        "Select Category",
                        "Choose a category for this item",
                        categories.map((category) => ({
                          text: category.name,
                          onPress: () => handleInputChange("category", category.id),
                        })),
                      )
                    }}
                  >
                    <Text style={styles.pickerButtonText}>
                      {newItem.category ? categories.find((c) => c.id === newItem.category)?.name : "Select a category"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Image URL</Text>
                <TextInput
                  style={styles.formInput}
                  value={newItem.image}
                  onChangeText={(value) => handleInputChange("image", value)}
                  placeholder="Enter image URL (optional)"
                />
              </View>

              <View style={styles.formGroup}>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={[styles.checkbox, newItem.isAvailable && styles.checkboxChecked]}
                    onPress={() => handleInputChange("isAvailable", (!newItem.isAvailable).toString())}
                  >
                    {newItem.isAvailable && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>Item is available</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddItem}>
                <Text style={styles.saveButtonText}>Save Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
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
  addButton: {
    padding: 4,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
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
    backgroundColor: "#f5f5f5",
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
    padding: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    margin: 8,
    width: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  menuItemHeader: {
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  menuItemCode: {
    fontSize: 12,
    color: "#999",
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  menuItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#c34428",
  },
  menuItemActions: {
    flexDirection: "row",
    gap: 8,
  },
  menuItemAction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#2196f3",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  categoryTag: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(195, 68, 40, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  categoryTagText: {
    fontSize: 10,
    color: "#c34428",
  },
  unavailableOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  unavailableText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#c34428",
    borderColor: "#c34428",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  cancelButtonText: {
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#c34428",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
})
