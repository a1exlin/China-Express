"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePosContext, type MenuItem } from "@/contexts/pos-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Edit, Save, Trash2, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Admin() {
  const router = useRouter()
  const { menuItems, categories, updateMenuItem, addMenuItem, deleteMenuItem, addCategory, deleteCategory } =
    usePosContext()

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    price: 0,
    category: categories[0]?.name || "",
  })

  // Handle edit item
  const handleEditItem = (item: MenuItem) => {
    setEditingItem({ ...item })
  }

  // Handle save edited item
  const handleSaveItem = () => {
    if (editingItem) {
      updateMenuItem(editingItem)
      setEditingItem(null)
    }
  }

  // Handle add new item
  const handleAddItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      addMenuItem({
        id: Date.now().toString(),
        name: newItem.name,
        price: typeof newItem.price === "number" ? newItem.price : Number.parseFloat(newItem.price as string),
        category: newItem.category,
      })

      // Reset form
      setNewItem({
        name: "",
        price: 0,
        category: categories[0]?.name || "",
      })
    }
  }

  // Handle add new category
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory({
        id: Date.now().toString(),
        name: newCategory.toLowerCase().trim(),
      })
      setNewCategory("")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="w-[100px]"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto p-4 flex-1">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* Menu Management Tab */}
          <TabsContent value="menu">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Menu Items List */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {editingItem?.id === item.id ? (
                              <Input
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              />
                            ) : (
                              item.name
                            )}
                          </TableCell>
                          <TableCell>
                            {editingItem?.id === item.id ? (
                              <Select
                                value={editingItem.category}
                                onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.name}>
                                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              item.category.charAt(0).toUpperCase() + item.category.slice(1)
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingItem?.id === item.id ? (
                              <Input
                                type="number"
                                step="0.01"
                                value={editingItem.price}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    price: Number.parseFloat(e.target.value),
                                  })
                                }
                                className="w-24 ml-auto"
                              />
                            ) : (
                              `$${item.price.toFixed(2)}`
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingItem?.id === item.id ? (
                              <Button size="sm" onClick={handleSaveItem} className="mr-2">
                                <Save className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => handleEditItem(item)} className="mr-2">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => deleteMenuItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Add New Item */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Item Name</Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleAddItem}
                      disabled={!newItem.name || !newItem.price || !newItem.category}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories List */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Add New Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input id="categoryName" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                    </div>
                    <Button className="w-full" onClick={handleAddCategory} disabled={!newCategory.trim()}>
                      <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
