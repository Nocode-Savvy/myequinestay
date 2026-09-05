"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-[#FAF7F2] text-center">
      <div className="size-16 rounded-full bg-amber-50 border border-amber-200 grid place-items-center mb-6 shadow-sm">
        <AlertTriangle className="size-8 text-amber-600" />
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl text-[#1F3A2B] font-semibold mb-3">
        Something went wrong
      </h1>

      <p className="text-sm sm:text-base text-[#6E7771] max-w-md mb-8">
        We encountered an unexpected issue while loading this page. You can reload to try again or return to the home page.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-[#1F3A2B] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#162a1f] transition-colors shadow-sm"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#E5E0D6] bg-white text-[#1B221E] px-6 py-2.5 text-sm font-medium hover:border-[#1F3A2B] transition-colors shadow-sm"
        >
          <Home className="size-4" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
