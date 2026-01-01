import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { extractToken, verifyToken } from "@/lib/auth"

// GET user orders
export async function GET(request: Request) {
  try {
    const token = extractToken(request.headers)

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await connectDB()

    const orders = await Order.find({ user: decoded.userId }).sort({ createdAt: -1 }).populate("items.product")

    return NextResponse.json(
      {
        success: true,
        count: orders.length,
        orders,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Failed to get orders", details: error.message }, { status: 500 })
  }
}

// POST create order
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

    const { items, shippingAddress } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
    }

    await connectDB()

    // Validate products and calculate total
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.title}` }, { status: 400 })
      }

      totalAmount += product.price * item.quantity

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      })

      // Update product stock
      product.stock -= item.quantity
      await product.save()
    }

    // Create order
    const order = await Order.create({
      user: decoded.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: "pending",
      orderStatus: "processing",
    })

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order", details: error.message }, { status: 500 })
  }
}
