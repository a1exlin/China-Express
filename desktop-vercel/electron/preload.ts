import { contextBridge, ipcRenderer } from "electron"

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  // Database initialization
  initializeDatabase: () => ipcRenderer.invoke("initialize-database"),

  // Authentication
  login: (credentials: { email: string; password: string }) => ipcRenderer.invoke("login", credentials),

  // Menu Items
  getMenuItems: () => ipcRenderer.invoke("get-menu-items"),
  getMenuItem: (id: number) => ipcRenderer.invoke("get-menu-item", id),
  createMenuItem: (data: any) => ipcRenderer.invoke("create-menu-item", data),
  updateMenuItem: (id: number, data: any) => ipcRenderer.invoke("update-menu-item", { id, data }),
  deleteMenuItem: (id: number) => ipcRenderer.invoke("delete-menu-item", id),

  // Categories
  getCategories: () => ipcRenderer.invoke("get-categories"),
  createCategory: (data: any) => ipcRenderer.invoke("create-category", data),
  updateCategory: (id: number, data: any) => ipcRenderer.invoke("update-category", { id, data }),
  deleteCategory: (id: number) => ipcRenderer.invoke("delete-category", id),

  // Orders
  getOrders: () => ipcRenderer.invoke("get-orders"),
  createOrder: (data: any) => ipcRenderer.invoke("create-order", data),
  updateOrderStatus: (id: number, status: string) => ipcRenderer.invoke("update-order-status", { id, status }),

  // Users
  getUsers: () => ipcRenderer.invoke("get-users"),

  // Settings
  getSettings: () => ipcRenderer.invoke("get-settings"),
  updateSettings: (data: any) => ipcRenderer.invoke("update-settings", data),

  // POS Functions
  printReceipt: (data: any) => ipcRenderer.invoke("print-receipt", data),
  openCashDrawer: () => ipcRenderer.invoke("open-cash-drawer"),
})
