"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  MapPin,
  X,
  Heart,
  Bell,
  ArrowUpDown,
  List,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { SAMPLE_LISTINGS } from "@/lib/data/sample-listings";
import { createClient } from "@/lib/supabase/client";
import {
  FilterModal,
  FilterValues,
  DEFAULT_FILTER_VALUES,
} from "@/components/ui/filter-modal";
import type { ListingWithPhotos } from "@/types/database";
import { useLanguage } from "@/lib/i18n/context";
import { GoogleMapWrapper } from "@/components/ui/google-map";
import { getLocalizedListing } from "@/lib/i18n/listing-localization";
import { propertyTypeLabel } from "@/lib/utils";

/* ============================================================
   useFavorites — manages favorite state + Supabase sync
   ============================================================ */
function useFavorites() {
  const supabase = createClient();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await (supabase.from("favorites") as any)
        .select("listing_id")
        .eq("user_id", user.id);
      if (data) {
        setFavoriteIds(new Set((data as any[]).map((f) => f.listing_id)));
      }
      loadedRef.current = true;
    }
    init();
  }, [supabase]);

  const toggle = useCallback(async (listingId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      // Redirect to sign in
      window.location.href = "/auth?mode=signin";
      return;
    }
    const isFav = favoriteIds.has(listingId);
    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(listingId);
      else next.add(listingId);
      return next;
    });
    if (isFav) {
      await (supabase.from("favorites") as any)
        .delete()
        .eq("user_id", userId)
        .eq("listing_id", listingId);
    } else {
      await (supabase.from("favorites") as any)
        .insert({ user_id: userId, listing_id: listingId });
    }
  }, [userId, favoriteIds, supabase]);

  return { favoriteIds, toggle };
}

const PAGE_SIZE = 20;

