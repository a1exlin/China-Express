"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

export default function SetupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [needsSetup, setNeedsSetup] = useState(true)
  const [checkingSetup, setCheckingSetup] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  // Check if setup is needed
  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await fetch("/api/auth/check-setup")
        const data = await res.json()

        // If setup is not needed, redirect to login
        if (!data.needsSetup) {
          router.push("/admin/login")
        }

        setNeedsSetup(data.needsSetup)
      } catch (error) {
        console.error("Failed to check setup status:", error)
      } finally {
        setCheckingSetup(false)
      }
    }

    checkSetup()
  }, [router])

  // Redirect to admin if already logged in
  useEffect(() => {
    if (user) {
      router.push("/admin")
    }
  }, [user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create admin account")
      }

      toast.success("Admin account created", {
        description: "You can now log in with your credentials.",
      })
      router.push("/admin/login")
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking setup status
  if (checkingSetup) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  // If setup is not needed, this will redirect to login
  if (!needsSetup) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-secondary" />
          <p className="mt-2">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Admin Account</CardTitle>
          <CardDescription>Set up the first administrator account for your restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Admin Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 w-full">
            This account will have full administrative privileges
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
