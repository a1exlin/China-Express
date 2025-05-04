import { NextResponse } from "next/server"
import { firestoreAdmin } from "@/lib/firebase-utils" // ← if you're checking users via Firestore

export async function GET() {
  try {
    const userSnap = await firestoreAdmin.getDocs(firestoreAdmin.collection("users"))
    const needsSetup = userSnap.empty

    return NextResponse.json({ needsSetup })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
