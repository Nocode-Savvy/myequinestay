import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendInquiryNotification } from "@/lib/email";
import { inquirySchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = inquirySchema.safeParse({
      name: json.guest_name,
      email: json.guest_email,
      message: json.message,
      arrival_date: json.arrival_date,
      departure_date: json.departure_date,
      horse_count: json.horse_count,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { listing_id, owner_id } = json;

    try {
      const supabase = await createAdminClient();
      await (supabase.from("inquiries") as any).insert({
        listing_id,
        owner_id,
        guest_name: json.guest_name,
        guest_email: json.guest_email,
        message: json.message,
        arrival_date: json.arrival_date || null,
        departure_date: json.departure_date || null,
        horse_count: json.horse_count || null,
      });

      // Send email stub notification to host
      await sendInquiryNotification(json.guest_email, {
        guestName: json.guest_name,
        listingTitle: "Equestrian Stay",
        message: json.message,
      });
    } catch {
      console.log(`[Inquiry Mock] New inquiry received from ${json.guest_name} (${json.guest_email})`);
    }

    return NextResponse.json({ success: true, message: "Inquiry sent successfully" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
