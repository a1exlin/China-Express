import Stripe from "stripe"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const body = await request.json()
    const { amount, metadata = {} } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Convert amount to cents/smallest currency unit
    const amountInCents = Math.round(amount * 100)

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: error.message || "Failed to create payment intent" }, { status: 500 })
  }
}
