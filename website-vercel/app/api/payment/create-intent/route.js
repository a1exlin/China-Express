import Stripe from "stripe"
import { NextResponse } from "next/server"

// Make sure to set NEXT_PUBLIC_SITE_URL in your environment variables
// This should be the full URL of your site, e.g. https://your-restaurant.vercel.app

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

export async function POST(request) {
  try {
    const { amount, metadata = {} } = await request.json()

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
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
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 })
  }
}
