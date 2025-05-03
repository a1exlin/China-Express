"use client"

import { type ReactNode, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

type PosLayoutProps = {
  children: ReactNode
}

export default function PosLayout({ children }: PosLayoutProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const isAdmin = user?.isAdmin

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Restaurant POS</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name} ({isAdmin ? "Admin" : "Cashier"})
            </span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>

          <div className="relative flex flex-col w-64 max-w-xs bg-white h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                <li>
                  <Link href="/pos" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                    POS
                  </Link>
                </li>
                <li>
                  <Link href="/pos/orders" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                    Orders
                  </Link>
                </li>
                {isAdmin && (
                  <>
                    <li>
                      <Link href="/admin/menu" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                        Menu Management
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/categories" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/users" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                        Users
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/settings" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                        Settings
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
