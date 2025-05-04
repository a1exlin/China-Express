import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BarChart4, Settings, ShoppingCart } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Restaurant POS System</h1>
        <p className="text-lg text-muted-foreground mt-2">Complete point of sale solution for your restaurant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">POS Terminal</h2>
              <p className="text-muted-foreground mb-4">Process orders quickly with an intuitive interface</p>
              <Link href="/pos" className="w-full">
                <Button className="w-full">
                  Open POS <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
              <p className="text-muted-foreground mb-4">Manage menu items, categories, and prices</p>
              <Link href="/admin" className="w-full">
                <Button className="w-full">
                  Admin Panel <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <BarChart4 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Sales Reports</h2>
              <p className="text-muted-foreground mb-4">View sales data and payment method breakdown</p>
              <Link href="/reports" className="w-full">
                <Button className="w-full">
                  View Reports <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
