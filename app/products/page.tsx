"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { toast } from "sonner"
import { useCart } from "@/hooks/use-cart"
import type { IProduct } from "@/models/Product"

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        if (data.success) {
          setProducts(data.products)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: IProduct) => {
    addItem({
      productId: product._id.toString(),
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      color: product.color,
    })
    toast.success(`${product.title} added to cart!`)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <h1 className="mb-8 text-4xl font-bold">All Products</h1>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card key={product._id.toString()} className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="relative mb-4 h-64">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{product.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Color: {product.color}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button onClick={() => handleAddToCart(product)} className="w-full" disabled={product.stock === 0}>
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
