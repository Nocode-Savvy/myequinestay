/**
 * Email sending stub.
 *
 * TODO: Integrate Resend (https://resend.com) to enable actual email delivery.
 *
 * Setup steps:
 * 1. Sign up at resend.com
 * 2. Add and verify your domain (e.g. myequinestay.com)
 * 3. Set RESEND_API_KEY and EMAIL_FROM in .env.local
 * 4. Replace the stub below with:
 *    import { Resend } from 'resend';
 *    const resend = new Resend(process.env.RESEND_API_KEY);
 *    await resend.emails.send({ from, to, subject, html });
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Email STUB] To: ${to} | Subject: ${subject}`);
    console.log(`[Email STUB] Body preview: ${html.slice(0, 200)}...`);
    return { id: "stub-" + Date.now(), status: "stubbed" };
  }

  // TODO: Replace with Resend integration
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // return resend.emails.send({
  //   from: process.env.EMAIL_FROM ?? 'no-reply@myequinestay.com',
  //   to,
  //   subject,
  //   html,
  // });

  console.warn("[Email] Not configured. Set RESEND_API_KEY to enable sending.");
  return { id: null, status: "not_configured" };
}

/** Sends a new-listing alert to a subscriber */
export async function sendListingAlert(
  subscriberEmail: string,
  listing: { title: string; location: string; price_per_night: number; id: string }
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return sendEmail({
    to: subscriberEmail,
    subject: `New listing: ${listing.title} — My Equine Stay`,
    html: `
      <h2>A new equestrian stay just listed!</h2>
      <p><strong>${listing.title}</strong> in ${listing.location}</p>
      <p>From $${listing.price_per_night}/night</p>
      <a href="${siteUrl}/listings/${listing.id}">View listing →</a>
      <hr />
      <small>You're receiving this because you subscribed to new listing alerts on My Equine Stay.
      <a href="${siteUrl}/alerts/unsubscribe">Unsubscribe</a></small>
    `,
  });
}

/** Notifies an owner of a new inquiry */
export async function sendInquiryNotification(
  ownerEmail: string,
  inquiry: { guestName: string; listingTitle: string; message: string }
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return sendEmail({
    to: ownerEmail,
    subject: `New inquiry for "${inquiry.listingTitle}" — My Equine Stay`,
    html: `
      <h2>You have a new inquiry!</h2>
      <p><strong>${inquiry.guestName}</strong> sent a message about <em>${inquiry.listingTitle}</em>:</p>
      <blockquote>${inquiry.message}</blockquote>
      <a href="${siteUrl}/dashboard">View in your dashboard →</a>
    `,
  });
}
