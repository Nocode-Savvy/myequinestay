"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

export function AuthModal({ isOpen, onClose, redirectPath }: AuthModalProps) {
  if (!isOpen) return null;

  const signinHref = `/auth?mode=signin${
    redirectPath ? `&redirect=${encodeURIComponent(redirectPath)}` : ""
  }`;
  const signupHref = `/auth?mode=signup${
    redirectPath ? `&redirect=${encodeURIComponent(redirectPath)}` : ""
  }`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border border-[#E5E0D6]"
        >
          <h2 className="font-serif text-3xl text-[#1B221E] mb-3 leading-tight">
            Sign in to continue
          </h2>
          <p className="text-sm text-[#6E7771] leading-relaxed mb-6">
            Create a free account or sign in to save favorites, contact owners,
            subscribe to alerts, and list your property.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
            <Link
              href={signinHref}
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-full bg-[#E1B534] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
            <Link
              href={signupHref}
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-full border border-[#E5E0D6] bg-white text-[#1B221E] text-sm font-medium hover:border-[#1F3A2B] transition-colors"
            >
              Create Account
            </Link>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#6E7771] hover:text-[#1B221E] transition-colors"
          >
            Not now
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
