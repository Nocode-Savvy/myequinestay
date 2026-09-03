import { NextResponse } from "next/server";
import { stripe, isStripeEnabled, PLANS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { plan, listingData } = await request.json();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const selectedPlan = plan === "premium" ? PLANS.premium : PLANS.standard;

    // If Stripe is configured with live/test secret key
    if (isStripeEnabled && stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `My Equine Stay — ${selectedPlan.name} Listing (3 Months)`,
                description: `3-month subscription listing for ${listingData?.title || "Property"}`,
              },
              unit_amount: selectedPlan.price * 100, // in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/listings/new`,
        metadata: {
          plan,
          listing_title: listingData?.title || "",
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // Fallback: If running without Stripe keys, simulate test session
    const mockSessionId = `test_sess_${Date.now()}`;
    return NextResponse.json({
      url: `${siteUrl}/payment/success?session_id=${mockSessionId}&test_mode=true`,
    });
  } catch (error: any) {
    console.error("[Stripe Checkout Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
