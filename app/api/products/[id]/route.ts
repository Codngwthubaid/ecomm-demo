import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"

// GET single product by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await connectDB()

    const product = await Product.findById(id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Failed to get product", details: error.message }, { status: 500 })
  }
}
