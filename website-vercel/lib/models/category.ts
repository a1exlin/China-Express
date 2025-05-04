import { firestoreAdmin } from "../firebase-utils"
import crypto from "crypto"

export interface CategoryData {
  id: string
  name: string
  order?: number
  createdAt?: number
  updatedAt?: number
}

// Generate a unique ID (similar to MongoDB's ObjectId)
export function generateId(): string {
  return crypto.randomBytes(12).toString("hex")
}

// Category model for Firestore
const Category = {
  // Find all categories
  async find(): Promise<Array<CategoryData & { _id: string }>> {
    try {
      const categoriesCollection = firestoreAdmin.collection("categories")
      const categoriesQuery = firestoreAdmin.query(categoriesCollection, firestoreAdmin.orderBy("order"))
      const snapshot = await firestoreAdmin.getDocs(categoriesQuery)
      const categories: Array<CategoryData & { _id: string }> = []

      snapshot.forEach((doc) => {
        categories.push({
          _id: doc.id,
          ...(doc.data() as CategoryData),
        })
      })

      return categories
    } catch (error: any) {
      throw new Error(`Error finding categories: ${error.message}`)
    }
  },

  // Find category by ID
  async findById(id: string): Promise<(CategoryData & { _id: string }) | null> {
    try {
      const categoryRef = firestoreAdmin.doc("categories", id)
      const snapshot = await firestoreAdmin.getDoc(categoryRef)

      if (snapshot.exists) {
        return {
          _id: id,
          ...(snapshot.data() as CategoryData),
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error finding category: ${error.message}`)
    }
  },

  // Create a new category
  async create(categoryData: CategoryData): Promise<CategoryData & { _id: string }> {
    try {
      // Generate a unique ID if not provided
      const id = categoryData.id || generateId()

      const newCategory = {
        ...categoryData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      await firestoreAdmin.setDoc(firestoreAdmin.doc("categories", id), newCategory)

      return {
        _id: id,
        ...newCategory,
      }
    } catch (error: any) {
      throw new Error(`Error creating category: ${error.message}`)
    }
  },

  // Find category by ID and update
  async findByIdAndUpdate(
    id: string,
    updateData: Partial<CategoryData>,
  ): Promise<(CategoryData & { _id: string }) | null> {
    try {
      const categoryRef = firestoreAdmin.doc("categories", id)
      const snapshot = await firestoreAdmin.getDoc(categoryRef)

      if (snapshot.exists) {
        const updatedCategory = {
          ...updateData,
          updatedAt: Date.now(),
        }

        await firestoreAdmin.updateDoc(categoryRef, updatedCategory)

        const updatedSnapshot = await firestoreAdmin.getDoc(categoryRef)
        return {
          _id: id,
          ...(updatedSnapshot.data() as CategoryData),
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error updating category: ${error.message}`)
    }
  },

  // Find category by ID and delete
  async findByIdAndDelete(id: string): Promise<(CategoryData & { _id: string }) | null> {
    try {
      const categoryRef = firestoreAdmin.doc("categories", id)
      const snapshot = await firestoreAdmin.getDoc(categoryRef)

      if (snapshot.exists) {
        const categoryData = snapshot.data() as CategoryData
        await firestoreAdmin.deleteDoc(categoryRef)

        return {
          _id: id,
          ...categoryData,
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error deleting category: ${error.message}`)
    }
  },
}

export default Category
