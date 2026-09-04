import { NextResponse } from "next/server";
import { stripe, isStripeEnabled } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return handleCancelSubscription(context);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return handleCancelSubscription(context);
}

async function handleCancelSubscription(context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!id || id.startsWith("draft")) {
      return NextResponse.json({ success: true, message: "Draft listing has no subscription" });
    }

    try {
      const supabase = await createAdminClient();

      // Retrieve any payment records tied to this listing
      const { data: payments } = (await (supabase
        .from("payments") as any)
        .select("*")
        .eq("listing_id", id)) as any;

      if (isStripeEnabled && stripe) {
        if (payments && payments.length > 0) {
          for (const payment of payments) {
            if (payment.stripe_session_id) {
              try {
                const session = await stripe.checkout.sessions.retrieve(payment.stripe_session_id);
                if (session.subscription) {
                  const subId =
                    typeof session.subscription === "string"
                      ? session.subscription
                      : session.subscription.id;
                  await stripe.subscriptions.cancel(subId);
                  console.log(`[Stripe] Successfully cancelled subscription ${subId} for listing ${id}`);
                }
              } catch (stripeErr: any) {
                console.warn(`[Stripe] Could not cancel subscription for payment ${payment.id}:`, stripeErr?.message);
              }
            }
          }
        }
      } else {
        console.warn(
          `[Stripe Dev] Stripe not enabled; skipped remote subscription cancellation for listing ${id}`
        );
      }

      // Mark the listing as expired or clear its active subscription in database
      await (supabase.from("listings") as any)
        .update({
          subscription_expires_at: null,
          status: "draft",
        })
        .eq("id", id);

    } catch (dbErr) {
      console.warn(`[Supabase/Stripe cancel error]`, dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Listing subscription cancelled successfully",
    });
  } catch (error: any) {
    console.error("[Cancel Subscription Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
