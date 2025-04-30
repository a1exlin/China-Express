"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

export default function AdminDashboardPage() {
  const { user, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [activeTab, setActiveTab] = useState("menu-items")

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        console.log("No user found, redirecting to admin home")
        window.location.href = "/admin"
        return
      }

      // Fetch data
      fetchData()
    }
  }, [user, authLoading])

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
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data", {
        description: "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}!</p>
        </div>
        <div className="mt-4 flex gap-4 md:mt-0">
          <Button variant="outline" onClick={() => (window.location.href = "/admin")}>
            Back to Admin Home
          </Button>
          <Button variant="outline" className="border-red-600 text-red-600" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="menu-items" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>You have {menuItems.length} menu items.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Menu items management will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>You have {categories.length} categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Category management will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure your restaurant settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Settings management will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
