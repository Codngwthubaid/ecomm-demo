import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import connectDB from "@/lib/mongodb"
import Payment from "@/models/Payment"
import Order from "@/models/Order"
import { extractToken, verifyToken } from "@/lib/auth"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const token = extractToken(request.headers)

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { orderId, amount } = await request.json()

    if (!orderId || !amount) {
      return NextResponse.json({ error: "Order ID and amount are required" }, { status: 400 })
    }

    await connectDB()

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.user.toString() !== decoded.userId) {
      return NextResponse.json({ error: "Unauthorized access to order" }, { status: 403 })
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `order_${orderId}`,
    })

    // Save payment record
    await Payment.create({
      order: orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      currency: "INR",
      status: "created",
    })

    return NextResponse.json(
      {
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Create Razorpay order error:", error)
    return NextResponse.json({ error: "Failed to create payment order", details: error.message }, { status: 500 })
  }
}
