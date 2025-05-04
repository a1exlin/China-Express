import { db } from "./firebase-admin"
import type * as FirebaseFirestore from "firebase-admin/firestore"

export const firestoreAdmin = {
  doc: (path: string, ...segments: string[]) => {
    const fullPath = [path, ...segments].join("/")
    return db.doc(fullPath)
  },

  collection: (path: string, ...segments: string[]) => {
    const fullPath = [path, ...segments].join("/")
    return db.collection(fullPath)
  },

  getDoc: async (docRef: FirebaseFirestore.DocumentReference) => docRef.get(),

  getDocs: async (query: FirebaseFirestore.Query) => query.get(),

  setDoc: async (docRef: FirebaseFirestore.DocumentReference, data: any) => docRef.set(data),

  updateDoc: async (docRef: FirebaseFirestore.DocumentReference, data: any) => docRef.update(data),

  deleteDoc: async (docRef: FirebaseFirestore.DocumentReference) => docRef.delete(),

  query: (
    collectionRef: FirebaseFirestore.CollectionReference,
    ...queryConstraints: any[]
  ) => queryConstraints.reduce((q, fn) => fn(q), collectionRef),

  where: (field: string, opStr: FirebaseFirestore.WhereFilterOp, value: any) =>
    (query: FirebaseFirestore.Query) => query.where(field, opStr, value),

  orderBy: (field: string, directionStr?: FirebaseFirestore.OrderByDirection) =>
    (query: FirebaseFirestore.Query) => query.orderBy(field, directionStr),

  limit: (limit: number) =>
    (query: FirebaseFirestore.Query) => query.limit(limit),
}
