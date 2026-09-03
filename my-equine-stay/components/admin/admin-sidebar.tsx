"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Flag,
  Sliders,
  ArrowLeft,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users & Roles", icon: Users },
  { href: "/admin/listings", label: "Listings Moderation", icon: Building2 },
  { href: "/admin/payments", label: "Payments & Stripe", icon: CreditCard },
  { href: "/admin/reports", label: "Reports Center", icon: Flag },
  { href: "/admin/settings", label: "Platform Settings", icon: Sliders },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-[#1F3A2B] text-[#FAF7F2] flex flex-col justify-between p-5 md:min-h-screen flex-shrink-0 border-r border-[#2D5440] shadow-md">
      <div>
        {/* Brand header */}
        <div className="flex items-center gap-3 mb-8 pt-2 pb-5 border-b border-[#2D5440]">
          <div className="relative w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
            <Image
              src="/logo.png"
              alt={siteConfig.name}
              width={34}
              height={34}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-serif font-bold text-base block text-[#FAF7F2] tracking-wide">Admin Console</span>
            <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-[#E1B534]/20 border border-[#E1B534]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E1B534] animate-pulse" />
              <span className="text-[10px] text-[#E1B534] font-semibold tracking-wider uppercase">Platform Admin</span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? "bg-[#2D5440] text-[#FAF7F2] font-semibold border-l-4 border-[#E1B534] shadow-xs"
                    : "text-[#FAF7F2]/75 hover:text-[#FAF7F2] hover:bg-[#2D5440]/50 font-medium"
                }`}
              >
                <Icon size={16} className={isActive ? "text-[#E1B534]" : "text-[#FAF7F2]/60"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer navigation */}
      <div className="pt-6 border-t border-[#2D5440] mt-6 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#FAF7F2]/70 hover:text-[#FAF7F2] hover:bg-[#2D5440]/40 transition-colors"
        >
          <span>View Public Site</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#E1B534]">Live</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#FAF7F2]/80 hover:text-[#FAF7F2] hover:bg-[#2D5440]/40 transition-colors"
        >
          <ArrowLeft size={14} className="text-[#E1B534]" /> Exit to Dashboard
        </Link>
      </div>
    </aside>
  );
}
