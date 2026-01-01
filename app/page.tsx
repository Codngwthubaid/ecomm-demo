import { HeroSection } from "@/components/sections/hero-section"
import { SponsorsSection } from "@/components/sections/sponsors-section"
import { SpecsSection } from "@/components/sections/specs-section"
import { CaseSection } from "@/components/sections/case-section"
import { DiscountSection } from "@/components/sections/discount-section"
import { ProductsSection } from "@/components/sections/products-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <SponsorsSection />
        <SpecsSection />
        <CaseSection />
        <DiscountSection />
        <ProductsSection />
      </main>
      <Footer />
    </div>
  )
}
