"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  Bell,
  Heart,
  ExternalLink,
  Stethoscope,
  ShoppingBag,
  PawPrint,
  CalendarDays,
  MapPin,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "@/components/ui/auth-modal";
import { useLanguage } from "@/lib/i18n/context";
import { SAMPLE_LISTINGS } from "@/lib/data/sample-listings";

/* ============================================================
   Animation helpers
   ============================================================ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Property type data
   ============================================================ */
const PROPERTY_TYPES = [
  { value: "", label: "All types" },
  { value: "farm", label: "Equestrian Farm" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "bedroom", label: "Private Bedroom" },
  { value: "rv", label: "RV" },
  { value: "rv_hookup", label: "RV Hookup" },
  { value: "rv_plus_hookup", label: "RV + Hookup" },
  { value: "pasture", label: "Pasture Rental" },
  { value: "barn", label: "Barn / Stalls" },
  { value: "other", label: "Other" },
];

/* ============================================================
   Listing card (portrait — matches live site exactly)
   ============================================================ */
interface ListingCardData {
  id: string;
  title: string;
  category: string;
  neighborhood: string;
  stalls: number;
  bedrooms?: number;
  pricePerNight: number;
  pricePerWeek: number;
  milesToWec?: number;
  images: string[];
  isFeatured?: boolean;
}

function ListingCard({
  listing,
  index,
  onToggleFavorite,
  isFavorited,
}: {
  listing: ListingCardData;
  index: number;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  isFavorited?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const price =
    listing.pricePerNight > 0
      ? { amount: listing.pricePerNight, period: "night" }
      : { amount: listing.pricePerWeek, period: "week" };

  const categoryLabel: Record<string, string> = {
    farm: "Equestrian Farm",
    house: "House",
    apartment: "Apartment",
    bedroom: "Private Bedroom",
    rv: "RV",
    rv_hookup: "RV Hookup",
    rv_plus_hookup: "RV + Hookup",
    pasture: "Pasture Rental",
    barn: "Barn / Stalls",
    other: "Other",
    equestrian_farm: "Equestrian Farm",
  };

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      custom={index * 0.08}
      className="shrink-0 w-56 sm:w-64"
    >
      <Link
        href={`/property/${listing.id}`}
        className="group block"
      >
        {/* Portrait image */}
        <div className="relative mb-4 overflow-hidden rounded-xl aspect-[4/5] bg-[#E5E0D6]/30">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="288px"
            />
          ) : (
            <div className="w-full h-full bg-[#E5E0D6]/40" />
          )}

          {/* Featured badge or distance pill */}
          {listing.isFeatured ? (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[#E1B534] text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
              <Star className="size-2.5 fill-white" />
              Featured
            </span>
          ) : listing.milesToWec != null ? (
            <span className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider text-[#1F3A2B] uppercase ring-1 ring-black/5">
              {listing.milesToWec} mi to WEC
            </span>
          ) : null}

          {/* Favorite button */}
          <button
            className="absolute top-3 right-3 size-9 grid place-items-center rounded-full bg-[#FAF7F2]/90 backdrop-blur ring-1 ring-black/5 hover:scale-105 transition-transform"
            aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.(listing.id, e);
            }}
          >
            <Heart
              className={`size-4 transition-colors ${
                isFavorited ? "fill-red-500 text-red-500" : "text-[#1F3A2B]"
              }`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Card body */}
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-[#E1B534] mb-1">
              {categoryLabel[listing.category] ?? listing.category}
            </p>
            <h3 className="font-medium text-[#1B221E] truncate">
              {listing.title}
            </h3>
            <p className="text-sm text-[#6E7771] mt-0.5">
              {listing.neighborhood}
              {listing.stalls > 0 ? ` · ${listing.stalls} stalls` : ""}
              {listing.bedrooms ? ` · ${listing.bedrooms} bd` : ""}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-serif text-lg text-[#1F3A2B] leading-none">
              ${price.amount}
            </p>
            <p className="text-[10px] uppercase text-[#6E7771] tracking-widest mt-1">
              {price.period}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ============================================================
   Sample / static listings (fallback when Supabase unavailable)
   ============================================================ */
const STATIC_LISTINGS: ListingCardData[] = [
  {
    id: "golden-oak-manor",
    title: "Golden Oak Manor",
    category: "other",
    neighborhood: "NW Ocala",
    stalls: 6,
    bedrooms: 4,
    pricePerNight: 485,
    pricePerWeek: 0,
    milesToWec: 1.2,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    ],
  },
  {
    id: "bridle-loft",
    title: "The Bridle Loft",
    category: "apartment",
    neighborhood: "Golden Ocala",
    stalls: 2,
    bedrooms: 1,
    pricePerNight: 225,
    pricePerWeek: 0,
    milesToWec: 1.8,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    ],
  },
  {
    id: "magnolia-cottage",
    title: "Magnolia Cottage",
    category: "house",
    neighborhood: "Shady",
    stalls: 3,
    bedrooms: 2,
    pricePerNight: 175,
    pricePerWeek: 0,
    milesToWec: 4.6,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
  },
  {
    id: "liveoak-rv",
    title: "Live Oak RV Pad",
    category: "rv_plus_hookup",
    neighborhood: "NW Marion",
    stalls: 4,
    pricePerNight: 75,
    pricePerWeek: 0,
    milesToWec: 3.4,
    images: [
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80",
    ],
  },
];

