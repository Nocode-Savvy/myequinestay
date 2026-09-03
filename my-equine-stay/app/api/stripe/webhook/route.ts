import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET || !signature) {
    // If webhook secret isn't configured, acknowledge receipt to avoid retry loops
    return NextResponse.json({ received: true, note: "Webhook secret unconfigured" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const listingId = session.metadata?.listing_id;
    const plan = session.metadata?.plan || "standard";
    const isPremium = plan === "premium";

    if (listingId) {
      try {
        const supabase = await createAdminClient();
        // Activate listing, set plan & featured flag based on plan chosen
        await (supabase.from("listings") as any)
          .update({
            status: "active",
            plan: plan,
            is_featured: isPremium,
            subscription_expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
          })
          .eq("id", listingId);

        await (supabase.from("payments") as any).insert({
          owner_id: session.metadata?.owner_id,
          listing_id: listingId,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,
          amount: session.amount_total,
          plan: plan,
          status: "completed",
        });
      } catch (dbErr) {
        console.error("Failed to update database in webhook:", dbErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
