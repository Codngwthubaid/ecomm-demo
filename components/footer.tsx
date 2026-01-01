export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Headphones</h3>
            <p className="text-sm text-muted-foreground">Premium wireless audio for music enthusiasts.</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Headphones</li>
              <li>Earbuds</li>
              <li>Speakers</li>
              <li>Accessories</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Warranty</li>
              <li>Shipping</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Headphones. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
