"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Failed to load user session:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromSession()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      setUser(data.user)
      toast.success("Login successful", {
        description: `Welcome back, ${data.user.name}!`,
      })
      return true
    } catch (error) {
      toast.error("Login failed", {
        description: error.message,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      toast.success("Registration successful", {
        description: "Your account has been created.",
      })
      return true
    } catch (error) {
      toast.error("Registration failed", {
        description: error.message,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Logout failed")
      }

      setUser(null)
      // Use window.location for a hard redirect
      window.location.href = "/admin/login"
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Logout failed", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Password reset request failed")
      }

      toast.success("Password reset email sent", {
        description: "If your email is registered, you will receive a password reset link.",
      })
      return true
    } catch (error) {
      toast.error("Password reset request failed", {
        description: error.message,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const confirmResetPassword = async (token, password) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Password reset failed")
      }

      toast.success("Password reset successful", {
        description: "Your password has been updated. You can now log in with your new password.",
      })
      router.push("/admin/login")
      return true
    } catch (error) {
      toast.error("Password reset failed", {
        description: error.message,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Password change failed")
      }

      toast.success("Password changed successfully")
      return true
    } catch (error) {
      toast.error("Password change failed", {
        description: error.message,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        resetPassword,
        confirmResetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
