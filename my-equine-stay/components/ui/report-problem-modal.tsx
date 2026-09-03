"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

export function ReportProblemModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setEmail("");
    setDescription("");
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E5E0D6]"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D6]/60">
            <h3 className="font-serif text-2xl text-[#1B221E]">
              Report a problem
            </h3>
            <button
              onClick={handleReset}
              className="p-1 rounded-full text-[#6E7771] hover:bg-[#FAF7F2] transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="size-12 rounded-full bg-[#1F3A2B]/10 text-[#1F3A2B] grid place-items-center mx-auto">
                <CheckCircle className="size-6" />
              </div>
              <h4 className="font-serif text-xl text-[#1B221E]">
                Thank you for your report
              </h4>
              <p className="text-xs text-[#6E7771] max-w-xs mx-auto">
                We have received your report and our support team is looking into
                it.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#E1B534] text-white text-xs font-medium"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <p className="text-xs text-[#6E7771] leading-relaxed">
                Tell us what happened. We&apos;ll include this page and your
                device info to help investigate.
              </p>

              <div>
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D6] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#1F3A2B] transition-colors"
                />
              </div>

              <div>
                <textarea
                  required
                  rows={4}
                  placeholder="What went wrong? What were you trying to do?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E0D6] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#1F3A2B] resize-y transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full py-3 rounded-full bg-[#E1B534] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? "Sending…" : "Send report"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