/* ============================================================
   Ecosystem services
   ============================================================ */
const SERVICES = [
  {
    id: "pro",
    name: "My Equine Pro",
    tagline: "Your horse deserves the best care.",
    href: "https://myequinepro.com",
    icon: Stethoscope,
    active: true,
  },
  {
    id: "adopt",
    name: "My Equine Adopt",
    tagline: "Rescue and adoption, coming soon.",
    href: null,
    icon: Heart,
    active: false,
  },
  {
    id: "tack",
    name: "My Equine Tack",
    tagline: "Curated tack and gear marketplace.",
    href: null,
    icon: ShoppingBag,
    active: false,
  },
  {
    id: "sit",
    name: "My Equine Sit",
    tagline: "Trusted horse sitters and farm sitters.",
    href: null,
    icon: PawPrint,
    active: false,
  },
  {
    id: "planner",
    name: "My Equine Show Planner",
    tagline: "Plan and manage your show season.",
    href: null,
    icon: CalendarDays,
    active: false,
  },
];

/* ============================================================
   Hero Section
   ============================================================ */
function HeroSection({ onRequireAuth }: { onRequireAuth: (path: string) => void }) {
  const { t } = useLanguage();
  const [location, setLocation] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("2");
  const [horses, setHorses] = useState("2");
  const [bedrooms, setBedrooms] = useState("0");
  const [bathrooms, setBathrooms] = useState("0");
  const [propertyType, setPropertyType] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const supabase = createClient();

  const handleListPropertyClick = async (e: React.MouseEvent) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      e.preventDefault();
      onRequireAuth("/list-property");
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (guests !== "2") params.set("guests", guests);
    if (horses !== "2") params.set("horses", horses);
    if (bedrooms !== "0") params.set("bedrooms", bedrooms);
    if (bathrooms !== "0") params.set("bathrooms", bathrooms);
    if (propertyType) params.set("type", propertyType);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <section className="relative">
      {/* Hero image */}
      <div className="relative w-full">
        <Image
          src="/hero.jpg"
          alt="White horse in equestrian pasture at sunset"
          width={1920}
          height={1080}
          className="w-full h-[100vh] sm:h-[90vh] object-cover object-[70%_center] sm:object-center"
          priority
        />
        {/* Rich cinematic gradient overlay: gives depth without washing out the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col justify-start px-6 pt-16 sm:px-12 sm:pt-20">
          <motion.h1
            className="font-serif text-[46px] sm:text-6xl leading-[1.02] text-white max-w-[8ch] drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            {t.hero.title}
          </motion.h1>

          <motion.p
            className="mt-3 text-3xl sm:text-4xl text-[#F3C644] drop-shadow-md"
            style={{ fontFamily: '"Great Vibes", "Snell Roundhand", cursive', fontStyle: "italic" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
          >
            {t.hero.script}
          </motion.p>

          {/* Info pills */}
          <motion.div
            className="mt-16 sm:mt-20 space-y-3 max-w-[22rem]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
          >
            <div className="rounded-2xl bg-black/40 backdrop-blur-md px-5 py-3 text-white text-[15px] leading-snug ring-1 ring-white/25 shadow-lg">
              {t.hero.pill1}
            </div>
            <div className="rounded-2xl bg-black/40 backdrop-blur-md px-5 py-3 text-white text-[15px] leading-snug ring-1 ring-white/25 shadow-lg">
              {t.hero.pill2}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search card — overlaps bottom of hero */}
      <motion.div
        className="px-4 -mt-12 sm:-mt-16 relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-2xl bg-white rounded-2xl p-5 sm:p-6 shadow-2xl shadow-[#1F3A2B]/10 ring-1 ring-black/5">
          <div className="space-y-4">
            {/* Location */}
            <div className="space-y-1 border-b border-[#E5E0D6] pb-3">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#6E7771]">
                {t.hero.location}
              </label>
              <input
                placeholder={t.hero.searchPlaceholder}
                autoComplete="off"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-lg text-[#1B221E] bg-transparent focus:outline-none"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1 border-b border-[#E5E0D6] pb-3">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-[#6E7771]">
                  {t.hero.checkIn}
                </label>
                <input
                  type="date"
                  min={today}
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  className="w-full text-base text-[#1B221E] bg-transparent focus:outline-none"
                />
              </div>
              <div className="space-y-1 border-b border-[#E5E0D6] pb-3">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-[#6E7771]">
                  {t.hero.checkOut}
                </label>
                <input
                  type="date"
                  min={today}
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  className="w-full text-base text-[#1B221E] bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Guests / Horses / Beds / Baths */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: t.hero.guests, value: guests, onChange: setGuests },
                { label: t.hero.horses, value: horses, onChange: setHorses },
                { label: t.hero.bedrooms, value: bedrooms, onChange: setBedrooms, anyOption: true },
                { label: t.hero.bathrooms, value: bathrooms, onChange: setBathrooms, anyOption: true },
              ].map(({ label, value, onChange, anyOption }) => (
                <div key={label} className="space-y-1 border-b border-[#E5E0D6] pb-3">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-[#6E7771]">
                    {label}
                  </label>
                  <div className="relative">
                    <select
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full appearance-none bg-transparent text-lg text-[#1B221E] focus:outline-none pr-6"
                    >
                      {anyOption && <option value="0">Any</option>}
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={String(n)}>
                          {anyOption ? `${n}+` : n}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#6E7771]">
                      ▾
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Property type */}
            <div className="space-y-1 border-b border-[#E5E0D6] pb-3">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#6E7771]">
                {t.hero.propertyType}
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full appearance-none bg-transparent text-lg text-[#1B221E] focus:outline-none pr-6"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value}>
                      {pt.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#6E7771]">
                  ▾
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleSearch}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E1B534] text-white py-4 rounded-full text-base font-medium tracking-wide active:scale-[0.99] transition-transform"
              >
                <Search className="size-4" aria-hidden="true" />
                {t.hero.findStay}
              </button>
              <Link
                href="/list-property"
                onClick={handleListPropertyClick}
                className="w-full inline-flex items-center justify-center gap-2 border border-[#E1B534] text-[#E1B534] py-4 rounded-full text-base font-medium hover:bg-[#FAF7F2] transition-colors"
              >
                {t.hero.listYourProperty}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   My Equine Services Ecosystem
   ============================================================ */
function EcosystemSection() {
  const { t } = useLanguage();
  return (
    <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-[#FAF7F2] via-[#E1B534]/[0.07] to-[#FAF7F2]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <h2 className="section-heading">{t.services.heading}</h2>
          <span className="mt-3 mx-auto block h-[2px] w-20 sm:w-24 bg-gradient-to-r from-transparent via-[#E1B534] to-transparent" />
          <p className="text-sm text-[#6E7771] mt-3 max-w-xl mx-auto">
            {t.services.subheading}
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4 max-w-5xl mx-auto">
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            const content = (
              <div
                className={`relative flex flex-col items-center text-center p-4 rounded-xl bg-white border border-[#E5E0D6]/70 transition-all h-full ${
                  svc.active
                    ? "hover:border-[#E1B534] hover:shadow-[0_10px_30px_-15px_rgba(225,181,52,0.45)]"
                    : "opacity-75 cursor-default"
                }`}
              >
                {!svc.active && (
                  <span className="absolute top-2 right-2 text-[8px] font-semibold uppercase tracking-widest text-[#6E7771] bg-[#FAF7F2] px-1.5 py-0.5 rounded-full ring-1 ring-[#E5E0D6]/60">
                    {t.services.comingSoon}
                  </span>
                )}
                <div className="size-9 rounded-full bg-[#FAF7F2] grid place-items-center ring-1 ring-[#E5E0D6]/60 mb-2.5">
                  <Icon className="size-4 text-[#E1B534]" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-sm sm:text-base text-[#1F3A2B] leading-tight">
                  {svc.name}
                </h3>
                <p className="text-[11px] text-[#6E7771] mt-1 leading-snug flex-1">
                  {svc.tagline}
                </p>
                {svc.active && (
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#E1B534]">
                    {t.services.visitSite}
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                )}
              </div>
            );

            return svc.href ? (
              <a
                key={svc.id}
                href={svc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
              >
                {content}
              </a>
            ) : (
              <div key={svc.id} className="group block h-full">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   How It Works
   ============================================================ */
function HowItWorksSection() {
  const { t } = useLanguage();
  const steps = [
    { number: "01", title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc },
    { number: "02", title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc },
    { number: "03", title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#FAF7F2] via-[#E1B534]/[0.09] to-[#FAF7F2] border-y border-[#E5E0D6]/70">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="section-heading">{t.howItWorks.heading}</h2>
          <span className="mt-3 mx-auto block h-[2px] w-20 sm:w-24 bg-gradient-to-r from-transparent via-[#E1B534] to-transparent" />
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.12}>
              <div className="p-6 rounded-2xl border border-[#E5E0D6]/70 bg-white">
                <p className="font-serif text-2xl text-[#E1B534]">{step.number}</p>
                <h3 className="font-medium text-lg mt-2 text-[#1B221E]">{step.title}</h3>
                <p className="text-sm text-[#6E7771] mt-2">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Listings Section — horizontal scroll of featured stays
   ============================================================ */
function ListingsSection() {
  const { t } = useLanguage();
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [totalFeatured, setTotalFeatured] = useState(0);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();

        // Load user favorites
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          const { data: favData } = await (supabase.from("favorites") as any)
            .select("listing_id")
            .eq("user_id", user.id);
          if (favData) setFavoriteIds(new Set((favData as any[]).map((f) => f.listing_id)));
        }

        // Fetch featured (premium) listings, up to 20
        const { data, count } = await supabase
          .from("listings")
          .select("id, title, property_type, city, stalls, bedrooms, price_per_night, price_per_week, is_featured, plan", { count: "exact" })
          .eq("status", "active")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(20);

        if (data && data.length > 0) {
          const mapped: ListingCardData[] = (data as any[]).map((l) => ({
            id: l.id,
            title: l.title,
            category: l.property_type ?? "farm",
            neighborhood: l.city ?? "Ocala",
            stalls: l.stalls ?? 0,
            bedrooms: l.bedrooms ?? undefined,
            pricePerNight: l.price_per_night ?? 0,
            pricePerWeek: l.price_per_week ?? 0,
            images: [],
            isFeatured: true,
          }));
          setListings(mapped);
          setTotalFeatured(count ?? mapped.length);
        } else {
          // Fallback to sample featured listings
          const sampleFeatured = SAMPLE_LISTINGS
            .filter((l) => l.is_featured || l.plan === "premium")
            .slice(0, 20)
            .map((l) => ({
              id: l.id,
              title: l.title,
              category: l.property_type,
              neighborhood: l.city,
              stalls: l.stalls,
              bedrooms: l.bedrooms,
              pricePerNight: l.price_per_night,
              pricePerWeek: l.price_per_week ?? 0,
              milesToWec: 2.6,
              images: l.listing_photos?.[0]?.url ? [l.listing_photos[0].url] : [],
              isFeatured: true,
            }));
          setListings(sampleFeatured);
          // total featured count from all sample listings
          setTotalFeatured(SAMPLE_LISTINGS.filter((l) => l.is_featured || l.plan === "premium").length);
        }
      } catch {
        const sampleFeatured = SAMPLE_LISTINGS
          .filter((l) => l.is_featured)
          .slice(0, 20)
          .map((l) => ({
            id: l.id,
            title: l.title,
            category: l.property_type,
            neighborhood: l.city,
            stalls: l.stalls,
            bedrooms: l.bedrooms,
            pricePerNight: l.price_per_night,
            pricePerWeek: l.price_per_week ?? 0,
            milesToWec: 2.6,
            images: l.listing_photos?.[0]?.url ? [l.listing_photos[0].url] : [],
            isFeatured: true,
          }));
        setListings(sampleFeatured);
        setTotalFeatured(sampleFeatured.length);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleFavorite = async (listingId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) { window.location.href = "/auth?mode=signin"; return; }
    const supabase = createClient();
    const isFav = favoriteIds.has(listingId);
    setFavoriteIds((prev) => { const n = new Set(prev); isFav ? n.delete(listingId) : n.add(listingId); return n; });
    if (isFav) {
      await (supabase.from("favorites") as any).delete().eq("user_id", userId).eq("listing_id", listingId);
    } else {
      await (supabase.from("favorites") as any).insert({ user_id: userId, listing_id: listingId });
    }
  };

  return (
    <section className="py-16 overflow-x-hidden">
      {/* Section header — padded */}
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-8">
          <h2 className="section-heading">{t.listings.heading}</h2>
          <span className="mt-3 block h-[2px] w-20 sm:w-24 bg-gradient-to-r from-[#E1B534] to-transparent" />
          <p className="mt-2 text-xs text-[#6E7771]">
            Premium verified equestrian stays
          </p>
        </header>
      </div>

      {/* Scroll rail — full width, no negative margins */}
      {loading ? (
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-5 pb-4 px-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="shrink-0 w-56 sm:w-64">
                <div className="skeleton aspect-[4/5] rounded-xl mb-4" />
                <div className="skeleton h-4 w-1/3 mb-2" />
                <div className="skeleton h-5 w-2/3 mb-1" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : listings.length === 0 ? (
        <p className="text-sm text-[#6E7771] px-4">No featured stays available right now. Check back soon!</p>
      ) : (
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-5 pb-4 px-4">
            {listings.map((listing, i) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                index={i}
                isFavorited={favoriteIds.has(listing.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA — view all properties */}
      <div className="mx-auto max-w-7xl px-4 mt-8">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 py-3.5 px-6 rounded-full bg-[#E1B534] text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          View all properties{totalFeatured > 0 ? ` (${totalFeatured})` : ""}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

/* ============================================================
   Shelters Section
   ============================================================ */
function SheltersSection() {
  const { t } = useLanguage();
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#FAF7F2] via-[#E1B534]/[0.07] to-[#FAF7F2] border-y border-[#E5E0D6]/70">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <h2 className="section-heading">{t.shelters.heading}</h2>
          <span className="mt-3 mx-auto block h-[2px] w-20 sm:w-24 bg-gradient-to-r from-transparent via-[#E1B534] to-transparent" />
          <p className="text-sm text-[#6E7771] mt-3 max-w-xl mx-auto">
            {t.shelters.subheading}
          </p>
        </header>

        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <FadeIn>
              <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white border border-[#E5E0D6]/70 w-full shadow-xs">
                <span className="flex size-16 items-center justify-center rounded-full bg-[#E1B534] text-white font-medium text-sm shrink-0">
                  Rescue
                </span>
                <h3 className="font-serif text-lg text-[#1F3A2B] leading-tight">
                  {t.shelters.partnerTitle}
                </h3>
                <p className="text-xs text-[#6E7771] leading-snug">
                  {t.shelters.partnerDesc}
                </p>
                <a
                  href="#"
                  className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#E1B534]/60 text-white px-5 py-2.5 text-sm font-medium hover:bg-[#E1B534] transition-colors"
                >
                  <Heart className="size-4" aria-hidden="true" />
                  {t.shelters.donateBtn}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
                <span className="text-[11px] text-[#1F3A2B] underline underline-offset-2 cursor-pointer">
                  {t.shelters.visitWebsite}
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRedirect, setAuthRedirect] = useState("/list-property");

  const handleRequireAuth = (path: string) => {
    setAuthRedirect(path);
    setAuthModalOpen(true);
  };

  return (
    <>
      <HeroSection onRequireAuth={handleRequireAuth} />
      <EcosystemSection />
      <HowItWorksSection />
      <ListingsSection />
      <SheltersSection />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        redirectPath={authRedirect}
      />
    </>
  );
}
