import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentIntentId = searchParams.get("payment_intent")

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert from cents to dollars
      id: paymentIntent.id,
      metadata: paymentIntent.metadata,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 })
  }
}
