import { Bluetooth, Battery, Zap, Mic } from "lucide-react"
import Image from "next/image"

export function SpecsSection() {
  const specs = [
    {
      icon: Bluetooth,
      title: "Connection",
      description: "Bluetooth v5.2",
    },
    {
      icon: Battery,
      title: "Battery",
      description: "Duration 40h",
    },
    {
      icon: Zap,
      title: "Load",
      description: "Fast charge 4.2-AAC",
    },
    {
      icon: Mic,
      title: "Microphone",
      description: "Supports Apple Siri and Google",
    },
  ]

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold lg:text-5xl">Specs</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {specs.map((spec) => (
                <div key={spec.title} className="space-y-2">
                  <spec.icon className="h-8 w-8" />
                  <h3 className="text-lg font-semibold">{spec.title}</h3>
                  <p className="text-sm text-muted-foreground">{spec.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative h-[400px] w-full max-w-md">
              <Image
                src="/beats-3-black-headphones.jpg"
                alt="Headphones Specifications"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
