"use client"

import { useState, useEffect } from "react"
import { Loader2, Plus, Save, Trash2, UserPlus, Key } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"

export default function AdminPage() {
  const { user, logout } = useAuth()
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

  useEffect(() => {
    async function fetchData() {
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

    if (user) {
      fetchData()
    }
  }, [user])

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

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-2">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage your restaurant's menu, categories, and settings.</p>
        </div>
        <div className="mt-4 flex flex-col gap-2 md:mt-0 md:flex-row">
          <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-secondary text-secondary">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>Enter your current password and a new password below.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={changePasswordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={changePasswordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    value={changePasswordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
                <Button className="bg-secondary hover:bg-secondary/90" onClick={changePassword}>
                  Change Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="border-red-600 text-red-600" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="menu-items" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          {user?.isFirstAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
        </TabsList>

        <TabsContent value="menu-items" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Add Menu Item</CardTitle>
                  <CardDescription>Create a new menu item to display on your website.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Item Name</Label>
                      <Input id="name" name="name" value={newMenuItem.name} onChange={handleMenuItemChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemCode">Item Code</Label>
                      <Input
                        id="itemCode"
                        name="itemCode"
                        value={newMenuItem.itemCode}
                        onChange={handleMenuItemChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newMenuItem.description}
                        onChange={handleMenuItemChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newMenuItem.price}
                        onChange={handleMenuItemChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={newMenuItem.category} onValueChange={handleCategorySelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" name="image" value={newMenuItem.image} onChange={handleMenuItemChange} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        name="isAvailable"
                        checked={newMenuItem.isAvailable}
                        onChange={handleMenuItemChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="isAvailable">Available</Label>
                    </div>
                    <Button type="button" className="w-full bg-secondary hover:bg-secondary/90" onClick={addMenuItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Menu Item
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Menu Items</CardTitle>
                  <CardDescription>Manage your existing menu items.</CardDescription>
                </CardHeader>
                <CardContent>
                  {menuItems.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {menuItems.map((item) => (
                            <TableRow key={item._id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.itemCode}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>${item.price.toFixed(2)}</TableCell>
                              <TableCell>{item.isAvailable ? "Yes" : "No"}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => deleteMenuItem(item._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No menu items found.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Add Category</CardTitle>
                  <CardDescription>Create a new category for organizing menu items.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="id">Category ID</Label>
                      <Input id="id" name="id" value={newCategory.id} onChange={handleCategoryChange} required />
                      <p className="text-xs text-gray-500">
                        Use lowercase letters, numbers, and hyphens only (e.g., "appetizers").
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Category Name</Label>
                      <Input id="name" name="name" value={newCategory.name} onChange={handleCategoryChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order">Display Order</Label>
                      <Input
                        id="order"
                        name="order"
                        type="number"
                        min="0"
                        value={newCategory.order}
                        onChange={handleCategoryChange}
                      />
                    </div>
                    <Button type="button" className="w-full bg-secondary hover:bg-secondary/90" onClick={addCategory}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>Manage your existing categories.</CardDescription>
                </CardHeader>
                <CardContent>
                  {categories.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categories.map((category) => (
                            <TableRow key={category._id}>
                              <TableCell className="font-medium">{category.id}</TableCell>
                              <TableCell>{category.name}</TableCell>
                              <TableCell>{category.order}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => deleteCategory(category._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No categories found.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Settings</CardTitle>
              <CardDescription>Configure your restaurant's information and order settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName">Restaurant Name</Label>
                    <Input
                      id="restaurantName"
                      name="restaurantName"
                      value={settings.restaurantName}
                      onChange={handleSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={settings.phoneNumber}
                      onChange={handleSettingsChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={settings.address} onChange={handleSettingsChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openingHours">Opening Hours</Label>
                  <Input
                    id="openingHours"
                    name="openingHours"
                    value={settings.openingHours}
                    onChange={handleSettingsChange}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
                    <Input
                      id="taxPercentage"
                      name="taxPercentage"
                      type="number"
                      step="0.01"
                      min="0"
                      value={settings.taxPercentage}
                      onChange={handleSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                    <Input
                      id="deliveryFee"
                      name="deliveryFee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={settings.deliveryFee}
                      onChange={handleSettingsChange}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="serviceCharge">Service Charge ($)</Label>
                    <Input
                      id="serviceCharge"
                      name="serviceCharge"
                      type="number"
                      step="0.01"
                      min="0"
                      value={settings.serviceCharge}
                      onChange={handleSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumOrderAmount">Minimum Order Amount ($)</Label>
                    <Input
                      id="minimumOrderAmount"
                      name="minimumOrderAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={settings.minimumOrderAmount}
                      onChange={handleSettingsChange}
                    />
                  </div>
                </div>
                <Button type="button" className="bg-secondary hover:bg-secondary/90" onClick={saveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.isFirstAdmin && (
          <TabsContent value="users" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Create and manage admin users.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-secondary hover:bg-secondary/90">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add New User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                          <DialogDescription>Create a new admin user for the restaurant.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={newUser.name} onChange={handleUserChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={newUser.email}
                              onChange={handleUserChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={newUser.password}
                              onChange={handleUserChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={newUser.confirmPassword}
                              onChange={handleUserChange}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddingUser(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-secondary hover:bg-secondary/90" onClick={addUser}>
                            Add User
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Users</CardTitle>
                    <CardDescription>Manage existing admin users.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {users.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user._id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.isFirstAdmin ? "Super Admin" : "Admin"}</TableCell>
                                <TableCell className="text-right">
                                  {!user.isFirstAdmin && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500"
                                      onClick={() => deleteUser(user._id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">No users found.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