const CATEGORIES = [
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

const categoryLabels: Record<string, string> = {
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
  barn_stall: "Barn / Stalls",
};

/* ============================================================
   Google Maps Component (browse / search view) — responsive
   ============================================================ */
function GoogleMapView({ listings }: { listings: ListingWithPhotos[] }) {
  return (
    <GoogleMapWrapper
      mode="browse"
      listings={listings}
      className="w-full h-[50vh] md:h-[550px] lg:h-[650px] rounded-2xl overflow-hidden border border-[#E5E0D6] bg-white md:sticky md:top-24"
    />
  );
}

/* ============================================================
   Pagination Controls
   ============================================================ */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 mt-10 pt-6 border-t border-[#E5E0D6] w-full max-w-full">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#E5E0D6] bg-white text-xs sm:text-sm text-[#1B221E] hover:border-[#1F3A2B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
      >
        <ChevronLeft className="size-3.5 sm:size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1 sm:gap-1.5">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isNear =
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1;

          if (!isNear) {
            if (page === 2 && currentPage > 4) return <span key={page} className="text-[#6E7771] text-xs sm:text-sm px-1">…</span>;
            if (page === totalPages - 1 && currentPage < totalPages - 3) return <span key={page} className="text-[#6E7771] text-xs sm:text-sm px-1">…</span>;
            return null;
          }

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`size-8 sm:size-9 rounded-full text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                page === currentPage
                  ? "bg-[#1F3A2B] text-white"
                  : "border border-[#E5E0D6] bg-white text-[#1B221E] hover:border-[#1F3A2B]"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#E5E0D6] bg-white text-xs sm:text-sm text-[#1B221E] hover:border-[#1F3A2B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="size-3.5 sm:size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/* ============================================================
   Main Browse Content
   ============================================================ */
function BrowseContent() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { t, language } = useLanguage();

  const [listings, setListings] = useState<ListingWithPhotos[]>(SAMPLE_LISTINGS);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [sort, setSort] = useState("newest");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") ?? "");
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTER_VALUES);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSubmitted, setAlertSubmitted] = useState(false);
  const { favoriteIds, toggle: toggleFavorite } = useFavorites();

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("listings")
        .select("*, listing_photos(*)")
        .eq("status", "published");

      if (selectedType) {
        query = query.eq("property_type", selectedType);
      }
      if (filters.maxPriceNight < 1500) {
        query = query.lte("price_per_night", filters.maxPriceNight);
      }
      if (filters.bedrooms > 0) {
        query = query.gte("bedrooms", filters.bedrooms);
      }
      if (filters.stalls > 0) {
        query = query.gte("stalls", filters.stalls);
      }

      if (sort === "price-asc") {
        query = query.order("price_per_night", { ascending: true });
      } else if (sort === "price-desc") {
        query = query.order("price_per_night", { ascending: false });
      } else if (sort === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data } = await query;
      if (data && data.length > 0) {
        setListings((data as ListingWithPhotos[]) ?? []);
      } else {
        // Fallback to client-filtered sample listings
        let filtered = [...SAMPLE_LISTINGS];
        if (selectedType) {
          filtered = filtered.filter(
            (l) =>
              l.property_type === selectedType ||
              categoryLabels[l.property_type] === categoryLabels[selectedType]
          );
        }
        if (filters.maxPriceNight < 1500) {
          filtered = filtered.filter((l) => l.price_per_night <= filters.maxPriceNight);
        }
        if (filters.bedrooms > 0) {
          filtered = filtered.filter((l) => l.bedrooms >= filters.bedrooms);
        }
        if (filters.stalls > 0) {
          filtered = filtered.filter((l) => l.stalls >= filters.stalls);
        }
        if (sort === "price-asc") {
          filtered.sort((a, b) => a.price_per_night - b.price_per_night);
        } else if (sort === "price-desc") {
          filtered.sort((a, b) => b.price_per_night - a.price_per_night);
        }
        setListings(filtered);
      }
    } catch {
      setListings(SAMPLE_LISTINGS);
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedType, filters, sort]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Reset to page 1 when filters / type / sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, filters, sort]);

  const handleAlertSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail) return;
    try {
      await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: alertEmail }),
      });
    } catch {
      // ignore
    }
    setAlertSubmitted(true);
  };

  // Pagination helpers
  const totalPages = Math.ceil(listings.length / PAGE_SIZE);
  const paginatedListings = listings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] overflow-x-hidden w-full">
      {/* Page title */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <h1 className="section-heading">{t.search.heading}</h1>
        <p className="text-sm text-[#6E7771] mt-1">
          {loading
            ? "Loading…"
            : `${listings.length} properties · Florida, USA`}
        </p>
      </div>

      {/* Property type pills — smoothly scrollable, strictly contained */}
      <div className="mt-5 w-full max-w-full overflow-x-auto scrollbar-hide">
        <div className="inline-flex gap-2 pb-2 px-4">
          {CATEGORIES.map((cat) => {
            const isActive = selectedType === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedType(cat.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-[#E1B534] text-[#FAF7F2] border border-[#E1B534]"
                    : "bg-white border border-[#E5E0D6] text-[#1B221E] hover:border-[#E1B534]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions row */}
      <div className="mx-auto max-w-7xl px-4 mt-3 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setAlertOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-[#E1B534] bg-[#E1B534]/10 text-[#1B221E] px-4 py-2 text-sm hover:bg-[#E1B534]/20 transition-colors"
        >
          <Bell className="size-4" aria-hidden="true" />
          {t.search.alertMe}
        </button>

        <label className="inline-flex items-center gap-2 rounded-full border border-[#E5E0D6] bg-white px-3 py-2 text-sm">
          <ArrowUpDown className="size-4 text-[#E1B534]" aria-hidden="true" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent outline-none text-sm cursor-pointer"
            aria-label="Sort"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => setShowFilters(true)}
          className="inline-flex items-center gap-2 rounded-full border border-[#E5E0D6] bg-white px-4 py-2 text-sm hover:border-[#1F3A2B] transition-colors"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          {t.search.filter}
        </button>

        <button
          type="button"
          onClick={() => setShowMap((prev) => !prev)}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
            showMap
              ? "border-[#1F3A2B] bg-[#1F3A2B] text-white"
              : "border-[#E5E0D6] bg-white text-[#1B221E] hover:border-[#1F3A2B]"
          }`}
        >
          {showMap ? (
            <>
              <List className="size-4" aria-hidden="true" />
              {t.search.showList}
            </>
          ) : (
            <>
              <MapPin className="size-4" aria-hidden="true" />
              {t.search.showMap}
            </>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-6 w-full max-w-full">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 w-full max-w-full">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="space-y-3">
                <div className="skeleton aspect-[4/3] rounded-2xl w-full" />
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <h3 className="font-serif text-2xl text-[#1F3A2B] mb-2">
              No properties found
            </h3>
            <p className="text-sm text-[#6E7771] mb-6">
              Try adjusting your category or filter settings.
            </p>
            <button
              onClick={() => {
                setSelectedType("");
                setFilters(DEFAULT_FILTER_VALUES);
              }}
              className="inline-flex items-center rounded-full bg-[#E1B534] text-white px-6 py-2.5 text-sm font-medium"
            >
              Reset filters
            </button>
          </div>
        ) : showMap ? (
          /* Split View — stacked on mobile, side-by-side on desktop */
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 items-start">
            {/* Map — full width on mobile, sticky on desktop */}
            <GoogleMapView listings={listings} />

            {/* Compact card list */}
            <div className="space-y-4 w-full">
              {listings.map((listing) => {
                const coverPhoto =
                  listing.listing_photos?.find((p) => p.is_cover)?.url ??
                  listing.listing_photos?.[0]?.url;
                const loc = getLocalizedListing(listing, language);
                const displayPrice = listing.price_per_night || 0;
                const period = listing.price_per_night ? "night" : "week";

                return (
                  <Link
                    key={listing.id}
                    href={`/property/${listing.id}`}
                    className={`group block rounded-2xl border bg-white p-3.5 hover:shadow-sm transition-all ${
                      listing.is_featured || listing.plan === "premium"
                        ? "border-[#E1B534]/60 ring-1 ring-[#E1B534]/20"
                        : "border-[#E5E0D6] hover:border-[#1F3A2B]"
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <div className="relative w-28 sm:w-36 aspect-[4/3] rounded-xl overflow-hidden bg-[#E5E0D6]/30 shrink-0">
                        {coverPhoto ? (
                          <Image
                            src={coverPhoto}
                            alt={loc.title || listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="150px"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-xs text-[#6E7771]">
                            No photo
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Featured pill on map list card */}
                        {(listing.is_featured || listing.plan === "premium") && (
                          <span className="inline-flex items-center gap-1 bg-[#E1B534] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase mb-1">
                            <Star className="size-2 fill-white" />
                            {t.propertyDetail?.featuredStay || "Featured"}
                          </span>
                        )}
                        <h3 className="font-serif text-base text-[#1B221E] font-medium truncate mt-0.5">
                          {loc.title || listing.title}
                        </h3>
                        <p className="text-xs text-[#6E7771] mt-1">
                          {listing.city} · {listing.stalls} {t.listings.stalls} · {listing.bedrooms ?? 2} {t.listings.bedrooms}
                        </p>
                        <p className="font-serif text-base text-[#1F3A2B] mt-1 leading-none">
                          ${displayPrice}{" "}
                          <span className="text-[10px] uppercase text-[#6E7771] font-sans font-normal">
                            / {period === "night" ? t.listings.perNight : t.listings.perWeek}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          /* Standard Grid with Pagination */
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 w-full max-w-full">
              {paginatedListings.map((listing) => {
                const coverPhoto =
                  listing.listing_photos?.find((p) => p.is_cover)?.url ??
                  listing.listing_photos?.[0]?.url;

                const loc = getLocalizedListing(listing, language);
                const displayPrice = listing.price_per_night || 0;
                const period = listing.price_per_night ? "night" : "week";
                const cat =
                  propertyTypeLabel(listing.property_type, language) ||
                  categoryLabels[listing.property_type] ||
                  "Equestrian Farm";
                const isFeatured = listing.is_featured || listing.plan === "premium";

                return (
                  <Link
                    key={listing.id}
                    href={`/property/${listing.id}`}
                    className="group block w-full"
                  >
                    {/* 4:3 social media content post ratio — compact so full card details fit at a glance */}
                    <div className="relative mb-3 overflow-hidden rounded-2xl aspect-[4/3] bg-[#E5E0D6]/30 w-full">
                      {coverPhoto ? (
                        <Image
                          src={coverPhoto}
                          alt={loc.title || listing.title}
                          fill
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#E5E0D6]/40 flex items-center justify-center text-[#6E7771] text-xs">
                          No photo
                        </div>
                      )}

                      {/* Featured badge — top-left */}
                      {isFeatured ? (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[#E1B534] text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
                          <Star className="size-2.5 fill-white" />
                          {t.propertyDetail?.featuredStay || "Featured"}
                        </span>
                      ) : (
                        <span className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider text-[#1F3A2B] uppercase ring-1 ring-black/5">
                          2.6 mi to WEC
                        </span>
                      )}

                      {/* Favorite button */}
                      <button
                        className="absolute top-3 right-3 size-9 grid place-items-center rounded-full bg-[#FAF7F2]/90 backdrop-blur ring-1 ring-black/5 hover:scale-105 transition-transform"
                        aria-label={favoriteIds.has(listing.id) ? "Remove from favorites" : "Save to favorites"}
                        onClick={(e) => toggleFavorite(listing.id, e)}
                      >
                        <Heart
                          className={`size-4 transition-colors ${
                            favoriteIds.has(listing.id)
                              ? "fill-red-500 text-red-500"
                              : "text-[#1F3A2B]"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    {/* Full details visible at a glance */}
                    <div className="flex justify-between items-start gap-3 w-full">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-widest text-[#E1B534] mb-1 font-semibold truncate">
                          {cat}
                        </p>
                        <h3 className="font-medium text-[#1B221E] text-base leading-snug truncate">
                          {loc.title || listing.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#6E7771] mt-0.5 truncate">
                          {listing.city}
                          {listing.stalls > 0 ? ` · ${listing.stalls} ${t.listings.stalls}` : ""}
                          {listing.bedrooms > 0 ? ` · ${listing.bedrooms} ${t.listings.bedrooms}` : ""}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-serif text-lg sm:text-xl text-[#1F3A2B] leading-none">
                          ${displayPrice}
                        </p>
                        <p className="text-[10px] uppercase text-[#6E7771] tracking-widest mt-1">
                          / {period === "night" ? t.listings.perNight : t.listings.perWeek}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            {/* Page summary */}
            {totalPages > 1 && (
              <p className="text-center text-xs text-[#6E7771] mt-3">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, listings.length)} of{" "}
                {listings.length} properties
              </p>
            )}
          </>
        )}
      </div>

      {/* Advanced Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onChange={setFilters}
        matchCount={listings.length}
      />

      {/* Alert Modal */}
      <AnimatePresence>
        {alertOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#E5E0D6]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl text-[#1F3A2B]">
                  New listing alerts
                </h3>
                <button
                  onClick={() => {
                    setAlertOpen(false);
                    setAlertSubmitted(false);
                  }}
                  className="p-1 rounded-full text-[#6E7771] hover:bg-[#FAF7F2]"
                >
                  <X size={18} />
                </button>
              </div>

              {alertSubmitted ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-[#1F3A2B] font-medium">
                    ✓ You&apos;re subscribed!
                  </p>
                  <p className="text-xs text-[#6E7771] mt-1">
                    We&apos;ll email you when new properties in Florida are listed.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAlertSubscribe} className="space-y-4">
                  <p className="text-xs text-[#6E7771]">
                    Get an email as soon as new farms, barns, or horse stays are
                    published.
                  </p>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E5E0D6] bg-[#FAF7F2] text-sm outline-none focus:border-[#1F3A2B]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-[#E1B534] text-white text-sm font-medium hover:opacity-95"
                  >
                    Subscribe to alerts
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] p-8">
          <div className="mx-auto max-w-7xl">
            <div className="skeleton h-10 w-48 mb-4" />
            <div className="skeleton h-6 w-32" />
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
