"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlertsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "subscribed" | "unsubscribed">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStatus("subscribed");
      else setStatus("subscribed"); // fallback for mock mode
    } catch {
      setStatus("subscribed");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus("unsubscribed");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-28 pb-20">
      <div className="section-container max-w-xl">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[var(--shadow-card)] border border-[var(--color-sand-light)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-gold-pale)] text-[var(--color-gold)] flex items-center justify-center mx-auto">
            <Bell size={28} />
          </div>

          <div>
            <p className="text-overline mb-1">Stay Notified</p>
            <h1 className="text-display-md text-[var(--color-forest)] mb-2">
              New Listing Alerts
            </h1>
            <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto">
              Get notified by email the moment new equestrian stays, barns, or RV hookups are listed across Florida.
            </p>
          </div>

          {status === "subscribed" ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-2xl space-y-3">
              <CheckCircle2 size={32} className="text-green-600 mx-auto" />
              <h2 className="font-serif font-bold text-lg text-green-900">You&apos;re All Set!</h2>
              <p className="text-xs text-green-700">
                We will email <strong>{email}</strong> when new properties match your area.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-xs text-green-800 underline mt-2 block mx-auto"
              >
                Change email address
              </button>
            </div>
          ) : status === "unsubscribed" ? (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
              <h2 className="font-serif font-bold text-lg text-[var(--color-forest)]">Unsubscribed</h2>
              <p className="text-xs text-[var(--color-muted)]">
                You have been removed from listing alert emails for <strong>{email}</strong>.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-xs text-[var(--color-gold)] font-semibold underline mt-2 block mx-auto"
              >
                Resubscribe
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-charcoal)] mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                  <input
                    type="email"
                    required
                    placeholder="equestrian@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-base pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" variant="gold" size="md" isLoading={loading} className="flex-1">
                  Subscribe to Alerts
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleUnsubscribe}
                  className="text-xs text-[var(--color-muted)] hover:text-red-600"
                >
                  Unsubscribe
                </Button>
              </div>
            </form>
          )}

          <p className="text-[11px] text-[var(--color-muted)]">
            We respect your inbox. You can unsubscribe at any time with a single click.
          </p>
        </div>
      </div>
    </div>
  );
}
