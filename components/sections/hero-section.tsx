import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 py-20 lg:py-32">
      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-block rounded-full bg-black/5 px-4 py-1.5 text-sm font-medium">On ear</div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight lg:text-7xl">Beats 3</h1>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold lg:text-3xl">Overview</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Enjoy award-winning Beats sound with wireless listening freedom and a sleek, streamlined design with
                comfortable padded earphones, delivering first-rate playback.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/products">
                <Button size="lg" className="text-base font-semibold">
                  Add to Bag
                </Button>
              </Link>
              <span className="text-3xl font-bold">$299</span>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative h-[400px] w-[400px] lg:h-[500px] lg:w-[500px]">
              <Image
                src="/beats-3-black-headphones.jpg"
                alt="Beats 3 Headphones"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
