"use client"

import { useState } from "react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface StripePaymentWrapperProps {
  clientSecret: string
  onPaymentSuccess: (paymentIntent: any) => void
  onPaymentError: (error: any) => void
  amount: number
}

interface StripePaymentFormProps {
  onPaymentSuccess: (paymentIntent: any) => void
  onPaymentError: (error: any) => void
  amount: number
}

// Wrapper component that provides Stripe Elements
export function StripePaymentWrapper({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  amount,
}: StripePaymentWrapperProps) {
  if (!clientSecret) return null

  return (
    <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <StripePaymentForm onPaymentSuccess={onPaymentSuccess} onPaymentError={onPaymentError} amount={amount} />
    </Elements>
  )
}

// The actual payment form with Stripe Elements - no longer using a form element
function StripePaymentForm({ onPaymentSuccess, onPaymentError, amount }: StripePaymentFormProps) {
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
      // First, submit the elements form - this is required before creating/confirming payment
      const { error: submitError } = await elements.submit()

      if (submitError) {
        setErrorMessage(submitError.message || "An error occurred with your payment form")
        onPaymentError(submitError)
        setIsLoading(false)
        return
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          // Include payment_intent and redirect_status in the return URL
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/checkout`,
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
