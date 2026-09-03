"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowLeft, Search, MessageCircle } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: "platform" | "accounts" | "verification";
}

const FAQS: FAQItem[] = [
  // Platform
  {
    category: "platform",
    question: "How does My Equine Stay work?",
    answer:
      "My Equine Stay is a connection platform. We allow users to find properties and connect directly with property owners. We do not handle bookings, payments, or agreements.",
  },
  {
    category: "platform",
    question: "Is booking done on My Equine Stay?",
    answer:
      "No. My Equine Stay does not process bookings or payments. All arrangements are made directly between users.",
  },
  {
    category: "platform",
    question: "How do I contact a property owner?",
    answer:
      "Create an account, browse listings, and click \"Contact Owner\" on any property to connect directly.",
  },

  // Accounts & Listings
  {
    category: "accounts",
    question: "Do I need an account?",
    answer:
      "Yes. You need an account to contact property owners or list a property.",
  },
  {
    category: "accounts",
    question: "How do I list my property?",
    answer:
      "Create an account, choose a listing plan, and publish your property. You will receive inquiries directly from users.",
  },
  {
    category: "accounts",
    question: "What does a subscription include?",
    answer:
      "Subscriptions include listing creation and management, visibility on the platform, and direct communication with users.",
  },
  {
    category: "accounts",
    question: "How does pricing work?",
    answer:
      "Property owners set their own pricing and terms. All pricing and agreements are negotiated directly between users.",
  },

  // Verification & Responsibility
  {
    category: "verification",
    question: "Are properties verified?",
    answer:
      "No. My Equine Stay does not verify listings. Users are responsible for verifying information and making their own decisions.",
  },
  {
    category: "verification",
    question: "Are we responsible for agreements?",
    answer:
      "No. My Equine Stay is not involved in any agreements, transactions, or disputes between users.",
  },
  {
    category: "verification",
    question: "Who handles property conditions?",
    answer:
      "Users are solely responsible for their actions, listings, agreements, and interactions with other users.",
  },
  {
    category: "verification",
    question: "Do you handle payments?",
    answer: "No. We do not process or hold any payments.",
  },
  {
    category: "verification",
    question: "What happens if there is a problem?",
    answer:
      "All issues must be resolved directly between users. My Equine Stay is not responsible.",
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (i: number) => {
    setOpenIndices((prev) =>
      prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]
    );
  };

  const categories: { id: FAQItem["category"]; label: string }[] = [
    { id: "platform", label: "About the platform" },
    { id: "accounts", label: "Accounts & listings" },
    { id: "verification", label: "Verification & responsibility" },
  ];

  const searchLower = search.toLowerCase();
  const filteredBySearch = search
    ? FAQS.filter(
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
            Back to home
          </Link>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#6E7771] mb-3">
            Help center
          </div>
          <h1 className="section-heading">Frequently asked questions</h1>
          <p className="mt-4 text-[#1B221E]/70 max-w-2xl">
            Everything you need to know about connecting with property owners on
            My Equine Stay.
          </p>

          <div className="mt-8 relative max-w-xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6E7771]"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search questions…"
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
                No questions match your search.
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
              const items = FAQS.filter((f) => f.category === cat.id);
              const baseIdx = FAQS.indexOf(items[0]);
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
            Ask AI
          </button>
          <p className="mt-3 text-xs text-[#6E7771]">
            Still have questions? Chat with our assistant.
          </p>
        </div>
      </section>
    </div>
  );
}
