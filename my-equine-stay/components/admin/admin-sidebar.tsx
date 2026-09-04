"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Flag,
  Sliders,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users & Roles", icon: Users },
  { href: "/admin/listings", label: "Listings Moderation", icon: Building2 },
  { href: "/admin/payments", label: "Payments & Stripe", icon: CreditCard },
  { href: "/admin/reports", label: "Reports Center", icon: Flag },
  { href: "/admin/settings", label: "Platform Settings", icon: Sliders },
];

interface SidebarContentProps {
  onClose?: () => void;
  isMobile?: boolean;
}

function SidebarContent({ onClose, isMobile = false }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      onClose?.();
      router.push("/");
      router.refresh();
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand header */}
        <div className="flex items-center justify-between gap-3 mb-8 pt-2 pb-5 border-b border-[#2D5440]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
              <Image
                src="/logo.png"
                alt={siteConfig.name}
                width={34}
                height={34}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-base block text-[#FAF7F2] tracking-wide">
                Admin Console
              </span>
              <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-[#E1B534]/20 border border-[#E1B534]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E1B534] animate-pulse" />
                <span className="text-[10px] text-[#E1B534] font-semibold tracking-wider uppercase">
                  Platform Admin
                </span>
              </div>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[#FAF7F2]/75 hover:text-[#FAF7F2] hover:bg-[#2D5440] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1B534]"
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5" aria-label="Admin Sections">
          {adminNav.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? "bg-[#2D5440] text-[#FAF7F2] font-semibold border-l-4 border-[#E1B534] shadow-xs"
                    : "text-[#FAF7F2]/75 hover:text-[#FAF7F2] hover:bg-[#2D5440]/50 font-medium"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-[#E1B534]" : "text-[#FAF7F2]/60"}
                />
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
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#FAF7F2]/70 hover:text-[#FAF7F2] hover:bg-[#2D5440]/40 transition-colors"
        >
          <span>View Public Site</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#E1B534]">
            Live
          </span>
        </Link>
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#FAF7F2]/80 hover:text-[#FAF7F2] hover:bg-[#2D5440]/40 transition-colors"
        >
          <ArrowLeft size={14} className="text-[#E1B534]" /> Exit to Dashboard
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-300 hover:text-white hover:bg-red-900/40 transition-colors text-left"
        >
          <LogOut size={14} className="text-red-400" /> Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Automatically reset drawer when pathname changes
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ── Mobile Sticky Header (below md) ── */}
      <header className="md:hidden sticky top-0 z-40 bg-[#1F3A2B] text-[#FAF7F2] border-b border-[#2D5440] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
            <Image
              src="/logo.png"
              alt={siteConfig.name}
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-serif font-bold text-sm block text-[#FAF7F2] tracking-wide leading-tight">
              Admin Console
            </span>
            <div className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-full bg-[#E1B534]/20 border border-[#E1B534]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E1B534] animate-pulse" />
              <span className="text-[9px] text-[#E1B534] font-semibold tracking-wider uppercase">
                Platform Admin
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-xl text-[#FAF7F2] hover:bg-[#2D5440] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1B534]"
          aria-label={isOpen ? "Close admin navigation" : "Open admin navigation"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ── Mobile Drawer Backdrop ── */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Slide-Out Drawer / Overlay ── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Admin Navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#1F3A2B] text-[#FAF7F2] flex flex-col justify-between p-5 shadow-2xl transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onClose={() => setIsOpen(false)} isMobile />
      </aside>

      {/* ── Desktop Fixed/Sticky Sidebar (md: and up) ── */}
      <aside className="hidden md:flex md:w-64 bg-[#1F3A2B] text-[#FAF7F2] flex-col justify-between p-5 md:min-h-screen md:sticky md:top-0 md:h-screen flex-shrink-0 border-r border-[#2D5440] shadow-md z-30 overflow-y-auto">
        <SidebarContent />
      </aside>
    </>
  );
}
