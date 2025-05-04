"use client"

import { useState } from "react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Wrapper component that provides Stripe Elements
export function StripePaymentWrapper({ clientSecret, onPaymentSuccess, onPaymentError, amount }) {
  if (!clientSecret) return null

  return (
    <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <StripePaymentForm onPaymentSuccess={onPaymentSuccess} onPaymentError={onPaymentError} amount={amount} />
    </Elements>
  )
}

// The actual payment form with Stripe Elements - no longer using a form element
function StripePaymentForm({ onPaymentSuccess, onPaymentError, amount }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: 'http://localhost:3000/checkout',
        },
      })

      if (error) {
        setErrorMessage(error.message || "An error occurred with your payment")
        onPaymentError(error)
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent)
      }
    } catch (err) {
      console.error("Payment error:", err)
      setErrorMessage("An unexpected error occurred")
      onPaymentError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PaymentElement />

      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}

      <Button
        onClick={handlePayment}
        className="w-full bg-secondary hover:bg-secondary/90"
        disabled={!stripe || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${(amount).toFixed(2)}`
        )}
      </Button>
    </div>
  )
}
