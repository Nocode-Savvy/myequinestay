"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowLeft, Search, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

export default function FAQPage() {
  const { t } = useLanguage();
  const faq = t.faq;

  const [search, setSearch] = useState("");
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (i: number) => {
    setOpenIndices((prev) =>
      prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]
    );
  };

  const categories: { id: "platform" | "accounts" | "verification"; label: string }[] = [
    { id: "platform", label: faq.categories.platform },
    { id: "accounts", label: faq.categories.accounts },
    { id: "verification", label: faq.categories.verification },
  ];

  const searchLower = search.toLowerCase();
  const filteredBySearch = search
    ? faq.items.filter(
        (f) =>
          f.question.toLowerCase().includes(searchLower) ||
          f.answer.toLowerCase().includes(searchLower)
      )
    : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B221E]">
      {/* Header section with gradient */}
      <section className="relative overflow-hidden border-b border-[#E5E0D6]/70">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E1B534]/30 via-[#FAF7F2] to-[#FAF7F2]" />
        <div className="relative mx-auto max-w-4xl px-4 pt-10 pb-8 sm:pt-14 sm:pb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#1F3A2B]/90 hover:text-[#1F3A2B] mb-6 transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {faq.backToHome}
          </Link>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#6E7771] mb-3">
            {faq.badge}
          </div>
          <h1 className="section-heading">{faq.title}</h1>
          <p className="mt-4 text-[#1B221E]/70 max-w-2xl">
            {faq.subtitle}
          </p>

          <div className="mt-8 relative max-w-xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6E7771]"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder={faq.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full bg-white border border-[#E5E0D6] pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3A2B]/40 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Accordion list */}
      <section className="mx-auto max-w-4xl px-4 pt-8 pb-12 sm:pt-10 sm:pb-16">
        {filteredBySearch !== null ? (
          <div className="space-y-3">
            {filteredBySearch.length === 0 ? (
              <p className="text-center text-sm text-[#6E7771] py-8">
                {faq.noResults}
              </p>
            ) : (
              filteredBySearch.map((item, idx) => {
                const isOpen = openIndices.includes(idx + 1000);
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-[#E5E0D6]/70 overflow-hidden transition-shadow hover:shadow-sm"
                  >
                    <button
                      onClick={() => toggleIndex(idx + 1000)}
                      className="w-full text-left px-5 sm:px-6 py-4 flex items-center gap-4 justify-between"
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium text-[#1B221E] pr-2">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`size-4 shrink-0 text-[#1F3A2B] transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-5 pt-1 text-[#1B221E]/75 leading-relaxed border-t border-[#E5E0D6]/60">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((cat) => {
              const items = faq.items.filter((f) => f.category === cat.id);
              const baseIdx = faq.items.indexOf(items[0]);
              return (
                <div key={cat.id}>
                  <div className="flex items-baseline gap-3 mb-5">
                    <div className="h-px flex-1 bg-[#E5E0D6]" />
                    <h2 className="font-serif text-2xl text-[#1F3A2B]">
                      {cat.label}
                    </h2>
                    <div className="h-px flex-1 bg-[#E5E0D6]" />
                  </div>

                  <div className="space-y-3">
                    {items.map((item, localIdx) => {
                      const globalIdx = baseIdx + localIdx;
                      const isOpen = openIndices.includes(globalIdx);
                      return (
                        <div
                          key={globalIdx}
                          className="rounded-2xl bg-white border border-[#E5E0D6]/70 overflow-hidden transition-shadow hover:shadow-sm"
                        >
                          <button
                            onClick={() => toggleIndex(globalIdx)}
                            className="w-full text-left px-5 sm:px-6 py-4 flex items-center gap-4 justify-between"
                            aria-expanded={isOpen}
                          >
                            <span className="font-medium text-[#1B221E] pr-2">
                              {item.question}
                            </span>
                            <ChevronDown
                              className={`size-4 shrink-0 text-[#1F3A2B] transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 sm:px-6 pb-5 pt-1 text-[#1B221E]/75 leading-relaxed border-t border-[#E5E0D6]/60">
                                  {item.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#E1B534] px-6 py-3 text-sm font-medium text-white shadow-sm hover:opacity-95 transition-opacity"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {faq.askAiBtn}
          </button>
          <p className="mt-3 text-xs text-[#6E7771]">
            {faq.stillQuestions}
          </p>
        </div>
      </section>
    </div>
  );
}
