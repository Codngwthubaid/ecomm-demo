import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"

// GET all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    await connectDB()

    const query: any = {}

    if (category) {
      query.category = category
    }

    if (featured === "true") {
      query.featured = true
    }

    const products = await Product.find(query).sort({ createdAt: -1 })

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Failed to get products", details: error.message }, { status: 500 })
  }
}

// POST create product (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    await connectDB()

    const product = await Product.create(body)

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Failed to create product", details: error.message }, { status: 500 })
  }
}
