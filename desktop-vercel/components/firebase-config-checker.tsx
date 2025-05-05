"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

export default function FirebaseConfigChecker() {
  const [configStatus, setConfigStatus] = useState<Record<string, { exists: boolean; value: string }>>({})
  const [showValues, setShowValues] = useState(false)

  useEffect(() => {
    const requiredKeys = [
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
    ]

    const status: Record<string, { exists: boolean; value: string }> = {}
    requiredKeys.forEach((key) => {
      const value = process.env[key] || ""
      status[key as string] = {
        exists: !!value,
        value: value ? (showValues ? value : value.substring(0, 3) + "..." + value.substring(value.length - 3)) : "",
      }
    })

    setConfigStatus(status)
  }, [showValues])

  const allConfigured = Object.values(configStatus).every((status) => status.exists)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase Configuration Status</CardTitle>
        <CardDescription>Check if all required Firebase environment variables are set</CardDescription>
      </CardHeader>
      <CardContent>
        {allConfigured ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">All Firebase configuration variables are set</AlertTitle>
            <AlertDescription className="text-green-700">
              Your Firebase configuration appears to be complete. If you're still experiencing issues, check that the
              values are correct.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Missing Firebase configuration</AlertTitle>
            <AlertDescription className="text-amber-700">
              Some required Firebase environment variables are missing. Please add them to your .env.local file.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4 space-y-2">
          {Object.entries(configStatus).map(([key, status]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center">
                {status.exists ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <span className="font-mono text-sm">{key}</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {status.exists ? status.value : "Not set"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={() => setShowValues(!showValues)}>
          {showValues ? "Hide Values" : "Show Values"}
        </Button>
      </CardFooter>
    </Card>
  )
}
