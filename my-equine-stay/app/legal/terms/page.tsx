import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | My Equine Stay",
  description: "Terms and Conditions for My Equine Stay LLC — the equestrian property connection platform.",
};

export default function TermsPage() {
  const sections = [
    {
      num: "1",
      title: "Platform Purpose",
      body: "My Equine Stay LLC operates solely as an online marketplace and connection platform. My Equine Stay LLC does not provide, supervise, manage, or control any services, rentals, accommodations, or equine activities offered by users. The platform only facilitates introductions between independent users.",
    },
    {
      num: "2",
      title: "Independent Users",
      body: "All users are independent individuals or businesses. Nothing contained on this platform creates an employer-employee relationship, agency relationship, partnership, joint venture, or franchise relationship between My Equine Stay LLC and any user.",
    },
    {
      num: "3",
      title: "Age Requirement",
      body: "Users must be at least 18 years old to create an account or use the platform.",
    },
    {
      num: "4",
      title: "No Screening or Verification",
      body: "My Equine Stay LLC does not verify user identity, qualifications, licensing, insurance, references, criminal background, experience, reliability, or safety.",
    },
    {
      num: "5",
      title: "User Responsibility",
      body: "Users are solely responsible for conducting their own due diligence before entering into any agreement or interaction with another user.",
    },
    {
      num: "6",
      title: "No Responsibility for Transactions",
      body: "My Equine Stay LLC is not a party to any agreement between users. All bookings, rentals, payments, and services occur directly between users.",
    },
    {
      num: "7",
      title: "No Guarantee",
      body: "My Equine Stay LLC does not guarantee the accuracy, completeness, legality, reliability, availability, pricing, photographs, descriptions, amenities, or quality of any listing, service, property, or user.",
    },
    {
      num: "8",
      title: "User-Generated Content",
      body: "Users are solely responsible for all information, photographs, descriptions, pricing, and other content they publish.",
    },
    {
      num: "9",
      title: "Assumption of Risk",
      body: "All interactions with other users occur entirely at the user's own risk.",
    },
    {
      num: "10",
      title: "Animal and Property Risks",
      body: "My Equine Stay LLC is not responsible for injuries, death, illness, theft, property damage, animal injury, escaped animals, or any incident involving horses, livestock, pets, accommodations, RV sites, barns, trailers, or other property.",
    },
    {
      num: "11",
      title: "Equine Activity Liability Notice",
      body: "Under Florida Statutes §§773.01–773.06, equine activity sponsors are generally not liable for injury or death resulting from the inherent risks of equine activities.",
      highlight: true,
    },
    {
      num: "12",
      title: "Release of Liability",
      body: "Users release My Equine Stay LLC, its owners, members, managers, employees, contractors, affiliates, successors, and partners from any claims arising out of the use of the platform.",
    },
    {
      num: "13",
      title: "Limitation of Liability",
      body: "My Equine Stay LLC shall not be liable for theft, fraud, scams, misrepresentation, property damage, personal injury, animal injury, financial loss, service failure, cancellations, disputes, or any indirect, incidental, special, punitive, or consequential damages.",
    },
    {
      num: "14",
      title: "Disputes Between Users",
      body: "Any dispute between users shall be resolved exclusively between those users. My Equine Stay LLC has no obligation to investigate or mediate disputes.",
    },
    {
      num: "15",
      title: "User Indemnification",
      body: "Users agree to defend, indemnify, and hold harmless My Equine Stay LLC from any claims arising from their use of the platform.",
    },
    {
      num: "16",
      title: "No Professional Advice",
      body: "Information available on the platform is provided for informational purposes only and does not constitute legal, veterinary, medical, financial, insurance, or professional advice.",
    },
    {
      num: "17",
      title: "User Conduct",
      body: "Users agree not to publish false or misleading listings; impersonate another person; violate any applicable law; upload unlawful or infringing content; or misuse the platform.",
    },
    {
      num: "18",
      title: "Account Suspension",
      body: "My Equine Stay LLC reserves the right to suspend or permanently remove any account or listing that violates these Terms, without prior notice.",
    },
    {
      num: "19",
      title: "Intellectual Property",
      body: "All trademarks, logos, branding, software, website design, and platform content are the exclusive property of My Equine Stay LLC unless otherwise indicated.",
    },
    {
      num: "20",
      title: "Arbitration Agreement",
      body: "Except where prohibited by law, disputes shall be resolved through binding arbitration.",
    },
    {
      num: "21",
      title: "Class Action Waiver",
      body: "Users agree that disputes shall be resolved individually and not as part of any class action.",
    },
    {
      num: "22",
      title: "Governing Law",
      body: "These Terms shall be governed by the laws of the State of Florida.",
    },
    {
      num: "23",
      title: "Changes to These Terms",
      body: "My Equine Stay LLC may modify these Terms at any time. Continued use of the platform constitutes acceptance of the updated Terms.",
    },
    {
      num: "24",
      title: "Acceptance",
      body: "By creating an account, posting listings, purchasing a subscription, or using the platform, users acknowledge that they have read, understood, and agree to these Terms.",
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-3xl shadow-[var(--shadow-card)] border border-[#E5E0D6] p-6 sm:p-10">
          {/* Header */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E1B534] mb-2">
            Legal Terms
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F3A2B] mb-2 leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-[#6E7771] mb-8">
            My Equine Stay LLC · Last updated: 2026
          </p>

          {/* Sections */}
          <div className="space-y-5 text-sm text-[#1B221E] leading-relaxed">
            {sections.map((s) => (
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
            <Link href="/legal/privacy" className="hover:text-[#1F3A2B] hover:underline transition-colors">
              Privacy Policy →
            </Link>
            <Link href="/legal/waiver" className="hover:text-[#1F3A2B] hover:underline transition-colors">
              Liability Waiver →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
