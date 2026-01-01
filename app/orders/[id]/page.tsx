"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { CheckCircle, Loader2, Package } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import type { IOrder } from "@/models/Order"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user, isLoading: authLoading } = useAuth()
  const [order, setOrder] = useState<IOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = `/login?redirect=/orders/${resolvedParams.id}`
    }
  }, [user, authLoading, resolvedParams.id])

  useEffect(() => {
    if (user) {
      fetchOrder()
    }
  }, [user])

  const fetchOrder = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()

      if (data.success) {
        const foundOrder = data.orders.find((o: IOrder) => o._id.toString() === resolvedParams.id)
        if (foundOrder) {
          setOrder(foundOrder)
        } else {
          toast.error("Order not found")
        }
      } else {
        toast.error("Failed to load order")
      }
    } catch (error) {
      console.error("Error fetching order:", error)
      toast.error("Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || !order) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Order Details</h1>
          <Link href="/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {order.paymentStatus === "completed" && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="flex items-center gap-3 p-6">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Payment Successful!</h3>
                    <p className="text-sm text-green-700">Your order has been confirmed and is being processed.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 border-b pb-4 last:border-0">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
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
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-bold">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Shipping Address</h2>
                <div className="text-sm">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p className="mt-2 text-muted-foreground">
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="mt-2">
                    <span className="text-muted-foreground">Phone:</span> {order.shippingAddress.phone}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span> {order.shippingAddress.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm font-medium">{order._id.toString().slice(-12)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <Badge className="mt-1 capitalize">{order.paymentStatus}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Order Status</p>
                    <Badge className="mt-1 capitalize">{order.orderStatus}</Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="mt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/products" className="block">
                  <Button className="w-full">
                    <Package className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
