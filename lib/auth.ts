import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { IUser } from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = "7d"
const REFRESH_TOKEN_EXPIRES_IN = "30d"

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local")
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate access token
export function generateAccessToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Generate refresh token
export function generateRefreshToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })
}

// Verify token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Extract token from request headers or cookies
export function extractToken(headers: Headers): string | null {
  // Check Authorization header
  const authHeader = headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  // Check cookie
  const cookieHeader = headers.get("cookie")
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim())
    const tokenCookie = cookies.find((c) => c.startsWith("token="))
    if (tokenCookie) {
      return tokenCookie.split("=")[1]
    }
  }

  return null
}
