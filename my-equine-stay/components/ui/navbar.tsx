"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Heart,
  LogIn,
  UserPlus,
  Globe,
  Check,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/context";
import { Language } from "@/lib/i18n/translations";
import { AuthModal } from "@/components/ui/auth-modal";
import type { Profile } from "@/types/database";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage, t } = useLanguage();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRedirect, setAuthModalRedirect] = useState("");

  const langRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
    };
    getProfile();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => getProfile());
    return () => subscription.unsubscribe();
  }, [supabase]);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setLangDropdownOpen(false);
  }, [pathname]);

  // Focus search input when expanded
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Click outside to close language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleProtectedClick = (
    e: React.MouseEvent,
    targetHref: string
  ) => {
    if (!profile) {
      e.preventDefault();
      setAuthModalRedirect(targetHref);
      setAuthModalOpen(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?location=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English (EN)", flag: "🇺🇸" },
    { code: "es", label: "Español (ES)", flag: "🇪🇸" },
    { code: "fr", label: "Français (FR)", flag: "🇫🇷" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#FAF7F2]/85 backdrop-blur-md border-b border-[#E5E0D6]/70">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="My Equine Stay"
              width={32}
              height={32}
              className="size-8 object-contain mix-blend-multiply dark:mix-blend-screen"
              priority
            />
            <span className="font-serif text-xl leading-none text-[#1B221E]">
              My Equine{" "}
              <span className="text-[#E1B534]">Stay</span>
            </span>
          </Link>

          {/* Desktop Search Trigger Icon */}
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            className={`hidden md:grid size-9 place-items-center rounded-full ring-1 transition-all ${
              searchOpen
                ? "bg-[#1F3A2B] text-white ring-[#1F3A2B]"
                : "ring-[#E5E0D6] text-[#1F3A2B] hover:ring-[#1F3A2B] hover:bg-white"
            }`}
            aria-label="Toggle search bar"
          >
            <Search className="size-4" aria-hidden="true" />
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/"
              className={`text-[#1B221E]/80 hover:text-[#1F3A2B] transition-colors ${
                isActive("/") ? "text-[#1F3A2B] font-medium" : ""
              }`}
            >
              {t.nav.home}
            </Link>

            <Link
              href="/search"
              className={`text-[#1B221E]/80 hover:text-[#1F3A2B] transition-colors ${
                isActive("/search") || isActive("/browse") ? "text-[#1F3A2B] font-medium" : ""
              }`}
            >
              {t.nav.browseStays}
            </Link>

            <Link
              href="/list-property"
              onClick={(e) => handleProtectedClick(e, "/list-property")}
              className={`text-[#1B221E]/80 hover:text-[#1F3A2B] transition-colors ${
                isActive("/list-property") ? "text-[#1F3A2B] font-medium" : ""
              }`}
            >
              {t.nav.listProperty}
            </Link>

            <Link
              href="/favorites"
              onClick={(e) => handleProtectedClick(e, "/favorites")}
              className={`text-[#1B221E]/80 hover:text-[#1F3A2B] transition-colors ${
                isActive("/favorites") ? "text-[#1F3A2B] font-medium" : ""
              }`}
            >
              {t.nav.favorites}
            </Link>

            <Link
              href="/faq"
              className={`text-[#1B221E]/80 hover:text-[#1F3A2B] transition-colors ${
                isActive("/faq") ? "text-[#1F3A2B] font-medium" : ""
              }`}
            >
              {t.nav.faq}
            </Link>

            <Link
              href="/contact"
              className={`text-[#1B221E]/80 hover:text-[#1F3A2B] transition-colors ${
                isActive("/contact") ? "text-[#1F3A2B] font-medium" : ""
              }`}
            >
              {t.nav.contact}
            </Link>

            {/* Auth / Account Buttons */}
            <div className="flex items-center gap-2">
              {profile ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1F3A2B] text-white px-4 py-1.5 text-xs font-medium tracking-wide hover:opacity-90 transition-opacity"
                >
                  <User className="size-3.5" />
                  {profile.full_name ? profile.full_name.split(" ")[0] : t.nav.myAccount}
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth?mode=signup"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#E1B534] text-white px-3.5 py-1.5 text-xs font-medium tracking-wide hover:opacity-90 transition-opacity"
                  >
                    <UserPlus className="size-3.5" aria-hidden="true" />
                    {t.nav.createAccount}
                  </Link>
                  <Link
                    href="/auth?mode=signin"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E1B534] bg-white text-[#E1B534] px-3.5 py-1.5 text-xs font-medium tracking-wide hover:bg-[#FAF7F2] transition-colors"
                  >
                    <LogIn className="size-3.5" aria-hidden="true" />
                    {t.nav.signIn}
                  </Link>
                </>
              )}
            </div>

            {/* Language Dropdown Selector */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E0D6] bg-white px-3 py-1.5 text-xs text-[#1B221E] hover:border-[#1F3A2B] transition-colors"
                aria-label="Change language"
              >
                <Globe className="size-3.5 text-[#1F3A2B]" aria-hidden="true" />
                <span className="font-semibold uppercase">{language}</span>
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#E5E0D6] py-1.5 z-50 overflow-hidden"
                  >
                    {languages.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setLanguage(item.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                          language === item.code
                            ? "font-semibold text-[#1F3A2B] bg-[#FAF7F2]/60"
                            : "text-[#1B221E]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{item.flag}</span>
                          <span>{item.label}</span>
                        </span>
                        {language === item.code && (
                          <Check className="size-3.5 text-[#1F3A2B]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Navigation Icons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="size-9 grid place-items-center rounded-full ring-1 ring-[#E5E0D6] text-[#1F3A2B]"
              aria-label="Search"
            >
              <Search className="size-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() =>
                setLanguage(
                  language === "en" ? "es" : language === "es" ? "fr" : "en"
                )
              }
              className="inline-flex items-center gap-1 rounded-full border border-[#E5E0D6] bg-white px-2.5 py-1 text-xs text-[#1B221E]"
              aria-label="Switch language"
            >
              <Globe className="size-3 text-[#1F3A2B]" />
              <span className="font-semibold uppercase">{language}</span>
            </button>

            <Link
              href="/favorites"
              onClick={(e) => handleProtectedClick(e, "/favorites")}
              className="size-9 grid place-items-center rounded-full ring-1 ring-[#E5E0D6] text-[#1F3A2B]"
            >
              <Heart className="size-4" aria-hidden="true" />
            </Link>

            <button
              type="button"
              className="size-9 grid place-items-center rounded-full ring-1 ring-[#E5E0D6] text-[#1B221E]"
              aria-label="Menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <X className="size-4" aria-hidden="true" />
              ) : (
                <Menu className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar Dropdown directly below navbar (Screenshot 5) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden bg-white/95 backdrop-blur-md border-t border-[#E5E0D6] px-4 py-3 shadow-md"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-3xl mx-auto relative flex items-center"
              >
                <Search className="absolute left-4 size-4 text-[#6E7771]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search any Florida city (e.g. Ocala, Marion, Reddick)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-2.5 rounded-full border border-[#E5E0D6] bg-[#FAF7F2] text-sm text-[#1B221E] outline-none focus:border-[#1F3A2B] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 rounded-full bg-[#E1B534] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="md:hidden fixed inset-x-0 top-16 z-30 bg-[#FAF7F2]/98 backdrop-blur-md border-b border-[#E5E0D6] shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-5 space-y-1">
              <Link
                href="/"
                className="block py-3 px-4 rounded-xl text-sm font-medium text-[#1B221E]/80 hover:bg-[#1F3A2B]/5"
              >
                {t.nav.home}
              </Link>
              <Link
                href="/search"
                className="block py-3 px-4 rounded-xl text-sm font-medium text-[#1B221E]/80 hover:bg-[#1F3A2B]/5"
              >
                {t.nav.browseStays}
              </Link>
              <Link
                href="/list-property"
                onClick={(e) => handleProtectedClick(e, "/list-property")}
                className="block py-3 px-4 rounded-xl text-sm font-medium text-[#1B221E]/80 hover:bg-[#1F3A2B]/5"
              >
                {t.nav.listProperty}
              </Link>
              <Link
                href="/favorites"
                onClick={(e) => handleProtectedClick(e, "/favorites")}
                className="block py-3 px-4 rounded-xl text-sm font-medium text-[#1B221E]/80 hover:bg-[#1F3A2B]/5"
              >
                {t.nav.favorites}
              </Link>
              <Link
                href="/faq"
                className="block py-3 px-4 rounded-xl text-sm font-medium text-[#1B221E]/80 hover:bg-[#1F3A2B]/5"
              >
                {t.nav.faq}
              </Link>
              <Link
                href="/contact"
                className="block py-3 px-4 rounded-xl text-sm font-medium text-[#1B221E]/80 hover:bg-[#1F3A2B]/5"
              >
                {t.nav.contact}
              </Link>

              <div className="pt-3 flex gap-2">
                {profile ? (
                  <Link
                    href="/dashboard"
                    className="flex-1 text-center py-3 rounded-full bg-[#1F3A2B] text-white text-sm font-medium"
                  >
                    {t.nav.myAccount}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth?mode=signup"
                      className="flex-1 text-center py-3 rounded-full bg-[#E1B534] text-white text-sm font-medium"
                    >
                      {t.nav.createAccount}
                    </Link>
                    <Link
                      href="/auth?mode=signin"
                      className="flex-1 text-center py-3 rounded-full border border-[#E1B534] text-[#E1B534] text-sm font-medium"
                    >
                      {t.nav.signIn}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign In To Continue Gatekeeper Modal (Screenshot 4) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        redirectPath={authModalRedirect}
      />
    </>
  );
}
