import { Button } from "@/components/ui/button"
import Image from "next/image"

export function CaseSection() {
  return (
    <section className="bg-muted/30 py-20 lg:py-32">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative flex justify-center">
            <div className="relative h-[350px] w-full max-w-md">
              <Image src="/headphones-carrying-case.jpg" alt="Headphones Case" fill className="object-contain" />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold lg:text-5xl">Case</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              With a comfortable and adaptable case so that you can store it whenever you want, and keep your durability
              forever.
            </p>
            <Button variant="outline" size="lg">
              More info
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
