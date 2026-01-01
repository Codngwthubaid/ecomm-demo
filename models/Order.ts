import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  title: string
  price: number
  quantity: number
  image: string
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId
  items: IOrderItem[]
  totalAmount: number
  paymentStatus: "pending" | "completed" | "failed"
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  createdAt: Date
  updatedAt: Date
}

const OrderSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
)

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)

export default Order
