"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";

function SignUpForm() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<UserRole>("guest");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength checks
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions to continue.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      });
      if (authError) {
        setError(authError.message);
        return;
      }
      if (data.user) {
        // Navigate to the email confirmation waiting page
        router.push(`/confirm-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col justify-center py-16 px-4">
      <div className="mx-auto w-full max-w-sm">
        {/* Page heading */}
        <div className="text-center mb-6">
          <h1 className="font-serif font-bold text-3xl text-[var(--color-forest)]">
            Create your account
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Save favorites, contact owners, and manage your listings.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="bg-white rounded-2xl border border-[var(--color-sand-light)] shadow-sm p-7 space-y-5"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role toggle â€” pill style matching reference */}
          <div className="flex rounded-full border border-[var(--color-sand)] overflow-hidden bg-[var(--color-cream)] p-0.5">
            <button
              type="button"
              onClick={() => setRole("guest")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                role === "guest"
                  ? "bg-[var(--color-forest)] text-white shadow-sm"
                  : "text-[var(--color-charcoal)] hover:bg-white/70"
              }`}
            >
              Guest
            </button>
            <button
              type="button"
              onClick={() => setRole("owner")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                role === "owner"
                  ? "bg-[var(--color-forest)] text-white shadow-sm"
                  : "text-[var(--color-charcoal)] hover:bg-white/70"
              }`}
            >
              Property owner
            </button>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full name */}
            <div>
              <input
                type="text"
                required
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[var(--color-sand)] rounded-lg bg-white text-[var(--color-charcoal)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[var(--color-sand)] rounded-lg bg-white text-[var(--color-charcoal)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 text-sm border border-[var(--color-sand)] rounded-lg bg-white text-[var(--color-charcoal)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-charcoal)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password checklist â€” circle style matching reference */}
              <div className="mt-3 space-y-1.5">
                {[
                  { key: "length", label: "At least 8 characters" },
                  { key: "upper", label: "One uppercase letter" },
                  { key: "lower", label: "One lowercase letter" },
                  { key: "number", label: "One number" },
                  { key: "special", label: "One special character (e.g. !@#$%)" },
                ].map(({ key, label }) => {
                  const passed = checks[key as keyof typeof checks];
                  return (
                    <div key={key} className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                      <span className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-colors ${
                        password.length > 0
                          ? passed ? "border-green-500 bg-green-500" : "border-gray-300"
                          : "border-gray-300"
                      }`} />
                      <span className={password.length > 0 && passed ? "text-green-700" : ""}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--color-charcoal)]">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[var(--color-sand)] text-[var(--color-gold)] focus:ring-[var(--color-gold)]/40"
              />
              <span>
                I agree to the{" "}
                <Link href="/legal/terms" className="underline hover:text-[var(--color-gold)]" target="_blank">Terms & Conditions</Link>
                ,{" "}
                <Link href="/legal/privacy" className="underline hover:text-[var(--color-gold)]" target="_blank">Privacy Policy</Link>
                {" "}and{" "}
                <Link href="/legal/waiver" className="underline hover:text-[var(--color-gold)]" target="_blank">
                  Liability Waiver
                </Link>
                .
              </span>
            </label>

            {/* Keep me signed in */}
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[var(--color-charcoal)]">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--color-sand)] text-[var(--color-gold)] focus:ring-[var(--color-gold)]/40"
              />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full py-3 rounded-full text-sm font-semibold transition-all bg-[var(--color-gold)] text-white hover:bg-[var(--color-gold-light)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating accountâ€¦" : "Create account"}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--color-muted)]">
            Have an account?{" "}
            <Link href="/login" className="underline text-[var(--color-charcoal)] hover:text-[var(--color-gold)]">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-cream)]" />}>
      <SignUpForm />
    </Suspense>
  );
}
