import { getFirestore } from "firebase-admin/firestore"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import type { ServiceAccount } from "firebase-admin"

import serviceAccount from "./serviceAccountKey.json" assert { type: "json" }

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  })
}

export const db = getFirestore()