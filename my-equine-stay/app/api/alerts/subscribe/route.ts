import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { alertSubscriptionSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = alertSubscriptionSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const { email } = result.data;

    try {
      const supabase = await createAdminClient();
      await (supabase.from("alert_subscriptions") as any).upsert(
        { email, is_active: true },
        { onConflict: "email" }
      );
    } catch {
      // In standalone demo mode if supabase credentials aren't set yet
      console.log(`[Alert Subscription Mock] Subscribed email: ${email}`);
    }

    return NextResponse.json({ success: true, email });
  } catch {
    return NextResponse.json(
      { error: "Failed to process alert subscription" },
      { status: 500 }
    );
  }
}
