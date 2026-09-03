import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    "[Stripe] STRIPE_SECRET_KEY is not set. Payment features will be disabled. " +
      "Set this env var to enable Stripe in test or live mode."
  );
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-08-26.dahlia" as any,
      typescript: true,
    })
  : null;

/** True when Stripe is configured and ready */
export const isStripeEnabled = !!stripe;

export const PLANS = {
  standard: {
    name: "Standard",
    price: 59,
    priceId: process.env.STRIPE_PRICE_STANDARD ?? "",
  },
  premium: {
    name: "Premium",
    price: 89,
    priceId: process.env.STRIPE_PRICE_PREMIUM ?? "",
  },
} as const;
