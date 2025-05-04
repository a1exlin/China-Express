"use client"
import { useRouter } from "next/navigation"
import { usePosContext } from "@/contexts/pos-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Banknote, BarChart4, ShoppingBag } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Reports() {
  const router = useRouter()
  const { orders } = usePosContext()

  // Calculate total sales
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0)

  // Calculate sales by payment method
  const cashSales = orders
    .filter((order) => order.paymentMethod === "cash")
    .reduce((sum, order) => sum + order.total, 0)

  const creditSales = orders
    .filter((order) => order.paymentMethod === "credit")
    .reduce((sum, order) => sum + order.total, 0)

  // Calculate average order value
  const averageOrderValue = totalSales / (orders.length || 1)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <h1 className="text-xl font-bold">Sales Reports</h1>
          <div className="w-[100px]"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto p-4 flex-1">
        {/* Sales Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <BarChart4 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <h3 className="text-2xl font-bold">${totalSales.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credit Card Sales</p>
                  <h3 className="text-2xl font-bold">${creditSales.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Banknote className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cash Sales</p>
                  <h3 className="text-2xl font-bold">${cashSales.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Order</p>
                  <h3 className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Method Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center">
              <div className="w-full flex">
                {/* Credit Card portion */}
                <div
                  className="bg-primary h-24 rounded-l-lg flex items-center justify-center text-primary-foreground font-bold"
                  style={{
                    width: `${(creditSales / (totalSales || 1)) * 100}%`,
                    minWidth: creditSales > 0 ? "100px" : "0",
                  }}
                >
                  <div className="text-center">
                    <CreditCard className="h-6 w-6 mx-auto mb-1" />
                    <p>${creditSales.toFixed(2)}</p>
                    <p className="text-xs">{((creditSales / (totalSales || 1)) * 100).toFixed(1)}%</p>
                  </div>
                </div>

                {/* Cash portion */}
                <div
                  className="bg-secondary h-24 rounded-r-lg flex items-center justify-center text-secondary-foreground font-bold"
                  style={{
                    width: `${(cashSales / (totalSales || 1)) * 100}%`,
                    minWidth: cashSales > 0 ? "100px" : "0",
                  }}
                >
                  <div className="text-center">
                    <Banknote className="h-6 w-6 mx-auto mb-1" />
                    <p>${cashSales.toFixed(2)}</p>
                    <p className="text-xs">{((cashSales / (totalSales || 1)) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{formatDate(order.timestamp)}</TableCell>
                    <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                    <TableCell>
                      {order.paymentMethod === "credit" ? (
                        <span className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" /> Credit
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Banknote className="h-4 w-4 mr-1" /> Cash
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
