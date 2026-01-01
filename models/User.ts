import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
)

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
