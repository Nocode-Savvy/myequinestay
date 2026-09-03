import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-28 pb-20">
      <div className="section-container max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-[var(--shadow-card)] border border-[var(--color-sand-light)]">
        <p className="text-overline mb-2">Legal Terms</p>
        <h1 className="text-display-lg text-[var(--color-forest)] mb-6">
          Terms of Service
        </h1>
        <p className="text-xs text-[var(--color-muted)] mb-8">
          Last updated: January 2026 · <em>[Placeholder legal document for platform master template]</em>
        </p>

        <div className="space-y-6 text-sm text-[var(--color-charcoal)] leading-relaxed">
          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              1. Platform Marketplace Role
            </h2>
            <p>
              {siteConfig.name} operates strictly as an advertising and listing discovery marketplace connecting independent equestrian property owners (&ldquo;Hosts&rdquo;) with traveling horse owners and guests (&ldquo;Guests&rdquo;). {siteConfig.name} is not a broker, real estate agent, insurer, or hospitality operator. All contractual relationships, rental agreements, boarding arrangements, and payments for physical stays are conducted directly between the Host and the Guest.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              2. Listing Subscription &amp; Fees
            </h2>
            <p>
              Hosts pay a fixed listing fee for a defined duration (Standard $59 or Premium $89 for a 3-month term). {siteConfig.name} does not charge any booking commission, service fees, or transaction percentage on the reservation revenue negotiated between Hosts and Guests. Listing fees are non-refundable once published, except as mandated by Florida consumer protection laws.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              3. Florida Equine Activity Liability Act Notice
            </h2>
            <p className="p-4 bg-[var(--color-gold-pale)] border-l-4 border-[var(--color-gold)] font-medium text-xs">
              <strong>WARNING:</strong> Under Florida law (Florida Statutes § 773.01–773.05), an equine activity sponsor or equine professional is not liable for an injury to, or the death of, a participant in equine activities resulting from the inherent risks of equine activities.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              4. Accuracy of Listings &amp; Biosecurity
            </h2>
            <p>
              Hosts are solely responsible for ensuring the accuracy of their stall dimensions, facility condition, pasture fencing, water availability, and property descriptions. Guests are responsible for verifying host biosecurity requirements (including negative Coggins certificates and veterinary health inspection certificates).
            </p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              5. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-sand-light)] flex justify-between text-xs text-[var(--color-muted)]">
          <Link href="/legal/privacy" className="hover:underline">Privacy Policy →</Link>
          <Link href="/legal/waiver" className="hover:underline">Liability Waiver Notice →</Link>
        </div>
      </div>
    </div>
  );
}
