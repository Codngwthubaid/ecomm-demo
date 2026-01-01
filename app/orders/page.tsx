"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Package, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import type { IOrder } from "@/models/Order"

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/login?redirect=/orders"
    }
  }, [user, authLoading])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      } else {
        toast.error("Failed to load orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "processing":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500"
      case "shipped":
        return "bg-blue-500"
      case "processing":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-12">
          <h1 className="mb-8 text-4xl font-bold">My Orders</h1>
          <Card className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold">No orders yet</h2>
            <p className="text-muted-foreground">Start shopping to see your orders here</p>
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
        <h1 className="mb-8 text-4xl font-bold">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id.toString()}>
              <CardContent className="p-6">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm font-medium">{order._id.toString().slice(-12)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                    <Badge className={getOrderStatusColor(order.orderStatus)}>{order.orderStatus}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 border-t pt-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
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

                <div className="mt-4 border-t pt-4">
                  <h4 className="mb-2 font-semibold">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.fullName}
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    <br />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
