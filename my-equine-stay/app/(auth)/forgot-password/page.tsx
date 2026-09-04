"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col justify-center py-20 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-4">
          <span className="font-serif font-bold text-2xl text-[var(--color-forest)]">
            My Equine <span className="text-[var(--color-gold)]">Stay</span>
          </span>
        </Link>
        <h1 className="font-serif font-bold text-2xl text-[var(--color-forest)]">
          Reset your password
        </h1>
        <p className="mt-1 text-xs text-[var(--color-muted)] max-w-xs mx-auto">
          Enter your registered email address and we will send you a secure link to reset your password.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4"
      >
        <div className="bg-white py-8 px-6 shadow-[var(--shadow-card)] rounded-3xl border border-[var(--color-sand-light)] sm:px-10 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--color-forest)]">Check your inbox</h3>
                <p className="mt-1.5 text-xs text-[var(--color-muted)] leading-relaxed">
                  We have sent a password reset link to <strong className="text-[var(--color-charcoal)]">{email}</strong>.
                  Please check your inbox (and spam folder) and click the link to proceed.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError("");
                  }}
                  className="text-xs text-[var(--color-gold)] hover:underline font-medium"
                >
                  Didn&apos;t get the link? Click here to try again
                </button>
              </div>

              <div className="pt-4 border-t border-[var(--color-sand-light)]">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-forest)] hover:text-[var(--color-gold)] transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-charcoal)] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-base pl-10 text-sm"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full mt-2"
                isLoading={loading}
              >
                Send reset link
                <ArrowRight size={16} />
              </Button>

              <div className="pt-4 border-t border-[var(--color-sand-light)] text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-forest)] transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-cream)]" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
