"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [needsSetup, setNeedsSetup] = useState(false)
  const [checkingSetup, setCheckingSetup] = useState(true)
  const { user, loading: authLoading } = useAuth()

  // Check if we need to set up the first admin
  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await fetch("/api/auth/check-setup")
        const data = await res.json()
        setNeedsSetup(data.needsSetup)
      } catch (error) {
        console.error("Failed to check setup status:", error)
      } finally {
        setCheckingSetup(false)
      }
    }

    checkSetup()
  }, [])

  // Redirect to admin if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      console.log("User already logged in, redirecting to admin")
      window.location.href = "/admin"
    }
  }, [user, authLoading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Direct API call instead of using context
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Force a hard navigation to /admin
      window.location.href = "/admin"
    } catch (error) {
      setError(error.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking auth or setup status
  if (authLoading || checkingSetup) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          {needsSetup ? (
            <div className="text-center">
              <p className="mb-4">No admin account found. You need to create the first admin account.</p>
              <Button
                className="w-full bg-secondary hover:bg-secondary/90"
                onClick={() => (window.location.href = "/admin/setup")}
              >
                Create Admin Account
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/admin/forgot-password" className="text-xs text-secondary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 w-full">
            <Link href="/" className="text-secondary hover:underline">
              Return to Website
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
