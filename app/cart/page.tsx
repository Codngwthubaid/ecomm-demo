"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

export default function CartPage() {
  const { cart, updateQuantity, removeItem, initialize } = useCart()

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: string, title: string) => {
    removeItem(productId)
    toast.success(`${title} removed from cart`)
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-12">
          <Card className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">Add some products to get started</p>
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <h1 className="mb-8 text-4xl font-bold">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.productId}>
                    <div className="flex gap-6">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                          <p className="mt-1 font-bold">${item.price}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleRemoveItem(item.productId, item.title)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      <div className="text-right font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <Separator className="mt-6" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20 p-6">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cart.totalItems} items)</span>
                  <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="mt-6 block">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/products" className="mt-4 block">
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
