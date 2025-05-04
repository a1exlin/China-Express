import crypto from "crypto"
import { firestoreAdmin } from "../firebase-utils"

export interface UserData {
  email: string
  name: string
  hashedPassword?: string
  salt?: string
  isFirstAdmin?: boolean
  resetPasswordToken?: string
  resetPasswordExpire?: number
  createdAt?: number
  updatedAt?: number
}

export interface UserWithMethods extends UserData {
  _id: string
  validatePassword: (password: string) => boolean
  setPassword: (password: string) => void
  generateResetToken: () => string
  save: () => Promise<UserWithMethods>
}

// User model for Firestore
const User = {
  // Create a new user
  async create(userData: { email: string; name: string; password: string; isFirstAdmin?: boolean }): Promise<
    UserData & { _id: string }
  > {
    const { email, name, password, isFirstAdmin = false } = userData

    // Generate salt and hash password
    const salt = crypto.randomBytes(16).toString("hex")
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")

    try {
      // Create a unique ID for the user
      const userId = crypto.randomBytes(12).toString("hex")
      const userRef = firestoreAdmin.doc("users", userId)

      // Store user data in Firestore
      await firestoreAdmin.setDoc(userRef, {
        email,
        name,
        hashedPassword,
        salt,
        isFirstAdmin,
        createdAt: Date.now(),
      })

      return {
        _id: userId,
        email,
        name,
        isFirstAdmin,
      }
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`)
    }
  },

  // Find user by ID
  async findById(id: string): Promise<UserWithMethods | null> {
    try {
      const userRef = firestoreAdmin.doc("users", id)
      const userSnap = await firestoreAdmin.getDoc(userRef)

      if (userSnap.exists) {
        const userData = userSnap.data() as UserData
        return {
          _id: id,
          ...userData,
          // Add methods to the user object
          validatePassword: function (password: string): boolean {
            const hash = crypto.pbkdf2Sync(password, this.salt as string, 1000, 64, "sha512").toString("hex")
            return this.hashedPassword === hash
          },
          setPassword: function (password: string): void {
            this.salt = crypto.randomBytes(16).toString("hex")
            this.hashedPassword = crypto.pbkdf2Sync(password, this.salt as string, 1000, 64, "sha512").toString("hex")
            // Update the user in the database
            firestoreAdmin.updateDoc(firestoreAdmin.doc("users", id), {
              salt: this.salt,
              hashedPassword: this.hashedPassword,
            })
          },
          generateResetToken: function (): string {
            // Generate token
            const resetToken = crypto.randomBytes(20).toString("hex")

            // Hash token
            this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

            // Set expire time - 10 minutes
            this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

            // Update user in database
            firestoreAdmin.updateDoc(firestoreAdmin.doc("users", id), {
              resetPasswordToken: this.resetPasswordToken,
              resetPasswordExpire: this.resetPasswordExpire,
            })

            return resetToken
          },
          save: async function (): Promise<UserWithMethods> {
            // Update the user in the database
            await firestoreAdmin.updateDoc(firestoreAdmin.doc("users", id), {
              name: this.name,
              email: this.email,
              hashedPassword: this.hashedPassword,
              salt: this.salt,
              resetPasswordToken: this.resetPasswordToken,
              resetPasswordExpire: this.resetPasswordExpire,
            })
            return this
          },
        }
      }
      return null
    } catch (error: any) {
      throw new Error(`Error finding user: ${error.message}`)
    }
  },

  // Find user by email
  async findOne(criteria: { email?: string; resetPasswordToken?: string }): Promise<UserWithMethods | null> {
    try {
      let userQuery
      let querySnapshot

      if (criteria.email) {
        const usersCollection = firestoreAdmin.collection("users")
        userQuery = firestoreAdmin.query(
          usersCollection,
          firestoreAdmin.where("email", "==", criteria.email),
          firestoreAdmin.limit(1),
        )
      } else if (criteria.resetPasswordToken) {
        const usersCollection = firestoreAdmin.collection("users")
        userQuery = firestoreAdmin.query(
          usersCollection,
          firestoreAdmin.where("resetPasswordToken", "==", criteria.resetPasswordToken),
          firestoreAdmin.limit(1),
        )
      } else {
        return null
      }

      querySnapshot = await firestoreAdmin.getDocs(userQuery)

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]
        const userId = userDoc.id
        const userData = userDoc.data() as UserData

        // Check if token is expired for reset password token
        if (criteria.resetPasswordToken && userData.resetPasswordExpire && userData.resetPasswordExpire < Date.now()) {
          return null
        }

        return {
          _id: userId,
          ...userData,
          validatePassword: function (password: string): boolean {
            const hash = crypto.pbkdf2Sync(password, this.salt as string, 1000, 64, "sha512").toString("hex")
            return this.hashedPassword === hash
          },
          setPassword: function (password: string): void {
            this.salt = crypto.randomBytes(16).toString("hex")
            this.hashedPassword = crypto.pbkdf2Sync(password, this.salt as string, 1000, 64, "sha512").toString("hex")
          },
          generateResetToken: function (): string {
            // Generate token
            const resetToken = crypto.randomBytes(20).toString("hex")

            // Hash token
            this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

            // Set expire time - 10 minutes
            this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

            return resetToken
          },
          save: async function (): Promise<UserWithMethods> {
            // Update the user in the database
            await firestoreAdmin.updateDoc(firestoreAdmin.doc("users", userId), {
              name: this.name,
              email: this.email,
              hashedPassword: this.hashedPassword,
              salt: this.salt,
              resetPasswordToken: this.resetPasswordToken,
              resetPasswordExpire: this.resetPasswordExpire,
            })
            return this
          },
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error finding user: ${error.message}`)
    }
  },

  // Find user by ID and update
  async findByIdAndUpdate(id: string, updateData: Partial<UserData>): Promise<(UserData & { _id: string }) | null> {
    try {
      const userRef = firestoreAdmin.doc("users", id)
      const userSnap = await firestoreAdmin.getDoc(userRef)

      if (userSnap.exists) {
        await firestoreAdmin.updateDoc(userRef, {
          ...updateData,
          updatedAt: Date.now(),
        })

        const updatedSnap = await firestoreAdmin.getDoc(userRef)
        return {
          _id: id,
          ...(updatedSnap.data() as UserData),
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error updating user: ${error.message}`)
    }
  },

  // Find user by ID and delete
  async findByIdAndDelete(id: string): Promise<(UserData & { _id: string }) | null> {
    try {
      const userRef = firestoreAdmin.doc("users", id)
      const userSnap = await firestoreAdmin.getDoc(userRef)

      if (userSnap.exists) {
        const userData = userSnap.data() as UserData
        await firestoreAdmin.deleteDoc(userRef)
        return {
          _id: id,
          ...userData,
        }
      }

      return null
    } catch (error: any) {
      throw new Error(`Error deleting user: ${error.message}`)
    }
  },

  // Count documents
  async countDocuments(): Promise<number> {
    try {
      const usersCollection = firestoreAdmin.collection("users")
      const usersSnapshot = await firestoreAdmin.getDocs(usersCollection)
      return usersSnapshot.size
    } catch (error: any) {
      throw new Error(`Error counting users: ${error.message}`)
    }
  },

  // Find all users
  async find(): Promise<Array<UserData & { _id: string }>> {
    try {
      const usersCollection = firestoreAdmin.collection("users")
      const usersSnapshot = await firestoreAdmin.getDocs(usersCollection)
      const users: Array<UserData & { _id: string }> = []

      usersSnapshot.forEach((doc) => {
        users.push({
          _id: doc.id,
          ...(doc.data() as UserData),
        })
      })

      return users
    } catch (error: any) {
      throw new Error(`Error finding users: ${error.message}`)
    }
  },
}

export default User
