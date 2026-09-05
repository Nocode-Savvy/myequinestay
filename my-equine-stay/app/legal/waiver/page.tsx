"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export default function WaiverPage() {
  const { t } = useLanguage();
  const waiver = t.waiver;

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-3xl shadow-[var(--shadow-card)] border border-[#E5E0D6] p-6 sm:p-10">
          {/* Header */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E1B534] mb-2">
            {waiver.badge}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F3A2B] mb-2 leading-tight">
            {waiver.title}
          </h1>
          <p className="text-xs text-[#6E7771] mb-8">
            {waiver.lastUpdated}
          </p>

          {/* Florida Statutory Warning callout */}
          <div className="p-5 bg-[#FDF6E3] border-2 border-[#E1B534] rounded-2xl mb-8 flex gap-3">
            <ShieldAlert size={24} className="text-[#E1B534] shrink-0 mt-0.5" />
            <div className="text-xs text-[#1B221E] space-y-1">
              <p className="font-bold text-sm text-[#1F3A2B] uppercase tracking-wide">
                {waiver.warningTitle}
              </p>
              <p className="font-semibold leading-relaxed">
                {waiver.warningText}
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-5 text-sm text-[#1B221E] leading-relaxed">
            {waiver.sections.map((s) => (
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
              href="/legal/terms"
              className="hover:text-[#1F3A2B] hover:underline transition-colors"
            >
              {waiver.termsLink}
            </Link>
            <Link
              href="/legal/privacy"
              className="hover:text-[#1F3A2B] hover:underline transition-colors"
            >
              {waiver.privacyLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
