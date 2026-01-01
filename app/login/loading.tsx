import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    </div>
  )
}
