import { NextResponse } from "next/server"
import crypto from "crypto"
import connectDB from "@/lib/mongodb"
import Payment from "@/models/Payment"
import Order from "@/models/Order"
import { extractToken, verifyToken } from "@/lib/auth"

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

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json()

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 })
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

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")

    if (generatedSignature !== razorpaySignature) {
      // Update payment status to failed
      await Payment.findOneAndUpdate({ razorpayOrderId }, { status: "failed" })

      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    // Update payment record
    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: "captured",
      },
    )

    // Update order status
    order.paymentStatus = "completed"
    order.orderStatus = "processing"
    await order.save()

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        order,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Verify payment error:", error)
    return NextResponse.json({ error: "Failed to verify payment", details: error.message }, { status: 500 })
  }
}
