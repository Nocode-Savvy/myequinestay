import { NextResponse } from "next/server";
import { stripe, isStripeEnabled, PLANS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Route: POST /api/listings/[id]/change-plan
 *
 * Updates a listing's plan (standard <-> premium).
 * BILLING BEHAVIOR (Requirement #5):
 * - Proration is explicitly disabled (`proration_behavior: 'none'`).
 * - No immediate prorated refunds or partial charges are applied.
 * - The new rate applies without partial credits.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { newPlan } = body;

    if (!newPlan || (newPlan !== "standard" && newPlan !== "premium")) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'standard' or 'premium'." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    // Get current listing
    const { data: listing, error: listingErr } = (await (supabase
      .from("listings") as any)
      .select("*")
      .eq("id", id)
      .single()) as any;

    if (listingErr || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const isPremium = newPlan === "premium";
    const selectedPlanConfig = newPlan === "premium" ? PLANS.premium : PLANS.standard;

    // If Stripe is configured, update the Stripe subscription with proration_behavior: 'none'
    if (isStripeEnabled && stripe) {
      try {
        const { data: payments } = (await (supabase
          .from("payments") as any)
          .select("*")
          .eq("listing_id", id)) as any;

        if (payments && payments.length > 0) {
          for (const payment of payments) {
            if (payment.stripe_session_id) {
              const session = await stripe.checkout.sessions.retrieve(payment.stripe_session_id);
              if (session.subscription) {
                const subId =
                  typeof session.subscription === "string"
                    ? session.subscription
                    : session.subscription.id;

                const sub = await stripe.subscriptions.retrieve(subId);
                const currentItemId = sub.items.data[0]?.id;

                if (currentItemId && selectedPlanConfig.priceId) {
                  await stripe.subscriptions.update(subId, {
                    items: [
                      {
                        id: currentItemId,
                        price: selectedPlanConfig.priceId,
                      },
                    ],
                    // CRITICAL: Explicitly disable proration so no partial refund or charge is created
                    proration_behavior: "none",
                  });
                  console.log(
                    `[Stripe] Updated subscription ${subId} to plan ${newPlan} with proration_behavior: 'none'`
                  );
                }
              }
            }
          }
        }
      } catch (stripeErr: any) {
        console.warn("[Stripe] Failed to update remote subscription plan:", stripeErr?.message);
      }
    } else {
      console.warn(
        `[Stripe Dev] Stripe not configured; skipping remote subscription update for listing ${id}`
      );
    }

    // Update listing in Supabase
    await (supabase.from("listings") as any)
      .update({
        plan: newPlan,
        is_featured: isPremium,
      })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      message: `Plan changed to ${newPlan} with proration disabled.`,
      plan: newPlan,
      is_featured: isPremium,
    });
  } catch (error: any) {
    console.error("[Change Plan Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update plan" },
      { status: 500 }
    );
  }
}
