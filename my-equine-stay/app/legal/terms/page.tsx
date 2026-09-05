"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

export default function TermsPage() {
  const { t } = useLanguage();
  const terms = t.terms;

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-3xl shadow-[var(--shadow-card)] border border-[#E5E0D6] p-6 sm:p-10">
          {/* Header */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E1B534] mb-2">
            {terms.badge}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F3A2B] mb-2 leading-tight">
            {terms.title}
          </h1>
          <p className="text-xs text-[#6E7771] mb-8">
            {terms.lastUpdated}
          </p>

          {/* Sections */}
          <div className="space-y-5 text-sm text-[#1B221E] leading-relaxed">
            {terms.sections.map((s) => (
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
            <Link
              href="/legal/privacy"
              className="hover:text-[#1F3A2B] hover:underline transition-colors"
            >
              {terms.privacyLink}
            </Link>
            <Link
              href="/legal/waiver"
              className="hover:text-[#1F3A2B] hover:underline transition-colors"
            >
              {terms.waiverLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
