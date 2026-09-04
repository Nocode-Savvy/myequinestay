"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  Circle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password validation rules
  const rules = useMemo(() => {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const isPasswordValid =
    rules.length && rules.upper && rules.lower && rules.number && rules.special;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        // 0. Check preview mode for testing/demonstration
        if (searchParams.get("preview") === "true") {
          setIsAuthenticated(true);
          setChecking(false);
          return;
        }

        // 1. Check if PKCE code is in the query params directly
        const code = searchParams.get("code");
        if (code) {
          const { error: codeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (!codeErr && mounted) {
            setIsAuthenticated(true);
            setChecking(false);
            return;
          }
        }

        // 2. Check if token_hash is in the query params
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type") as any;
        if (token_hash && type === "recovery") {
          const { error: otpErr } = await supabase.auth.verifyOtp({ token_hash, type: "recovery" });
          if (!otpErr && mounted) {
            setIsAuthenticated(true);
            setChecking(false);
            return;
          }
        }

        // 3. Check existing authenticated session (from /auth/callback)
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          setIsAuthenticated(true);
          setChecking(false);
          return;
        }

        // 4. Check for PASSWORD_RECOVERY event or token hash in URL
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            if (event === "PASSWORD_RECOVERY" || session?.user) {
              setIsAuthenticated(true);
              setChecking(false);
            }
          }
        );

        // Allow brief window for auth state listener to receive hash token
        setTimeout(() => {
          if (mounted) {
            setChecking(false);
          }
        }, 1200);

        return () => {
          authListener?.subscription?.unsubscribe();
        };
      } catch (err) {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, [searchParams, supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("Please ensure your password meets all security requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);

      // Automatically redirect to dashboard or login after 2.5s
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2500);
    } catch (err: any) {
      setError(err?.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-white py-10 px-8 rounded-3xl border border-[var(--color-sand-light)] shadow-[var(--shadow-card)] text-center max-w-sm w-full space-y-4">
          <RefreshCw className="animate-spin h-8 w-8 text-[var(--color-gold)] mx-auto" />
          <h2 className="font-serif text-lg font-semibold text-[var(--color-forest)]">
            Verifying recovery link…
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Connecting securely to your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col justify-center py-20 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-4">
          <span className="font-serif font-bold text-2xl text-[var(--color-forest)]">
            My Equine <span className="text-[var(--color-gold)]">Stay</span>
          </span>
        </Link>
        <h1 className="font-serif font-bold text-2xl text-[var(--color-forest)]">
          {success ? "Password Reset Complete" : "Set new password"}
        </h1>
        <p className="mt-1 text-xs text-[var(--color-muted)] max-w-xs mx-auto">
          {success
            ? "Your password has been securely updated."
            : "Choose a strong, unique password to secure your account."}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4"
      >
        <div className="bg-white py-8 px-6 shadow-[var(--shadow-card)] rounded-3xl border border-[var(--color-sand-light)] sm:px-10 space-y-6">
          {/* Success State */}
          {success ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--color-forest)]">
                  Success! Password Updated
                </h3>
                <p className="mt-1.5 text-xs text-[var(--color-muted)] leading-relaxed">
                  Your password has been changed. You will be automatically redirected to your dashboard in a moment.
                </p>
              </div>

              <div className="pt-3 space-y-2">
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="gold"
                  size="lg"
                  className="w-full"
                >
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Button>
                <Button
                  onClick={() => router.push("/login?reset=success")}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                >
                  Sign in again
                </Button>
              </div>
            </div>
          ) : !isAuthenticated ? (
            /* Expired / Invalid Session State */
            <div className="space-y-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertCircle size={26} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--color-forest)]">
                  Reset link expired or invalid
                </h3>
                <p className="mt-1.5 text-xs text-[var(--color-muted)] leading-relaxed">
                  For your security, password reset links expire shortly or can only be used once. Please request a fresh reset link.
                </p>
              </div>

              <div className="pt-3 space-y-3">
                <Link href="/forgot-password" className="block w-full">
                  <Button variant="gold" size="lg" className="w-full">
                    Request new reset link
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link
                  href="/login"
                  className="inline-block text-xs font-semibold text-[var(--color-forest)] hover:text-[var(--color-gold)] transition-colors"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            /* Form to Enter New Password */
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-charcoal)] mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-base pl-10 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-charcoal)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-charcoal)] mb-1.5">
                  Confirm new password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-base pl-10 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-charcoal)]"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPassword.length > 0 && (
                  <p className={`mt-1 text-[11px] font-medium ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                    {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Password Checklist */}
              <div className="py-2.5 px-3 bg-[#FAF7F2]/80 border border-[#E5E0D6] rounded-xl space-y-1.5 text-xs text-[var(--color-muted)]">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-forest)] mb-1">
                  <ShieldCheck size={13} />
                  <span>Password requirements:</span>
                </div>
                {[
                  { key: "length", label: "At least 8 characters" },
                  { key: "upper", label: "One uppercase letter (A-Z)" },
                  { key: "lower", label: "One lowercase letter (a-z)" },
                  { key: "number", label: "One number (0-9)" },
                  { key: "special", label: "One special character (!@#$...)" },
                ].map(({ key, label }) => {
                  const passed = rules[key as keyof typeof rules];
                  return (
                    <div key={key} className={`flex items-center gap-1.5 ${passed ? "text-green-700 font-medium" : ""}`}>
                      {passed ? (
                        <Check size={13} className="text-green-600 shrink-0" />
                      ) : (
                        <Circle size={10} className="text-gray-300 shrink-0" />
                      )}
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full mt-2"
                disabled={loading || !isPasswordValid || !passwordsMatch}
                isLoading={loading}
              >
                Update password
                <ArrowRight size={16} />
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-cream)]" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
