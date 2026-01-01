import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { extractToken, verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Extract token from headers or cookies
    const token = extractToken(request.headers)

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Connect to database
    await connectDB()

    // Find user
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to get user", details: error.message }, { status: 500 })
  }
}
