import type { CartItem } from "@/contexts/pos-context"

interface ReceiptProps {
  items: CartItem[]
  total: number
  paymentMethod: "cash" | "credit"
}

export function Receipt({ items, total, paymentMethod }: ReceiptProps) {
  const date = new Date()
  const formattedDate = date.toLocaleDateString()
  const formattedTime = date.toLocaleTimeString()

  return (
    <div className="font-mono text-sm print:text-xs">
      <div className="text-center mb-4">
        <h2 className="font-bold text-lg">RESTAURANT NAME</h2>
        <p>123 Main Street</p>
        <p>City, State 12345</p>
        <p>Tel: (123) 456-7890</p>
        <p className="mt-2">
          {formattedDate} {formattedTime}
        </p>
        <p className="border-t border-b my-2 py-1">ORDER RECEIPT</p>
      </div>

      <div className="mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left">Item</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="text-left">{item.name}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">${item.price.toFixed(2)}</td>
                <td className="text-right">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t pt-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>${(total * 0.0825).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-double mt-1 pt-1">
          <span>TOTAL:</span>
          <span>${(total + total * 0.0825).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t">
        <p className="font-bold">Payment Method: {paymentMethod === "credit" ? "Credit Card" : "Cash"}</p>
      </div>

      <div className="mt-4 text-center">
        <p>Thank you for your business!</p>
        <p>Please come again</p>
      </div>
    </div>
  )
}
