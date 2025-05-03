import { app, BrowserWindow, ipcMain } from "electron"
import * as path from "path"
import { connectToDatabase } from "../src/lib/database"

let mainWindow: BrowserWindow | null = null
const isDev = process.env.NODE_ENV === "development"

// Database path
const userDataPath = app.getPath("userData")
const dbPath = path.join(userDataPath, "restaurant-pos.db")

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  })

  const startUrl = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  try {
    await connectToDatabase(dbPath)
    console.log("Connected to database")
  } catch (error) {
    console.error("Failed to connect to database:", error)
  }

  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// IPC handlers for menu items
ipcMain.handle("get-menu-items", async () => {
  try {
    const db = await connectToDatabase(dbPath)
    const menuItems = await db.all("SELECT * FROM menu_items")
    return menuItems
  } catch (error) {
    console.error("Error fetching menu items:", error)
    throw error
  }
})

ipcMain.handle("get-menu-item", async (_, id) => {
  try {
    const db = await connectToDatabase(dbPath)
    const menuItem = await db.get("SELECT * FROM menu_items WHERE id = ?", id)
    return menuItem
  } catch (error) {
    console.error("Error fetching menu item:", error)
    throw error
  }
})

ipcMain.handle("create-menu-item", async (_, menuItemData) => {
  try {
    const db = await connectToDatabase(dbPath)
    const result = await db.run(
      `INSERT INTO menu_items (name, item_code, description, price, category_id, image, is_available) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        menuItemData.name,
        menuItemData.itemCode,
        menuItemData.description,
        menuItemData.price,
        menuItemData.category,
        menuItemData.image,
        menuItemData.isAvailable ? 1 : 0,
      ],
    )

    const menuItem = await db.get("SELECT * FROM menu_items WHERE id = ?", result.lastID)
    return menuItem
  } catch (error) {
    console.error("Error creating menu item:", error)
    throw error
  }
})

ipcMain.handle("update-menu-item", async (_, { id, data }) => {
  try {
    const db = await connectToDatabase(dbPath)
    await db.run(
      `UPDATE menu_items 
       SET name = ?, item_code = ?, description = ?, price = ?, 
           category_id = ?, image = ?, is_available = ?
       WHERE id = ?`,
      [data.name, data.itemCode, data.description, data.price, data.category, data.image, data.isAvailable ? 1 : 0, id],
    )

    const menuItem = await db.get("SELECT * FROM menu_items WHERE id = ?", id)
    return menuItem
  } catch (error) {
    console.error("Error updating menu item:", error)
    throw error
  }
})

ipcMain.handle("delete-menu-item", async (_, id) => {
  try {
    const db = await connectToDatabase(dbPath)
    await db.run("DELETE FROM menu_items WHERE id = ?", id)
    return { success: true }
  } catch (error) {
    console.error("Error deleting menu item:", error)
    throw error
  }
})

// IPC handlers for categories
ipcMain.handle("get-categories", async () => {
  try {
    const db = await connectToDatabase(dbPath)
    const categories = await db.all("SELECT * FROM categories ORDER BY display_order")
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
})

ipcMain.handle("create-category", async (_, categoryData) => {
  try {
    const db = await connectToDatabase(dbPath)
    const result = await db.run("INSERT INTO categories (name, display_order) VALUES (?, ?)", [
      categoryData.name,
      categoryData.displayOrder,
    ])

    const category = await db.get("SELECT * FROM categories WHERE id = ?", result.lastID)
    return category
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
})

ipcMain.handle("update-category", async (_, { id, data }) => {
  try {
    const db = await connectToDatabase(dbPath)
    await db.run("UPDATE categories SET name = ?, display_order = ? WHERE id = ?", [data.name, data.displayOrder, id])

    const category = await db.get("SELECT * FROM categories WHERE id = ?", id)
    return category
  } catch (error) {
    console.error("Error updating category:", error)
    throw error
  }
})

ipcMain.handle("delete-category", async (_, id) => {
  try {
    const db = await connectToDatabase(dbPath)
    await db.run("DELETE FROM categories WHERE id = ?", id)
    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
})

// IPC handlers for orders
ipcMain.handle("get-orders", async () => {
  try {
    const db = await connectToDatabase(dbPath)
    const orders = await db.all("SELECT * FROM orders ORDER BY created_at DESC")

    // Get order items for each order
    for (const order of orders) {
      const orderItems = await db.all("SELECT * FROM order_items WHERE order_id = ?", order.id)
      order.items = orderItems
    }

    return orders
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
})

ipcMain.handle("create-order", async (_, orderData) => {
  try {
    const db = await connectToDatabase(dbPath)

    // Begin transaction
    await db.run("BEGIN TRANSACTION")

    // Insert order
    const orderResult = await db.run(
      `INSERT INTO orders (
        customer_name, subtotal, tax, total, payment_method, 
        order_type, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        orderData.customerName,
        orderData.subtotal,
        orderData.tax,
        orderData.total,
        orderData.paymentMethod,
        orderData.orderType,
        orderData.status,
      ],
    )

    const orderId = orderResult.lastID

    // Insert order items
    for (const item of orderData.items) {
      await db.run(
        `INSERT INTO order_items (
          order_id, menu_item_id, name, price, quantity
        ) VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.menuItemId, item.name, item.price, item.quantity],
      )
    }

    // Commit transaction
    await db.run("COMMIT")

    // Get the created order with items
    const order = await db.get("SELECT * FROM orders WHERE id = ?", orderId)
    const orderItems = await db.all("SELECT * FROM order_items WHERE order_id = ?", orderId)
    order.items = orderItems

    return order
  } catch (error) {
    // Rollback transaction on error
    const db = await connectToDatabase(dbPath)
    await db.run("ROLLBACK")

    console.error("Error creating order:", error)
    throw error
  }
})

ipcMain.handle("update-order-status", async (_, { id, status }) => {
  try {
    const db = await connectToDatabase(dbPath)
    await db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id])

    const order = await db.get("SELECT * FROM orders WHERE id = ?", id)
    return order
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
})

// IPC handlers for settings
ipcMain.handle("get-settings", async () => {
  try {
    const db = await connectToDatabase(dbPath)
    const settings = await db.get("SELECT * FROM settings LIMIT 1")
    return settings || { tax_percentage: 8.0, restaurant_name: "Restaurant POS" }
  } catch (error) {
    console.error("Error fetching settings:", error)
    throw error
  }
})

ipcMain.handle("update-settings", async (_, settingsData) => {
  try {
    const db = await connectToDatabase(dbPath)
    const existingSettings = await db.get("SELECT * FROM settings LIMIT 1")

    if (existingSettings) {
      await db.run("UPDATE settings SET tax_percentage = ?, restaurant_name = ?", [
        settingsData.taxPercentage,
        settingsData.restaurantName,
      ])
    } else {
      await db.run("INSERT INTO settings (tax_percentage, restaurant_name) VALUES (?, ?)", [
        settingsData.taxPercentage,
        settingsData.restaurantName,
      ])
    }

    const settings = await db.get("SELECT * FROM settings LIMIT 1")
    return settings
  } catch (error) {
    console.error("Error updating settings:", error)
    throw error
  }
})

// IPC handlers for users
ipcMain.handle("get-users", async () => {
  try {
    const db = await connectToDatabase(dbPath)
    const users = await db.all("SELECT id, name, email, is_admin FROM users")
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
})

ipcMain.handle("login", async (_, { email, password }) => {
  try {
    const db = await connectToDatabase(dbPath)
    const user = await db.get("SELECT * FROM users WHERE email = ?", email)

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // In a real app, you would hash the password and compare
    if (user.password !== password) {
      return { success: false, message: "Invalid password" }
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin === 1,
      },
    }
  } catch (error) {
    console.error("Error during login:", error)
    throw error
  }
})

// Print receipt
ipcMain.handle("print-receipt", async (_, receiptData) => {
  try {
    // In a real application, you would integrate with a receipt printer here
    console.log("Printing receipt:", receiptData)
    return { success: true }
  } catch (error) {
    console.error("Error printing receipt:", error)
    throw error
  }
})

// Open cash drawer
ipcMain.handle("open-cash-drawer", async () => {
  try {
    // In a real application, you would integrate with a cash drawer here
    console.log("Opening cash drawer")
    return { success: true }
  } catch (error) {
    console.error("Error opening cash drawer:", error)
    throw error
  }
})

// Initialize database
ipcMain.handle("initialize-database", async () => {
  try {
    const db = await connectToDatabase(dbPath)

    // Create tables if they don't exist
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0
      )
    `)

    await db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        display_order INTEGER DEFAULT 0
      )
    `)

    await db.run(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        item_code TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category_id INTEGER,
        image TEXT,
        is_available INTEGER DEFAULT 1,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `)

    await db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT,
        subtotal REAL NOT NULL,
        tax REAL NOT NULL,
        total REAL NOT NULL,
        payment_method TEXT NOT NULL,
        order_type TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `)

    await db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        menu_item_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
      )
    `)

    await db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tax_percentage REAL DEFAULT 8.0,
        restaurant_name TEXT DEFAULT 'Restaurant POS'
      )
    `)

    // Check if we need to seed initial data
    const userCount = await db.get("SELECT COUNT(*) as count FROM users")

    if (userCount.count === 0) {
      // Seed admin user
      await db.run("INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)", [
        "Admin User",
        "admin@example.com",
        "admin123",
        1,
      ])

      // Seed cashier user
      await db.run("INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)", [
        "Cashier User",
        "cashier@example.com",
        "cashier123",
        0,
      ])

      // Seed categories
      const categories = [
        { name: "Appetizers", display_order: 1 },
        { name: "Main Courses", display_order: 2 },
        { name: "Desserts", display_order: 3 },
        { name: "Beverages", display_order: 4 },
      ]

      for (const category of categories) {
        await db.run("INSERT INTO categories (name, display_order) VALUES (?, ?)", [
          category.name,
          category.display_order,
        ])
      }

      // Get category IDs
      const categoryRecords = await db.all("SELECT * FROM categories")
      const categoryMap = categoryRecords.reduce((map, category) => {
        map[category.name] = category.id
        return map
      }, {})

      // Seed menu items
      const menuItems = [
        {
          name: "French Fries",
          item_code: "APP001",
          description: "Crispy golden fries served with ketchup",
          price: 4.99,
          category_id: categoryMap["Appetizers"],
          is_available: 1,
        },
        {
          name: "Chicken Wings",
          item_code: "APP002",
          description: "Spicy buffalo wings with blue cheese dip",
          price: 8.99,
          category_id: categoryMap["Appetizers"],
          is_available: 1,
        },
        {
          name: "Burger",
          item_code: "MAIN001",
          description: "Juicy beef patty with lettuce, tomato, and cheese",
          price: 12.99,
          category_id: categoryMap["Main Courses"],
          is_available: 1,
        },
        {
          name: "Steak",
          item_code: "MAIN002",
          description: "Grilled ribeye steak with mashed potatoes",
          price: 24.99,
          category_id: categoryMap["Main Courses"],
          is_available: 1,
        },
        {
          name: "Chocolate Cake",
          item_code: "DES001",
          description: "Rich chocolate cake with vanilla ice cream",
          price: 6.99,
          category_id: categoryMap["Desserts"],
          is_available: 1,
        },
        {
          name: "Soda",
          item_code: "BEV001",
          description: "Refreshing carbonated drink",
          price: 2.49,
          category_id: categoryMap["Beverages"],
          is_available: 1,
        },
      ]

      for (const item of menuItems) {
        await db.run(
          `INSERT INTO menu_items (
            name, item_code, description, price, category_id, is_available
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [item.name, item.item_code, item.description, item.price, item.category_id, item.is_available],
        )
      }

      // Seed settings
      await db.run("INSERT INTO settings (tax_percentage, restaurant_name) VALUES (?, ?)", [8.0, "Restaurant POS"])
    }

    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
})
