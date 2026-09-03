import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-28 pb-20">
      <div className="section-container max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-[var(--shadow-card)] border border-[var(--color-sand-light)]">
        <p className="text-overline mb-2">Privacy</p>
        <h1 className="text-display-lg text-[var(--color-forest)] mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-[var(--color-muted)] mb-8">
          Last updated: January 2026 · <em>[Placeholder legal document for platform master template]</em>
        </p>

        <div className="space-y-6 text-sm text-[var(--color-charcoal)] leading-relaxed">
          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us when creating an account, publishing a property listing, or submitting an inquiry message to an owner. This includes your name, email address, phone number, property details, and billing information (processed securely through Stripe).
            </p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              2. Privacy of Property Addresses
            </h2>
            <p>
              To protect the privacy and biosecurity of property owners and current guests, exact physical street addresses and entry gate codes are not published publicly on the browse map or search pages. Only approximate locations (city, zip code, distance to major equestrian venues) are displayed.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              3. Data Security &amp; No Selling of Personal Information
            </h2>
            <p>
              We never sell or rent your personal data or email addresses to third-party data brokers. Payment details are handled exclusively through Stripe and are never stored on our application servers.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              4. Contact Regarding Privacy
            </h2>
            <p>
              For questions regarding our privacy practices or to request deletion of your account data, contact us at <strong>{siteConfig.supportEmail}</strong>.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-sand-light)] flex justify-between text-xs text-[var(--color-muted)]">
          <Link href="/legal/terms" className="hover:underline">← Terms of Service</Link>
          <Link href="/legal/waiver" className="hover:underline">Liability Waiver →</Link>
        </div>
      </div>
    </div>
  );
}
