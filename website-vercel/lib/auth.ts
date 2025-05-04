import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "./firebase-admin"
import type { AuthenticatedUser } from "./models"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

// Only use safe fields in the JWT payload
export type TokenPayload = {
  _id: string
  email: string
  role: string
  name: string
}

export async function createToken(user: TokenPayload): Promise<string> {
  const token = sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  )

  return token
}

export async function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getAuthUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    const decoded = await verifyToken(token)
    if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
      return null
    }

    const userId = decoded.userId as string
    if (!userId) {
      return null
    }

    const doc = await db.collection("users").doc(userId).get()

    if (!doc.exists) {
      return null
    }

    const userData = doc.data()
    if (!userData) {
      return null
    }

    // Return only the necessary user data without sensitive information
    return {
      _id: doc.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    }
  } catch (error) {
    console.error("Error in getAuthUser:", error)
    return null
  }
}

export async function requireAuth(req: NextRequest): Promise<AuthenticatedUser | NextResponse> {
  const user = await getAuthUser(req)

  if (!user) {
    return NextResponse.redirect(new URL("/portal/login", req.url))
  }

  return user
}
