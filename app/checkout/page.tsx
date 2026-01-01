"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import Image from "next/image"

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clear } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to checkout")
      router.push(`/login?redirect=/checkout`)
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      form.setValue("fullName", user.name)
      form.setValue("email", user.email)
    }
  }, [user, form])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (cart.items.length === 0) {
    router.push("/cart")
    return null
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true)

    try {
      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: data,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Create Razorpay order
      const paymentResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.order._id,
          amount: cart.totalPrice,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || "Failed to create payment")
      }

      // Load Razorpay and process payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Headphones Store",
        description: "Order Payment",
        order_id: paymentData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok) {
              clear()
              toast.success("Payment successful!")
              router.push(`/orders/${orderData.order._id}`)
            } else {
              throw new Error(verifyData.error || "Payment verification failed")
            }
          } catch (error: any) {
            toast.error(error.message || "Payment verification failed")
          }
        },
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#000000",
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.on("payment.failed", (response: any) => {
        toast.error("Payment failed. Please try again.")
      })
      razorpay.open()
    } catch (error: any) {
      toast.error(error.message || "Checkout failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <h1 className="mb-8 text-4xl font-bold">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="mb-6 text-2xl font-bold">Shipping Information</h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isProcessing ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20 p-6">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

              <div className="mb-6 max-h-64 space-y-4 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <div className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Load Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  )
}
