import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function DiscountSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 py-20 lg:py-32">
      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight lg:text-6xl">Immerse yourself in your music</h2>
            <p className="text-xl font-medium">Get it now, up to 50% off.</p>
            <Link href="/products">
              <Button size="lg" className="text-base font-semibold">
                Shop Now
              </Button>
            </Link>
          </div>

          <div className="relative flex justify-center">
            <div className="relative h-[400px] w-full max-w-md">
              <Image src="/red-black-headphones.jpg" alt="Discount Offer" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
