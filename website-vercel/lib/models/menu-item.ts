import { firestoreAdmin } from "../firebase-utils"
import { generateId } from "./category"

export interface MenuItemData {
  name: string
  itemCode: string
  description: string
  price: number
  category: string
  image?: string
  isAvailable?: boolean
  createdAt?: number
  updatedAt?: number
}

// MenuItem model for Firestore
const MenuItem = {
  // Find all menu items
  async find(): Promise<Array<MenuItemData & { _id: string }>> {
    try {
      const menuItemsCollection = firestoreAdmin.collection("menuItems")
      const snapshot = await firestoreAdmin.getDocs(menuItemsCollection)
      const menuItems: Array<MenuItemData & { _id: string }> = []

      snapshot.forEach((doc) => {
        menuItems.push({
          _id: doc.id,
          ...(doc.data() as MenuItemData),
        })
      })

      return menuItems
    } catch (error: any) {
      throw new Error(`Error finding menu items: ${error.message}`)
    }
  },

  // Find menu item by ID
  async findById(id: string): Promise<(MenuItemData & { _id: string }) | null> {
    try {
      const menuItemRef = firestoreAdmin.doc("menuItems", id)
      const snapshot = await firestoreAdmin.getDoc(menuItemRef)

      if (snapshot.exists) {
        return {
          _id: id,
          ...(snapshot.data() as MenuItemData),
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error finding menu item: ${error.message}`)
    }
  },

  // Find menu item by item code
  async findOne(criteria: { itemCode?: string }): Promise<(MenuItemData & { _id: string }) | null> {
    try {
      if (criteria.itemCode) {
        const menuItemsCollection = firestoreAdmin.collection("menuItems")
        const menuItemQuery = firestoreAdmin.query(
          menuItemsCollection,
          firestoreAdmin.where("itemCode", "==", criteria.itemCode),
          firestoreAdmin.limit(1),
        )
        const snapshot = await firestoreAdmin.getDocs(menuItemQuery)

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          return {
            _id: doc.id,
            ...(doc.data() as MenuItemData),
          }
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error finding menu item: ${error.message}`)
    }
  },

  // Create a new menu item
  async create(menuItemData: MenuItemData): Promise<MenuItemData & { _id: string }> {
    try {
      // Generate a unique ID
      const id = generateId()

      const newMenuItem = {
        ...menuItemData,
        isAvailable: menuItemData.isAvailable !== undefined ? menuItemData.isAvailable : true,
        image: menuItemData.image || "/placeholder.svg?height=200&width=300",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      await firestoreAdmin.setDoc(firestoreAdmin.doc("menuItems", id), newMenuItem)

      return {
        _id: id,
        ...newMenuItem,
      }
    } catch (error: any) {
      throw new Error(`Error creating menu item: ${error.message}`)
    }
  },

  // Find menu item by ID and update
  async findByIdAndUpdate(
    id: string,
    updateData: Partial<MenuItemData>,
  ): Promise<(MenuItemData & { _id: string }) | null> {
    try {
      const menuItemRef = firestoreAdmin.doc("menuItems", id)
      const snapshot = await firestoreAdmin.getDoc(menuItemRef)

      if (snapshot.exists) {
        const updatedMenuItem = {
          ...updateData,
          updatedAt: Date.now(),
        }

        await firestoreAdmin.updateDoc(menuItemRef, updatedMenuItem)

        const updatedSnapshot = await firestoreAdmin.getDoc(menuItemRef)
        return {
          _id: id,
          ...(updatedSnapshot.data() as MenuItemData),
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error updating menu item: ${error.message}`)
    }
  },

  // Find menu item by ID and delete
  async findByIdAndDelete(id: string): Promise<(MenuItemData & { _id: string }) | null> {
    try {
      const menuItemRef = firestoreAdmin.doc("menuItems", id)
      const snapshot = await firestoreAdmin.getDoc(menuItemRef)

      if (snapshot.exists) {
        const menuItemData = snapshot.data() as MenuItemData
        await firestoreAdmin.deleteDoc(menuItemRef)

        return {
          _id: id,
          ...menuItemData,
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error deleting menu item: ${error.message}`)
    }
  },
}

export default MenuItem
