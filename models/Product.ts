import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IProduct extends Document {
  title: string
  description: string
  images: string[]
  price: number
  originalPrice?: number
  stock: number
  category: string
  color: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a product title"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    images: {
      type: [String],
      required: [true, "Please provide at least one image"],
      validate: {
        validator: (v: string[]) => v && v.length > 0,
        message: "At least one image is required",
      },
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["headphones", "earbuds", "speakers", "accessories"],
      default: "headphones",
    },
    color: {
      type: String,
      required: [true, "Please provide a color"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)

export default Product
