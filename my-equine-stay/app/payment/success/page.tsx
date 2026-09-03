"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Eye, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "test_session";
  const isTest = searchParams.get("test_mode") === "true";

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-[var(--shadow-card-hover)] border border-[var(--color-sand-light)] text-center space-y-6"
      >
        <div className="relative w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-inner">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 size={44} />
          </motion.div>
        </div>

        <div>
          <span className="text-overline text-[var(--color-gold)] mb-1 inline-block">
            Listing Active
          </span>
          <h1 className="text-display-sm text-[var(--color-forest)] mb-2">
            Payment Confirmed!
          </h1>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            Your listing is now live across Florida for the next 3 months. Guests can now find your property and send direct inquiries.
          </p>
        </div>

        {isTest && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
            🧪 <strong>Test Mode:</strong> Verified simulation completed.
          </div>
        )}

        <div className="bg-[var(--color-cream)] rounded-2xl p-4 text-xs text-[var(--color-charcoal)] text-left space-y-2 border border-[var(--color-sand)]">
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Confirmation ID</span>
            <span className="font-mono font-medium">{sessionId.slice(0, 16)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Subscription Term</span>
            <span className="font-medium text-[var(--color-forest)]">90 Days (Active)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Platform Fee Taken</span>
            <span className="font-semibold text-green-700">0% Commission</span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link href="/dashboard" className="block w-full">
            <Button variant="gold" size="lg" className="w-full">
              <LayoutDashboard size={16} /> Go to Owner Dashboard
            </Button>
          </Link>
          <Link href="/browse" className="block w-full">
            <Button variant="forest" size="md" className="w-full">
              <Eye size={16} /> View in Browse Stays
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-cream)]" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
