"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col justify-center py-20 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-6">
          <span className="font-serif font-bold text-2xl text-[var(--color-forest)]">
            My Equine <span className="text-[var(--color-gold)]">Stay</span>
          </span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="sm:mx-auto sm:w-full sm:max-w-md px-4"
      >
        <div className="bg-white py-10 px-6 shadow-[var(--shadow-card)] rounded-3xl border border-[var(--color-sand-light)] sm:px-10 text-center space-y-6">

          {/* Animated mail icon */}
          <motion.div
            className="mx-auto w-20 h-20 rounded-full bg-[var(--color-gold)]/10 border-2 border-[var(--color-gold)]/30 flex items-center justify-center"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-9 h-9 text-[var(--color-gold)]"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </motion.div>

          <div className="space-y-2">
            <h1 className="font-serif font-bold text-2xl text-[var(--color-forest)]">
              Check your inbox
            </h1>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              We&apos;ve sent a confirmation link to{" "}
              {email ? (
                <strong className="text-[var(--color-charcoal)]">{email}</strong>
              ) : (
                "your email address"
              )}
              .
            </p>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Click the link in that email to activate your account.
              If you don&apos;t see it within a few minutes, check your{" "}
              <strong>spam or junk folder</strong>.
            </p>
          </div>

          {/* Steps hint */}
          <div className="rounded-2xl border border-[var(--color-sand-light)] bg-[var(--color-cream)] p-4 text-left space-y-2">
            {[
              { step: "1", text: "Open the email from My Equine Stay" },
              { step: "2", text: "Click the \"Confirm your email\" button" },
              { step: "3", text: "You'll be signed in automatically" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3 text-xs text-[var(--color-charcoal)]">
                <span className="w-5 h-5 rounded-full bg-[var(--color-gold)] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {step}
                </span>
                {text}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Link
              href={`/signup${email ? `?resend=${encodeURIComponent(email)}` : ""}`}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-gold)] font-medium hover:underline"
            >
              <RefreshCw size={13} />
              Didn&apos;t receive it? Go back to resend
            </Link>
          </div>

          <div className="pt-2 border-t border-[var(--color-sand-light)]">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-forest)] transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-cream)]" />}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
