"use client"

import type React from "react"
import { useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"

// Pages
import LoginPage from "./pages/LoginPage"
import PosPage from "./pages/pos/PosPage"
import OrdersPage from "./pages/pos/OrdersPage"
import AdminDashboardPage from "./pages/admin/DashboardPage"
import AdminMenuPage from "./pages/admin/MenuPage"
import AdminMenuEditPage from "./pages/admin/MenuEditPage"
import AdminMenuNewPage from "./pages/admin/MenuNewPage"
import AdminCategoriesPage from "./pages/admin/CategoriesPage"
import AdminUsersPage from "./pages/admin/UsersPage"
import AdminSettingsPage from "./pages/admin/SettingsPage"

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    }

    if (!loading && requireAdmin && !user?.isAdmin) {
      navigate("/pos")
    }
  }, [user, loading, navigate, requireAdmin])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* POS Routes */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <PosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pos/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute requireAdmin>
            <AdminMenuPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/menu/new"
        element={
          <ProtectedRoute requireAdmin>
            <AdminMenuNewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/menu/edit/:id"
        element={
          <ProtectedRoute requireAdmin>
            <AdminMenuEditPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute requireAdmin>
            <AdminCategoriesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requireAdmin>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute requireAdmin>
            <AdminSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
