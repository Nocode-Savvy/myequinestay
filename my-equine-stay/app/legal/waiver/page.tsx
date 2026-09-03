import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function WaiverPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-28 pb-20">
      <div className="section-container max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-[var(--shadow-card)] border border-[var(--color-sand-light)]">
        <p className="text-overline mb-2">Equine Risk Notice</p>
        <h1 className="text-display-lg text-[var(--color-forest)] mb-6">
          Equine Liability Waiver &amp; Florida Warning Notice
        </h1>
        <p className="text-xs text-[var(--color-muted)] mb-8">
          Florida Statutory Notice under Chapter 773 · <em>[Template Legal Framework]</em>
        </p>

        {/* Warning Callout */}
        <div className="p-6 bg-[var(--color-gold-pale)] border-2 border-[var(--color-gold)] rounded-2xl mb-8 flex gap-4">
          <ShieldAlert size={28} className="text-[var(--color-gold)] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[var(--color-charcoal)] space-y-2">
            <h2 className="font-bold text-sm text-[var(--color-forest)] uppercase tracking-wide">
              Mandatory Florida Statutory Warning (F.S. 773.04)
            </h2>
            <p className="font-semibold leading-relaxed">
              WARNING: Under Florida law, an equine activity sponsor or equine professional is not liable for an injury to, or the death of, a participant in equine activities resulting from the inherent risks of equine activities.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-[var(--color-charcoal)] leading-relaxed">
          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              1. Inherent Risks of Equine Activities
            </h2>
            <p>
              Engaging in equine activities (including stabling, turnout, riding, handling, trail riding, loading/unloading, and grooming) involves inherent risks, including but not limited to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
              <li>The propensity of equines to behave in ways that may result in injury, harm, or death to persons around them.</li>
              <li>The unpredictability of an equine&apos;s reaction to sounds, sudden movement, unfamiliar objects, persons, or other animals.</li>
              <li>Hazards such as surface and subsurface conditions (uneven footing, holes, slippery ground, weather hazards).</li>
              <li>Collisions with other equines or objects.</li>
              <li>The potential of a participant to act in a negligent manner that may contribute to injury.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-lg text-[var(--color-forest)] mb-2">
              2. Independent Host-Guest Agreements
            </h2>
            <p>
              {siteConfig.name} strongly advises all property owners and visiting equestrians to execute a written barn agreement, emergency veterinary authorization, and release of liability specific to the physical farm property before horse check-in.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-sand-light)] flex justify-between text-xs text-[var(--color-muted)]">
          <Link href="/legal/terms" className="hover:underline">← Terms of Service</Link>
          <Link href="/legal/privacy" className="hover:underline">Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
}
