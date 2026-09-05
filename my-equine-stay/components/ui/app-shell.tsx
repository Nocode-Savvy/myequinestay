"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { AskAiModal } from "@/components/ui/ask-ai-modal";
import { ReportProblemModal } from "@/components/ui/report-problem-modal";
import { LanguageProvider } from "@/lib/i18n/context";
import { MessageCircle, CircleAlert } from "lucide-react";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/confirm-email" ||
    pathname?.startsWith("/auth");

  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [isReportProblemOpen, setIsReportProblemOpen] = useState(false);

  // Dedicated full-screen layout for Admin Console
  if (isAdminRoute) {
    return (
      <LanguageProvider>
        <main className="flex-1 min-h-screen">{children}</main>
        <ScrollToTop className="bottom-6 right-6" />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <Navbar />
      <main className="flex-1 w-full max-w-full min-w-0">{children}</main>
      {!isAuthRoute && <Footer />}

      {/* Floating: Scroll To Top button */}
      <ScrollToTop className="bottom-20 right-5 sm:bottom-20 sm:right-6" />

      {/* Floating: Ask AI trigger button */}
      <button
        type="button"
        onClick={() => setIsAskAiOpen(true)}
        aria-label="Open assistant"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#1F3A2B] px-4 py-3 text-[#FAF7F2] shadow-lg ring-1 ring-[#1F3A2B]/20 hover:opacity-95 transition-opacity"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide hidden sm:inline">
          Ask AI
        </span>
      </button>

      {/* Floating: Report a problem trigger button */}
      <button
        type="button"
        onClick={() => setIsReportProblemOpen(true)}
        aria-label="Report a problem"
        className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-medium text-[#1B221E] shadow-lg ring-1 ring-[#E5E0D6] hover:bg-white transition-colors"
      >
        <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Report a problem</span>
      </button>

      {/* Interactive Modals */}
      <AskAiModal
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
      />
      <ReportProblemModal
        isOpen={isReportProblemOpen}
        onClose={() => setIsReportProblemOpen(false)}
      />
    </LanguageProvider>
  );
}
