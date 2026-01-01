import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { comparePassword, generateAccessToken, generateRefreshToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Please provide email and password" }, { status: 400 })
    }

    // Connect to database
    await connectDB()

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: accessToken,
      },
      { status: 200 },
    )

    // Set HTTP-only cookies
    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to login", details: error.message }, { status: 500 })
  }
}
