import { type Stripe, loadStripe } from "@stripe/stripe-js"

// Load the Stripe.js library
let stripePromise: Promise<Stripe | null> | null = null

// Add a type declaration for the window object to include ENV
declare global {
  interface Window {
    ENV?: {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
    }
  }
}

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    // Use window to access environment variables in client components
    const key =
      typeof window !== "undefined"
        ? window.ENV?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    stripePromise = loadStripe(key || "")
  }
  return stripePromise
}
