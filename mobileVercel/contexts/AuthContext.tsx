"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"
import { API_URL } from "../config"

type User = {
  id: string
  name: string
  email: string
  isAdmin?: boolean
  isFirstAdmin?: boolean
} | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<boolean>
  confirmResetPassword: (token: string, password: string) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on initial load
  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const userJson = await AsyncStorage.getItem("user")
        if (userJson) {
          setUser(JSON.parse(userJson))
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromStorage()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Save user to state and AsyncStorage
      setUser(data.user)
      await AsyncStorage.setItem("user", JSON.stringify(data.user))
      await AsyncStorage.setItem("token", data.token)

      Toast.show({
        type: "success",
        text1: "Login successful",
        text2: `Welcome back, ${data.user.name}!`,
      })

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: errorMessage,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      Toast.show({
        type: "success",
        text1: "Registration successful",
        text2: "Your account has been created.",
      })
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: errorMessage,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setLoading(true)

      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem("user")
      await AsyncStorage.removeItem("token")

      // Update state
      setUser(null)

      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Logout failed"
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Password reset request failed")
      }

      Toast.show({
        type: "success",
        text1: "Password reset email sent",
        text2: "If your email is registered, you will receive a password reset link.",
      })
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Password reset request failed"
      Toast.show({
        type: "error",
        text1: "Password reset request failed",
        text2: errorMessage,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const confirmResetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Password reset failed")
      }

      Toast.show({
        type: "success",
        text1: "Password reset successful",
        text2: "Your password has been updated. You can now log in with your new password.",
      })
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Password reset failed"
      Toast.show({
        type: "error",
        text1: "Password reset failed",
        text2: errorMessage,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("token")

      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Password change failed")
      }

      Toast.show({
        type: "success",
        text1: "Password changed successfully",
      })
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Password change failed"
      Toast.show({
        type: "error",
        text1: "Password change failed",
        text2: errorMessage,
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
