import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || ""

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local")
}

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    color: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)

const seedProducts = [
  {
    title: "Beats 3 - On Ear",
    description:
      "Enjoy award-winning Beats sound with wireless listening freedom and a sleek, streamlined design with comfortable padded earphones, delivering first-rate playback.",
    images: ["/beats-3-black-headphones.jpg"],
    price: 299,
    originalPrice: 399,
    stock: 50,
    category: "headphones",
    color: "Black",
    featured: true,
  },
  {
    title: "Beats Black Edition",
    description:
      "Premium wireless headphones with active noise cancellation and pure adaptive audio. Experience immersive sound quality with up to 40 hours of battery life.",
    images: ["/black-premium-headphones.jpg"],
    price: 249,
    originalPrice: 299,
    stock: 35,
    category: "headphones",
    color: "Black",
    featured: false,
  },
  {
    title: "Beats Red Black",
    description:
      "Bold design meets powerful sound. These headphones feature signature Beats bass and comfortable cushioned ear cups for all-day listening.",
    images: ["/red-black-headphones.jpg"],
    price: 249,
    originalPrice: 299,
    stock: 42,
    category: "headphones",
    color: "Red Black",
    featured: false,
  },
  {
    title: "Beats Night Black",
    description:
      "Sleek matte black finish with superior sound isolation. Perfect for professionals and music enthusiasts who demand the best audio quality.",
    images: ["/matte-black-headphones.jpg"],
    price: 249,
    originalPrice: 299,
    stock: 38,
    category: "headphones",
    color: "Night Black",
    featured: false,
  },
  {
    title: "Beats Blue Edition",
    description:
      "Stand out with vibrant blue headphones that deliver exceptional sound. Features fast charging and seamless Bluetooth connectivity.",
    images: ["/blue-wireless-headphones.jpg"],
    price: 249,
    originalPrice: 299,
    stock: 30,
    category: "headphones",
    color: "Blue",
    featured: false,
  },
  {
    title: "Beats Twilight Gray",
    description:
      "Sophisticated gray finish with premium materials. Enjoy crystal-clear audio and comfortable fit for extended listening sessions.",
    images: ["/gray-premium-headphones.jpg"],
    price: 249,
    originalPrice: 299,
    stock: 45,
    category: "headphones",
    color: "Twilight Gray",
    featured: false,
  },
]

async function seed() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB!")

    console.log("Clearing existing products...")
    await Product.deleteMany({})

    console.log("Seeding products...")
    const products = await Product.insertMany(seedProducts)
    console.log(`Successfully seeded ${products.length} products!`)

    console.log("\nSeeded Products:")
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - $${product.price}`)
    })

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seed()
