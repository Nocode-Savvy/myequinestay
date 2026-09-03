"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 bg-[#E1B534] text-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 py-7 flex flex-col items-center text-center">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="My Equine Stay"
          width={54}
          height={54}
          className="object-contain mix-blend-multiply"
        />

        {/* Legal links */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <Link
            href="/legal/terms"
            className="underline underline-offset-4 hover:text-white transition-colors"
          >
            {t.footer.terms}
          </Link>
          <span className="text-[#FAF7F2]/60" aria-hidden="true">|</span>
          <Link
            href="/legal/privacy"
            className="underline underline-offset-4 hover:text-white transition-colors"
          >
            {t.footer.privacy}
          </Link>
          <span className="text-[#FAF7F2]/60" aria-hidden="true">|</span>
          <Link
            href="/legal/waiver"
            className="underline underline-offset-4 hover:text-white transition-colors"
          >
            {t.footer.waiver}
          </Link>
          <span className="text-[#FAF7F2]/60" aria-hidden="true">|</span>
          <Link
            href="/alerts"
            className="underline underline-offset-4 hover:text-white transition-colors"
          >
            {t.footer.manageAlerts}
          </Link>
        </div>

        {/* Copyright */}
        <p
          className="mt-3 max-w-2xl text-xs sm:text-sm text-[#FAF7F2]/90 px-4"
          suppressHydrationWarning
        >
          © {new Date().getFullYear()}. {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
