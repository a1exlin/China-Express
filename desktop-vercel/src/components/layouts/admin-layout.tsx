"use client"

import { type ReactNode, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-200 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button className="md:hidden text-white focus:outline-none" onClick={() => setIsSidebarOpen(false)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-4">
          <Link href="/pos" className="block px-4 py-2 hover:bg-gray-700">
            POS System
          </Link>
          <Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/admin/menu" className="block px-4 py-2 hover:bg-gray-700">
            Menu Management
          </Link>
          <Link href="/admin/categories" className="block px-4 py-2 hover:bg-gray-700">
            Categories
          </Link>
          <Link href="/admin/orders" className="block px-4 py-2 hover:bg-gray-700">
            Orders
          </Link>
          <Link href="/admin/users" className="block px-4 py-2 hover:bg-gray-700">
            Users
          </Link>
          <Link href="/admin/settings" className="block px-4 py-2 hover:bg-gray-700">
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <div className="flex items-center mb-4">
            <div className="mr-3">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
              <p className="text-xs text-gray-400">{user?.email || "admin@example.com"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button className="md:hidden text-gray-600 focus:outline-none" onClick={() => setIsSidebarOpen(true)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="text-lg font-medium">Restaurant POS Admin</div>

          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">{user?.name}</span>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-64px)] overflow-auto">{children}</div>
      </div>
    </div>
  )
}
