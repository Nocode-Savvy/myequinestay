import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Liability Waiver | My Equine Stay",
  description: "Liability Waiver for My Equine Stay LLC — equine activity risks, platform role, and user responsibilities.",
};

const SECTIONS = [
  {
    num: "1",
    title: "Inherent Risks",
    body: "Equine activities involve inherent risks including unpredictable horse behavior, falls, kicks, bites, collisions, transportation hazards, and environmental conditions.",
  },
  {
    num: "2",
    title: "Florida Equine Activity Liability Act",
    body: "Under Florida Statutes §§773.01–773.06, equine activity sponsors are generally not liable for injuries resulting from the inherent risks of equine activities.",
    highlight: true,
  },
  {
    num: "3",
    title: "Platform Role",
    body: "My Equine Stay LLC operates solely as an online marketplace connecting independent users.",
  },
  {
    num: "4",
    title: "No Inspection or Certification",
    body: "My Equine Stay LLC does not inspect, certify, verify, or guarantee the condition, legality, safety, suitability, or quality of any property, accommodation, barn, pasture, RV site, horse facility, or service listed on the platform.",
  },
  {
    num: "5",
    title: "User Responsibility",
    body: "Users are solely responsible for evaluating safety, verifying qualifications, confirming insurance coverage, and determining whether a property, service, or provider meets their needs.",
  },
  {
    num: "6",
    title: "Assumption of Risk",
    body: "Users voluntarily assume all risks associated with equine activities, travel, rentals, accommodations, and interactions with other users.",
  },
  {
    num: "7",
    title: "No Emergency Responsibility",
    body: "My Equine Stay LLC is not responsible for providing emergency medical care, veterinary care, rescue services, transportation, or insurance.",
  },
  {
    num: "8",
    title: "Release of Liability",
    body: "Users release My Equine Stay LLC, its owners, members, managers, employees, contractors, affiliates, successors, and partners from any liability arising from use of the platform, including injury, death, property damage, animal injury, theft, financial loss, or disputes between users.",
  },
  {
    num: "9",
    title: "Acknowledgment",
    body: "By using the platform, users acknowledge that they understand the risks, voluntarily assume those risks, and agree to the terms of this Liability Waiver.",
    highlight: true,
  },
];

export default function WaiverPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-3xl shadow-[var(--shadow-card)] border border-[#E5E0D6] p-6 sm:p-10">
          {/* Header */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E1B534] mb-2">
            Equine Risk Notice
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F3A2B] mb-2 leading-tight">
            Liability Waiver
          </h1>
          <p className="text-xs text-[#6E7771] mb-8">
            My Equine Stay LLC · Last updated: 2026
          </p>

          {/* Florida Statutory Warning callout */}
          <div className="p-5 bg-[#FDF6E3] border-2 border-[#E1B534] rounded-2xl mb-8 flex gap-3">
            <ShieldAlert size={24} className="text-[#E1B534] shrink-0 mt-0.5" />
            <div className="text-xs text-[#1B221E] space-y-1">
              <p className="font-bold text-sm text-[#1F3A2B] uppercase tracking-wide">
                Mandatory Florida Statutory Warning (F.S. §773.04)
              </p>
              <p className="font-semibold leading-relaxed">
                WARNING: Under Florida law, an equine activity sponsor or equine
                professional is not liable for an injury to, or the death of, a
                participant in equine activities resulting from the inherent
                risks of equine activities.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-5 text-sm text-[#1B221E] leading-relaxed">
            {SECTIONS.map((s) => (
              <section key={s.num}>
                <h2 className="font-semibold text-[#1F3A2B] mb-1">
                  {s.num}. {s.title}
                </h2>
                <p
                  className={
                    s.highlight
                      ? "p-4 bg-[#FDF6E3] border-l-4 border-[#E1B534] rounded-r-xl text-xs"
                      : "text-[#1B221E]/80"
                  }
                >
                  {s.body}
                </p>
              </section>
            ))}
          </div>

          {/* Nav links */}
          <div className="mt-10 pt-6 border-t border-[#E5E0D6] flex flex-wrap justify-between gap-3 text-xs text-[#6E7771]">
            <Link href="/legal/terms" className="hover:text-[#1F3A2B] hover:underline transition-colors">
              ← Terms &amp; Conditions
            </Link>
            <Link href="/legal/privacy" className="hover:text-[#1F3A2B] hover:underline transition-colors">
              Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
