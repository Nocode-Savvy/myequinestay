import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | My Equine Stay",
  description: "Privacy Policy for My Equine Stay LLC — how we collect, use, and protect your information.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "Name, email address, phone number, location, profile information, listing information, messages, subscription details, payment information, and technical usage information.",
  },
  {
    title: "How We Use Your Information",
    list: [
      "Operate the platform.",
      "Allow users to connect.",
      "Manage accounts.",
      "Process subscription payments.",
      "Improve platform performance.",
      "Send important service-related communications.",
    ],
  },
  {
    title: "Platform Role",
    body: "My Equine Stay LLC acts solely as a connection platform. We do not participate in bookings, rentals, negotiations, or agreements between users.",
  },
  {
    title: "Payments",
    body: "Payments collected through the platform are subscription fees only. My Equine Stay LLC never processes payments between users.",
  },
  {
    title: "Cookies",
    body: "The platform uses cookies and similar technologies to improve functionality and user experience.",
  },
  {
    title: "Information Sharing",
    body: "We do not sell or rent personal information. Information may only be shared with service providers, when required by law, or to protect the platform and its users.",
  },
  {
    title: "Data Security",
    body: "Reasonable safeguards are used to protect user information. However, no online system can guarantee absolute security.",
  },
  {
    title: "Account Deletion",
    body: "Users may request deletion of their account, subject to legal record-retention requirements.",
  },
  {
    title: "Contact",
    body: "For privacy questions or account deletion requests, please use the Contact page or reach out to our support team.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-3xl shadow-[var(--shadow-card)] border border-[#E5E0D6] p-6 sm:p-10">
          {/* Header */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E1B534] mb-2">
            Privacy
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F3A2B] mb-2 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#6E7771] mb-8">
            My Equine Stay LLC · Last updated: 2026
          </p>

          {/* Sections */}
          <div className="space-y-6 text-sm text-[#1B221E] leading-relaxed">
            {SECTIONS.map((s, i) => (
              <section key={i}>
                <h2 className="font-semibold text-[#1F3A2B] mb-1">{s.title}</h2>
                {s.list ? (
                  <ul className="list-disc pl-5 space-y-1 text-[#1B221E]/80">
                    {s.list.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#1B221E]/80">{s.body}</p>
                )}
              </section>
            ))}
          </div>

          {/* Nav links */}
          <div className="mt-10 pt-6 border-t border-[#E5E0D6] flex flex-wrap justify-between gap-3 text-xs text-[#6E7771]">
            <Link href="/legal/terms" className="hover:text-[#1F3A2B] hover:underline transition-colors">
              ← Terms &amp; Conditions
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
