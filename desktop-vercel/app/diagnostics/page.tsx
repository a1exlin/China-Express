"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Database, RefreshCw } from "lucide-react"
import FirebaseConfigChecker from "@/components/firebase-config-checker"
import { initializeApp, getApp, getApps } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"

export default function DiagnosticsPage() {
  const router = useRouter()
  const [testResult, setTestResult] = useState<{
    status: "idle" | "loading" | "success" | "error"
    message: string
    details?: any
  }>({
    status: "idle",
    message: "Click 'Test Connection' to check your Firebase connection",
  })

  const testFirebaseConnection = async () => {
    setTestResult({
      status: "loading",
      message: "Testing connection to Firebase...",
    })

    try {
      // Get Firebase config from env vars
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      }

      // Check if any config values are missing
      const missingKeys = Object.entries(firebaseConfig)
        .filter(([_, value]) => !value)
        .map(([key]) => key)

      if (missingKeys.length > 0) {
        throw new Error(`Missing Firebase configuration: ${missingKeys.join(", ")}`)
      }

      // Initialize Firebase
      let app
      if (!getApps().length) {
        app = initializeApp(firebaseConfig)
      } else {
        app = getApp()
      }

      // Initialize Firestore
      const db = getFirestore(app)

      // Try to fetch from menuItems collection
      const menuItemsCollection = collection(db, "menuItems")
      const menuItemsSnapshot = await getDocs(menuItemsCollection)

      setTestResult({
        status: "success",
        message: `Successfully connected to Firebase and retrieved ${menuItemsSnapshot.docs.length} menu items`,
        details: {
          docsCount: menuItemsSnapshot.docs.length,
          firstDocId: menuItemsSnapshot.docs[0]?.id || "No documents found",
        },
      })
    } catch (error: any) {
      console.error("Firebase test connection error:", error)
      setTestResult({
        status: "error",
        message: `Failed to connect to Firebase: ${error.message}`,
        details: {
          errorCode: error.code,
          errorName: error.name,
          fullError: JSON.stringify(error, null, 2),
        },
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        <h1 className="text-2xl font-bold">Firebase Diagnostics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FirebaseConfigChecker />

        <Card>
          <CardHeader>
            <CardTitle>Firebase Connection Test</CardTitle>
            <CardDescription>Test the connection to your Firebase Firestore database</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`p-4 rounded-md mb-4 ${
                testResult.status === "idle"
                  ? "bg-gray-100"
                  : testResult.status === "loading"
                    ? "bg-blue-50 border border-blue-200"
                    : testResult.status === "success"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`${
                  testResult.status === "idle"
                    ? "text-gray-700"
                    : testResult.status === "loading"
                      ? "text-blue-700"
                      : testResult.status === "success"
                        ? "text-green-700"
                        : "text-red-700"
                }`}
              >
                {testResult.message}
              </p>

              {testResult.details && (
                <pre className="mt-2 p-2 bg-gray-800 text-gray-200 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(testResult.details, null, 2)}
                </pre>
              )}
            </div>

            <Button onClick={testFirebaseConnection} disabled={testResult.status === "loading"} className="w-full">
              {testResult.status === "loading" ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Testing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" /> Test Connection
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Guide</CardTitle>
            <CardDescription>Common issues and solutions for Firebase integration</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="config">
              <TabsList className="mb-4">
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="security">Security Rules</TabsTrigger>
                <TabsTrigger value="cors">CORS Issues</TabsTrigger>
                <TabsTrigger value="data">Data Structure</TabsTrigger>
              </TabsList>

              <TabsContent value="config">
                <h3 className="text-lg font-medium mb-2">Configuration Issues</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Missing environment variables:</strong> Ensure all Firebase config variables are set in your
                    .env.local file.
                  </li>
                  <li>
                    <strong>Incorrect project ID:</strong> Verify your Firebase project ID matches what's in the
                    Firebase console.
                  </li>
                  <li>
                    <strong>API key issues:</strong> Check that your API key is correct and has not been restricted.
                  </li>
                  <li>
                    <strong>Multiple initializations:</strong> Make sure Firebase is only initialized once in your
                    application.
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="security">
                <h3 className="text-lg font-medium mb-2">Security Rules Issues</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Restrictive rules:</strong> Your Firestore security rules might be blocking access. Check
                    your rules in the Firebase console.
                  </li>
                  <li>
                    <strong>Authentication required:</strong> If your rules require authentication, make sure you're
                    signed in before accessing data.
                  </li>
                  <li>
                    <strong>Example permissive rules for testing:</strong>
                    <pre className="mt-1 p-2 bg-gray-800 text-gray-200 rounded text-xs">
                      {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // WARNING: Only use for testing!
    }
  }
}`}
                    </pre>
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="cors">
                <h3 className="text-lg font-medium mb-2">CORS Issues</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Cross-Origin Resource Sharing:</strong> If you're seeing CORS errors, it might be due to
                    security restrictions.
                  </li>
                  <li>
                    <strong>Local development:</strong> When developing locally, make sure your Firebase project allows
                    requests from localhost.
                  </li>
                  <li>
                    <strong>Add your domain:</strong> In the Firebase console, go to Authentication → Settings →
                    Authorized domains and add your domain.
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="data">
                <h3 className="text-lg font-medium mb-2">Data Structure Issues</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Collection name:</strong> Make sure you're using the correct collection name ("menuItems").
                  </li>
                  <li>
                    <strong>Field names:</strong> Verify that your document fields match what your code expects
                    (case-sensitive).
                  </li>
                  <li>
                    <strong>Expected structure:</strong> Each document should have fields like: name, price, category,
                    etc.
                  </li>
                  <li>
                    <strong>Data types:</strong> Ensure fields have the correct data types (e.g., price should be a
                    number).
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
