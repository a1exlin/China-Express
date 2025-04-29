"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function AdminPage() {
  const { user, logout, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("menu-items")
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [users, setUsers] = useState([])
  const [settings, setSettings] = useState({
    taxPercentage: 8.25,
    deliveryFee: 3.99,
    serviceCharge: 0,
    minimumOrderAmount: 15,
    restaurantName: "China Express",
    phoneNumber: "(555) 123-4567",
    address: "123 Main Street, Anytown",
    openingHours: "Mon-Sun: 11:00 AM - 10:00 PM",
  })

  const [newCategory, setNewCategory] = useState({
    id: "",
    name: "",
    order: 0,
  })

  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    itemCode: "",
    description: "",
    price: "",
    category: "",
    image: "/placeholder.svg?height=200&width=300",
    isAvailable: true,
  })

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Direct API call to check authentication status
  useEffect(() => {
    async function checkAuth() {
      try {
        console.log("Checking authentication status...")
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            "x-timestamp": Date.now().toString(),
          },
        })

        if (res.ok) {
          const data = await res.json()
          console.log("Auth check successful:", data)
          setUserData(data.user)
        } else {
          console.log("Auth check failed:", res.status)
          setError("Authentication failed. Please log in again.")
          // Don't redirect here - we'll show an error message instead
        }
      } catch (err) {
        console.error("Auth check error:", err)
        setError("Error checking authentication. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect to login on logout error
      window.location.href = "/admin/login"
    }
  }

  // Check if user is authenticated
  useEffect(() => {
    let redirectTimer

    if (!authLoading) {
      if (!user) {
        console.log("No user found after auth check, redirecting to login")
        setIsRedirecting(true)
        // Use a timeout to avoid immediate redirect which can cause loops
        redirectTimer = setTimeout(() => {
          window.location.href = "/admin/login"
        }, 100)
      } else {
        setIsRedirecting(false)
      }
      setAuthChecked(true)
    }

    return () => clearTimeout(redirectTimer)
  }, [user, authLoading])

  // Fetch data once authenticated
  useEffect(() => {
    async function fetchData() {
      if (!authChecked || !user) return

      try {
        setLoading(true)

        // Fetch categories
        const categoriesRes = await fetch("/api/categories")
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)

        // Fetch menu items
        const menuItemsRes = await fetch("/api/menu")
        const menuItemsData = await menuItemsRes.json()
        setMenuItems(menuItemsData)

        // Fetch settings
        const settingsRes = await fetch("/api/settings")
        const settingsData = await settingsRes.json()
        if (settingsData) {
          setSettings(settingsData)
        }

        // Fetch users if first admin
        if (user?.isFirstAdmin) {
          const usersRes = await fetch("/api/auth/users")
          if (usersRes.ok) {
            const usersData = await usersRes.json()
            setUsers(usersData)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data", {
          description: "Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, authChecked])

  const handleCategoryChange = (e) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleMenuItemChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewMenuItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSettingsChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleUserChange = (e) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setChangePasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategorySelect = (value) => {
    setNewMenuItem((prev) => ({ ...prev, category: value }))
  }

  const addCategory = async () => {
    if (!newCategory.id || !newCategory.name) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields.",
      })
      return
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      })

      if (!res.ok) throw new Error("Failed to add category")

      const data = await res.json()
      setCategories((prev) => [...prev, data])
      setNewCategory({ id: "", name: "", order: 0 })

      toast.success("Category added", {
        description: "The category has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding category:", error)
      toast.error("Failed to add category", {
        description: error.message,
      })
    }
  }

  const deleteCategory = async (id) => {
    if (
      !confirm("Are you sure you want to delete this category? This will also delete all menu items in this category.")
    ) {
      return
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete category")

      setCategories((prev) => prev.filter((category) => category._id !== id))

      toast.success("Category deleted", {
        description: "The category has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Failed to delete category", {
        description: error.message,
      })
    }
  }

  const addMenuItem = async () => {
    if (
      !newMenuItem.name ||
      !newMenuItem.itemCode ||
      !newMenuItem.description ||
      !newMenuItem.price ||
      !newMenuItem.category
    ) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields.",
      })
      return
    }

    try {
      const menuItemToAdd = {
        ...newMenuItem,
        price: Number.parseFloat(newMenuItem.price),
      }

      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuItemToAdd),
      })

      if (!res.ok) throw new Error("Failed to add menu item")

      const data = await res.json()
      setMenuItems((prev) => [...prev, data])
      setNewMenuItem({
        name: "",
        itemCode: "",
        description: "",
        price: "",
        category: "",
        image: "/placeholder.svg?height=200&width=300",
        isAvailable: true,
      })

      toast.success("Menu item added", {
        description: "The menu item has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding menu item:", error)
      toast.error("Failed to add menu item", {
        description: error.message,
      })
    }
  }

  const deleteMenuItem = async (id) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return
    }

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete menu item")

      setMenuItems((prev) => prev.filter((item) => item._id !== id))

      toast.success("Menu item deleted", {
        description: "The menu item has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting menu item:", error)
      toast.error("Failed to delete menu item", {
        description: error.message,
      })
    }
  }

  const saveSettings = async () => {
    try {
      const settingsToSave = {
        ...settings,
        taxPercentage: Number.parseFloat(settings.taxPercentage),
        deliveryFee: Number.parseFloat(settings.deliveryFee),
        serviceCharge: Number.parseFloat(settings.serviceCharge),
        minimumOrderAmount: Number.parseFloat(settings.minimumOrderAmount),
      }

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsToSave),
      })

      if (!res.ok) throw new Error("Failed to save settings")

      toast.success("Settings saved", {
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings", {
        description: error.message,
      })
    }
  }

  const addUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields.",
      })
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure your passwords match.",
      })
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add user")
      }

      // Refresh users list
      const usersRes = await fetch("/api/auth/users")
      const usersData = await usersRes.json()
      setUsers(usersData)

      setNewUser({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })

      setIsAddingUser(false)

      toast.success("User added", {
        description: "The user has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding user:", error)
      toast.error("Failed to add user", {
        description: error.message,
      })
    }
  }

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete user")
      }

      setUsers((prev) => prev.filter((user) => user._id !== id))

      toast.success("User deleted", {
        description: "The user has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user", {
        description: error.message,
      })
    }
  }

  const changePassword = async () => {
    if (!changePasswordData.currentPassword || !changePasswordData.newPassword) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields.",
      })
      return
    }

    if (changePasswordData.newPassword !== changePasswordData.confirmNewPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure your new passwords match.",
      })
      return
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: changePasswordData.currentPassword,
          newPassword: changePasswordData.newPassword,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to change password")
      }

      setChangePasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      })

      setIsChangingPassword(false)

      toast.success("Password changed", {
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error("Failed to change password", {
        description: error.message,
      })
    }
  }

  // Show loading state
  if (isLoading || authLoading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-2">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">{error}</p>
            <Button
              onClick={() => (window.location.href = "/admin/login")}
              className="bg-secondary hover:bg-secondary/90"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show admin dashboard if authenticated
  const authenticatedUser = userData || user

  if (!authenticatedUser) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Not Authenticated</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You need to log in to access the admin panel.</p>
            <Button
              onClick={() => (window.location.href = "/admin/login")}
              className="bg-secondary hover:bg-secondary/90"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Rest of your admin page component...
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Welcome, {authenticatedUser.name}!</h2>
            <p className="text-gray-600">You are logged in as: {authenticatedUser.email}</p>
            <p className="text-gray-600">Role: {authenticatedUser.isFirstAdmin ? "Super Admin" : "Admin"}</p>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={() => (window.location.href = "/admin/dashboard")}
              className="bg-secondary hover:bg-secondary/90"
            >
              Go to Full Dashboard
            </Button>
            <Button variant="outline" className="border-red-600 text-red-600" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
