"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import { useCart } from "@/hooks/use-cart"
import type { IProduct } from "@/models/Product"

export function ProductsSection() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        if (data.success) {
          setProducts(data.products.slice(1, 6)) // Show 5 products
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

  if (loading) {
    return (
      <section className="py-20 lg:py-32">
        <div className="container">
          <h2 className="mb-12 text-center text-4xl font-bold lg:text-5xl">Choose Your Style</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <h2 className="mb-12 text-center text-4xl font-bold lg:text-5xl">Choose Your Style</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((product) => (
            <Card key={product._id.toString()} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="relative mb-4 h-48">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 font-semibold">{product.color}</h3>
                <p className="text-2xl font-bold">${product.price}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button onClick={() => handleAddToCart(product)} className="w-full" size="sm">
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
