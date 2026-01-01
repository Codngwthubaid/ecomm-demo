import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId
  razorpayOrderId: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  amount: number
  currency: string
  status: "created" | "authorized" | "captured" | "failed"
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema: Schema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed"],
      default: "created",
    },
  },
  {
    timestamps: true,
  },
)

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema)

export default Payment
