"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
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
   Mapbox Component
   ============================================================ */
function MapboxView({ listings }: { listings: ListingWithPhotos[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    import("mapbox-gl").then((mapboxgl) => {
      const mapboxglModule = mapboxgl.default || mapboxgl;
      (mapboxglModule as { accessToken: string }).accessToken =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

      const map = new (mapboxglModule as any).Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [-82.14, 29.19],
        zoom: 9.5,
      });

      mapRef.current = map;

      map.on("load", () => {
        setMapLoaded(true);
        listings.forEach((listing) => {
          if (!listing.latitude || !listing.longitude) return;
          const el = document.createElement("div");
          el.className =
            "px-2.5 py-1 bg-[#1F3A2B] text-white rounded-full text-xs font-semibold shadow-md cursor-pointer hover:scale-110 transition-transform";
          el.textContent = `$${listing.price_per_night}`;

          new (mapboxglModule as any).Marker({ element: el })
            .setLngLat([listing.longitude, listing.latitude])
            .addTo(map);
        });
      });
    });

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  }, [listings]);

  return (
    <div className="relative w-full h-[550px] lg:h-[650px] rounded-2xl overflow-hidden border border-[#E5E0D6] bg-white sticky top-24">
      <div ref={mapContainer} className="absolute inset-0" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
          <div className="size-12 rounded-full bg-[#1F3A2B]/10 text-[#1F3A2B] grid place-items-center mb-3">
            <MapPin size={24} />
          </div>
          <p className="font-serif text-xl text-[#1B221E] mb-1">
            Ocala Equestrian Map
          </p>
          <p className="text-xs text-[#6E7771] max-w-xs">
            Viewing {listings.length} verified stays around World Equestrian Center and HITS Ocala.
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Main Browse Content
   ============================================================ */
function BrowseContent() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [listings, setListings] = useState<ListingWithPhotos[]>(SAMPLE_LISTINGS);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [sort, setSort] = useState("newest");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") ?? "");

  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTER_VALUES);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSubmitted, setAlertSubmitted] = useState(false);
  const { t } = useLanguage();

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

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header bar matching live site */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div>
          <h1 className="section-heading">{t.search.heading}</h1>
          <p className="text-sm text-[#6E7771] mt-1">
            {loading ? "Loading…" : `${listings.length} properties · Florida, USA`}
          </p>
        </div>

        {/* Property type pills row */}
        <div className="mt-8 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
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

        {/* Actions row matching live site */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
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
      </div>

      {/* Main Content Area: Grid vs Split Map View (Screenshot 3) */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="space-y-3">
                <div className="skeleton aspect-[4/5] rounded-xl" />
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
          /* Split View matching Screenshot 3: Map on Left, Compact Cards on Right */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <MapboxView listings={listings} />

            <div className="space-y-4">
              {listings.map((listing) => {
                const coverPhoto =
                  listing.listing_photos?.find((p) => p.is_cover)?.url ??
                  listing.listing_photos?.[0]?.url;
                const displayPrice = listing.price_per_night || 0;
                const period = listing.price_per_night ? "night" : "week";

                return (
                  <Link
                    key={listing.id}
                    href={`/property/${listing.id}`}
                    className="group block rounded-2xl border border-[#E5E0D6] bg-white p-3.5 hover:border-[#1F3A2B] hover:shadow-sm transition-all"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="relative w-36 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden bg-[#E5E0D6]/30 shrink-0">
                        {coverPhoto ? (
                          <Image
                            src={coverPhoto}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="180px"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-xs text-[#6E7771]">
                            No photo
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E1B534]">
                          2.6 MI TO WEC
                        </span>
                        <h3 className="font-serif text-lg text-[#1B221E] font-medium truncate mt-0.5">
                          {listing.title}
                        </h3>
                        <p className="text-xs text-[#6E7771] mt-1">
                          {listing.city} · {listing.stalls} stalls · {listing.bedrooms ?? 2} bd
                        </p>
                        <p className="font-serif text-lg text-[#1F3A2B] mt-2 leading-none">
                          ${displayPrice}{" "}
                          <span className="text-[10px] uppercase text-[#6E7771] font-sans font-normal">
                            / {period}
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
          /* Standard 3-column Portrait Grid */
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const coverPhoto =
                listing.listing_photos?.find((p) => p.is_cover)?.url ??
                listing.listing_photos?.[0]?.url;

              const displayPrice = listing.price_per_night || 0;
              const period = listing.price_per_night ? "night" : "week";
              const cat =
                categoryLabels[listing.property_type] ?? "Equestrian Farm";

              return (
                <Link
                  key={listing.id}
                  href={`/property/${listing.id}`}
                  className="group block"
                >
                  <div className="relative mb-4 overflow-hidden rounded-xl aspect-[4/5] bg-[#E5E0D6]/30">
                    {coverPhoto ? (
                      <Image
                        src={coverPhoto}
                        alt={listing.title}
                        fill
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E5E0D6]/40 flex items-center justify-center text-[#6E7771] text-xs">
                        No photo
                      </div>
                    )}

                    <span className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider text-[#1F3A2B] uppercase ring-1 ring-black/5">
                      2.6 mi to WEC
                    </span>

                    <button
                      className="absolute top-3 right-3 size-9 grid place-items-center rounded-full bg-[#FAF7F2]/90 backdrop-blur ring-1 ring-black/5 hover:scale-105 transition-transform"
                      aria-label="Save to favorites"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart className="size-4 text-[#1F3A2B]" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-[#E1B534] mb-1">
                        {cat}
                      </p>
                      <h3 className="font-medium text-[#1B221E] truncate">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-[#6E7771] mt-0.5">
                        {listing.city}
                        {listing.stalls > 0 ? ` · ${listing.stalls} stalls` : ""}
                        {listing.bedrooms > 0 ? ` · ${listing.bedrooms} bd` : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-serif text-lg text-[#1F3A2B] leading-none">
                        ${displayPrice}
                      </p>
                      <p className="text-[10px] uppercase text-[#6E7771] tracking-widest mt-1">
                        {period}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Advanced Filter Modal (Screenshots 1, 2, 3 of 2nd batch) */}
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
