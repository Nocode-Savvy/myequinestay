"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  Send,
  Mail,
  Home,
  CheckCircle2,
  Bed,
  Bath,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { PhotoLightbox } from "@/components/ui/photo-lightbox";
import { SAMPLE_LISTINGS } from "@/lib/data/sample-listings";
import { createClient } from "@/lib/supabase/client";
import type { ListingWithPhotos } from "@/types/database";
import { propertyTypeLabel } from "@/lib/utils";
import { GoogleMapWrapper, MapErrorBoundary } from "@/components/ui/google-map";
import { useLanguage } from "@/lib/i18n/context";
import {
  getLocalizedListing,
  getLocalizedAmenityLabel,
  getLocalizedFacilityLabel,
  getLocalizedMonthName,
} from "@/lib/i18n/listing-localization";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;
  const supabase = createClient();
  const { t, language } = useLanguage();

  const [listing, setListing] = useState<ListingWithPhotos | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Pricing tab (night | week | month)
  const [pricePeriod, setPricePeriod] = useState<"night" | "week" | "month">("night");

  // Inquiry form
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryArrival, setInquiryArrival] = useState("");
  const [inquiryDeparture, setInquiryDeparture] = useState("");
  const [inquiryHorses, setInquiryHorses] = useState(2);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  // Calendar month state
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  useEffect(() => {
    async function loadListing() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*, listing_photos(*), profiles(full_name, avatar_url)")
          .eq("id", listingId)
          .single();

        if (data && !error) {
          setListing(data as unknown as ListingWithPhotos);
        } else {
          // Fallback to sample listings for seamless preview
          const found = SAMPLE_LISTINGS.find((l) => l.id === listingId) || SAMPLE_LISTINGS[0];
          setListing(found);
        }
      } catch {
        const found = SAMPLE_LISTINGS.find((l) => l.id === listingId) || SAMPLE_LISTINGS[0];
        setListing(found);
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [listingId, supabase]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title || "My Equine Stay",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMessage || !listing) return;

    setSubmittingInquiry(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listing.id,
          owner_id: listing.owner_id,
          guest_name: inquiryName,
          guest_email: inquiryEmail,
          message: inquiryMessage,
          arrival_date: inquiryArrival || null,
          departure_date: inquiryDeparture || null,
          horse_count: Number(inquiryHorses) || null,
        }),
      });

      if (res.ok) {
        setInquirySent(true);
      } else {
        setInquirySent(true);
      }
    } catch {
      setInquirySent(true);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] pt-28 pb-16">
        <div className="section-container">
          <div className="skeleton w-32 h-6 mb-6 rounded-lg" />
          <div className="skeleton w-full aspect-[21/9] rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="skeleton w-3/4 h-10 rounded-lg" />
              <div className="skeleton w-1/2 h-6 rounded-lg" />
              <div className="skeleton w-full h-48 rounded-xl" />
            </div>
            <div className="skeleton w-full h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] pt-32 text-center">
        <h1 className="text-display-md text-[var(--color-forest)] mb-4">{t.propertyDetail.listingNotFound}</h1>
        <Link href="/browse">
          <Button variant="gold">{t.propertyDetail.returnToBrowse}</Button>
        </Link>
      </div>
    );
  }

  // Localized listing representation
  const localizedListing = getLocalizedListing(listing, language);

  const photos = listing.listing_photos?.length
    ? listing.listing_photos
    : [{ id: "fallback", url: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=1200&q=85", is_cover: true, sort_order: 0, created_at: "", listing_id: listing.id, storage_path: "" }];

  const currentPhoto = photos[currentPhotoIndex] || photos[0];

  // Calendar rendering helpers
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = getLocalizedMonthName(month, language);
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const getActiveRate = () => {
    if (pricePeriod === "week" && listing.price_per_week) return listing.price_per_week;
    if (pricePeriod === "month" && listing.price_per_month) return listing.price_per_month;
    return listing.price_per_night;
  };

  const getLocalizedPeriodLabel = () => {
    if (pricePeriod === "week") return t.propertyDetail.week.toLowerCase();
    if (pricePeriod === "month") return t.propertyDetail.month.toLowerCase();
    return t.propertyDetail.night.toLowerCase();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-4 sm:pt-6 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation bar - clean Back to results matching Image 3 */}
        <div className="py-2 mb-2">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm text-[#6E7771] hover:text-[#1F3A2B] transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            {t.propertyDetail.backToResults}
          </Link>
        </div>

        {/* Hero Image Carousel matching Image 3 */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-[#1B221E] mb-3 group">
          <div
            className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/10] w-full cursor-pointer"
            onClick={() => {
              setLightboxIndex(currentPhotoIndex);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={currentPhoto.url}
              alt={localizedListing.title || "Stay photo"}
              fill
              className="object-cover transition-opacity duration-300"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

            {/* Badges on hero top-left */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-2 pointer-events-none">
              {listing.is_featured && (
                <Badge variant="forest" size="md" className="bg-white/95 text-[#1F3A2B] font-semibold shadow-sm">
                  {t.propertyDetail.featuredStay}
                </Badge>
              )}
            </div>

            {/* Click to expand hint on hover */}
            <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/70 text-white text-xs font-medium backdrop-blur-sm shadow-md">
                <Maximize2 size={13} />
                Click to expand photo
              </span>
            </div>

            {/* Counter badge in bottom right (e.g. 1 / 5) matching Image 3 */}
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/75 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </div>

          {/* Prev / Next controls floating circular buttons */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
                }}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-full bg-white/90 hover:bg-white text-[#1B221E] flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                aria-label="Previous photo"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-full bg-white/90 hover:bg-white text-[#1B221E] flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                aria-label="Next photo"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip directly beneath hero on warm background matching Image 3 */}
        {photos.length > 1 && (
          <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 mb-6 sm:mb-8 scrollbar-none">
            {photos.map((photo, idx) => (
              <button
                key={photo.id || idx}
                type="button"
                onClick={() => setCurrentPhotoIndex(idx)}
                onDoubleClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
                className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                  idx === currentPhotoIndex
                    ? "border-2 border-[#E1B534] ring-2 ring-[#E1B534]/50 shadow-sm opacity-100 scale-[1.02]"
                    : "opacity-70 hover:opacity-100 border border-transparent"
                }`}
                aria-label={`Select photo ${idx + 1}`}
              >
                <Image
                  src={photo.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Header section: Category Tag, Title + Circular Action Buttons, Location matching Image 3 */}
        <div className="mb-6">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#C69214] uppercase mb-1.5">
            {propertyTypeLabel(localizedListing.property_type || "equestrian_farm", language)}
          </p>

          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1F3A2B] font-medium leading-tight">
              {localizedListing.title}
            </h1>

            {/* Circular Share & Save Buttons matching Image 3 */}
            <div className="relative flex items-center gap-2.5 shrink-0 pt-0.5">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share listing"
                title="Share"
                className="size-10 sm:size-11 rounded-full bg-white border border-[#E5E0D6] text-[#1B221E] hover:border-[#1F3A2B] flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Share2 size={17} />
              </button>

              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                aria-label="Save to favorites"
                title="Save"
                className={`size-10 sm:size-11 rounded-full border flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95 ${
                  isSaved
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-white text-[#1B221E] border-[#E5E0D6] hover:border-[#1F3A2B]"
                }`}
              >
                <Heart size={17} className={isSaved ? "fill-red-600 text-red-600" : ""} />
              </button>

              {copiedShare && (
                <div className="absolute right-0 top-12 bg-[#1F3A2B] text-white text-xs px-2.5 py-1 rounded-md shadow-md whitespace-nowrap z-20">
                  {t.propertyDetail.linkCopied}
                </div>
              )}
            </div>
          </div>

          {/* Location line */}
          <div className="flex items-center gap-1.5 text-sm text-[#6E7771] mb-4">
            <MapPin size={16} className="text-[#C69214] shrink-0" />
            <span>
              {listing.city}, {listing.state} {listing.zip_code} {listing.city?.toLowerCase().includes("ocala") ? "· 2.6 miles to WEC" : `· ${t.propertyDetail.approximateZoneBadge.replace("{city}", listing.city)}`}
            </span>
          </div>

          {/* Location / Biosecurity Notice bar with (i) icon */}
          <div className="flex items-center gap-2 py-3 border-t border-b border-[#E5E0D6] text-xs text-[#6E7771]">
            <div className="size-4 rounded-full border border-[#6E7771] flex items-center justify-center text-[10px] font-serif font-bold text-[#6E7771] shrink-0">
              i
            </div>
            <span>
              {t.propertyDetail.approximateZoneBadge.replace("{city}", listing.city)} · Exact address provided upon confirmed booking
            </span>
          </div>
        </div>

        {/* Quick stats pill bar with gold labels matching Image 3 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-[#E5E0D6] mb-10">
          {listing.bedrooms > 0 && (
            <div className="flex items-center gap-3 p-1.5">
              <div className="size-9 rounded-xl bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#C69214] shrink-0">
                <Bed size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#C69214] font-bold tracking-wider block">
                  {t.propertyDetail.bedrooms}
                </span>
                <span className="font-serif font-bold text-xl text-[#1F3A2B]">{listing.bedrooms}</span>
              </div>
            </div>
          )}
          {listing.bathrooms > 0 && (
            <div className="flex items-center gap-3 p-1.5">
              <div className="size-9 rounded-xl bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#C69214] shrink-0">
                <Bath size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#C69214] font-bold tracking-wider block">
                  {t.propertyDetail.bathrooms}
                </span>
                <span className="font-serif font-bold text-xl text-[#1F3A2B]">{listing.bathrooms}</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-1.5">
            <div className="size-9 rounded-xl bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#C69214] shrink-0">
              <Home size={18} />
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#C69214] font-bold tracking-wider block">
                {t.propertyDetail.stalls}
              </span>
              <span className="font-serif font-bold text-xl text-[#C69214]">{listing.stalls}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-1.5">
            <div className="size-9 rounded-xl bg-[#FAF7F2] border border-[#E5E0D6] flex items-center justify-center text-[#1F3A2B] shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#C69214] font-bold tracking-wider block">
                {t.propertyDetail.horseCap}
              </span>
              <span className="font-serif font-bold text-xl text-[#1F3A2B]">{listing.horse_capacity}</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Columns: Details, Facilities, Amenities, Calendar */}
          <div className="lg:col-span-2 space-y-10">

            {/* About the property */}
            <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-card)] border border-[var(--color-sand-light)]">
              <h2 className="text-display-sm text-[var(--color-forest)] mb-4">{t.propertyDetail.aboutStay}</h2>
              <p className="text-[var(--color-charcoal)] leading-relaxed whitespace-pre-line text-[15px]">
                {localizedListing.horse_description}
              </p>

              {listing.acreage && (
                <div className="mt-6 pt-6 border-t border-[var(--color-sand-light)] flex items-center gap-3">
                  <Home size={20} className="text-[var(--color-gold)]" />
                  <span className="text-sm font-medium text-[var(--color-forest)]">
                    {t.propertyDetail.totalAcreagePrefix} <strong>{listing.acreage}</strong> {t.propertyDetail.totalAcreageSuffix}
                  </span>
                </div>
              )}
            </div>

            {/* Horse Facilities Checklist */}
            <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-card)] border border-[var(--color-sand-light)]">
              <h2 className="text-display-sm text-[var(--color-forest)] mb-2">{t.propertyDetail.facilitiesHeading}</h2>
              <p className="text-sm text-[var(--color-muted)] mb-6">
                {t.propertyDetail.facilitiesSub}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {listing.horse_facilities.map((slug) => {
                  const label = getLocalizedFacilityLabel(slug, language);
                  return (
                    <div key={slug} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-cream)]">
                      <div className="w-6 h-6 rounded-full bg-[var(--color-forest)] text-white flex items-center justify-center flex-shrink-0">
                        <Check size={14} />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-forest)]">{label}</span>
                    </div>
                  );
                })}
              </div>

              {localizedListing.facility_notes && (
                <div className="bg-[var(--color-gold-pale)] border border-[var(--color-gold)]/30 rounded-2xl p-4">
                  <p className="text-xs uppercase text-[var(--color-gold)] font-bold tracking-wider mb-1">
                    {t.propertyDetail.facilityNotesTitle}
                  </p>
                  <p className="text-sm text-[var(--color-charcoal)]">{localizedListing.facility_notes}</p>
                </div>
              )}
            </div>

            {/* House & Guest Amenities */}
            <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-card)] border border-[var(--color-sand-light)]">
              <h2 className="text-display-sm text-[var(--color-forest)] mb-4">{t.propertyDetail.amenitiesHeading}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.amenities.map((slug) => {
                  const label = getLocalizedAmenityLabel(slug, language);
                  return (
                    <div key={slug} className="flex items-center gap-2.5 text-sm text-[var(--color-charcoal)]">
                      <CheckCircle2 size={16} className="text-[var(--color-gold)] flex-shrink-0" />
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--color-sand-light)] flex flex-wrap gap-6 text-sm text-[var(--color-muted)]">
                <div>
                  {t.propertyDetail.petPolicyLabel} <strong>{listing.pets_allowed ? t.propertyDetail.petsWelcome : t.propertyDetail.noPets}</strong>
                </div>
                <div>
                  {t.propertyDetail.smokingPolicyLabel} <strong>{listing.smoking_allowed ? t.propertyDetail.smokingAllowed : t.propertyDetail.nonSmoking}</strong>
                </div>
                <div>
                  {t.propertyDetail.languagesLabel} <strong>{listing.languages_spoken.join(", ")}</strong>
                </div>
              </div>
            </div>

            {/* Reference Availability Calendar */}
            <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-card)] border border-[var(--color-sand-light)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-display-sm text-[var(--color-forest)]">{t.propertyDetail.availabilityHeading}</h2>
                  <p className="text-xs text-[var(--color-muted)] mt-1">
                    {t.propertyDetail.availabilitySub}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-lg border border-[var(--color-sand)] hover:bg-[var(--color-cream-dark)] transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-serif font-semibold text-sm px-3">{monthName} {year}</span>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-lg border border-[var(--color-sand)] hover:bg-[var(--color-cream-dark)] transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Month Grid */}
              <div className="border border-[var(--color-sand-light)] rounded-2xl p-4">
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-[var(--color-muted)] mb-2">
                  <span>{t.propertyDetail.daysOfWeek.sun}</span>
                  <span>{t.propertyDetail.daysOfWeek.mon}</span>
                  <span>{t.propertyDetail.daysOfWeek.tue}</span>
                  <span>{t.propertyDetail.daysOfWeek.wed}</span>
                  <span>{t.propertyDetail.daysOfWeek.thu}</span>
                  <span>{t.propertyDetail.daysOfWeek.fri}</span>
                  <span>{t.propertyDetail.daysOfWeek.sat}</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {[...Array(firstDayIndex)].map((_, i) => (
                    <div key={`empty-${i}`} className="p-2" />
                  ))}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const isEven = (day + month) % 3 !== 0; // Simulated available slots
                    return (
                      <div
                        key={day}
                        className={`p-2 rounded-lg font-medium transition-colors ${
                          isEven
                            ? "bg-[var(--color-cream)] text-[var(--color-forest)] hover:bg-[var(--color-gold-pale)] cursor-pointer"
                            : "bg-gray-100 text-gray-400 line-through cursor-not-allowed"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-6 mt-4 pt-3 border-t border-[var(--color-sand-light)] text-xs text-[var(--color-muted)]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[var(--color-cream)] border border-[var(--color-sand)]" />
                    <span>{t.propertyDetail.availableLegend}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-100 line-through text-gray-400 flex items-center justify-center text-[10px]">✕</div>
                    <span>{t.propertyDetail.bookedLegend}</span>
                  </div>
                  <span className="ml-auto">
                    {t.propertyDetail.minStayLabel} {listing.minimum_stay} {listing.minimum_stay > 1 ? t.propertyDetail.nightPlural : t.propertyDetail.nightSingular}
                  </span>
                </div>
              </div>
            </div>

            {/* Approximate Location & Privacy */}
            <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-card)] border border-[var(--color-sand-light)]">
              <h2 className="text-display-sm text-[var(--color-forest)] mb-2">{t.propertyDetail.locationHeading}</h2>
              <p className="text-sm text-[var(--color-muted)] mb-6">
                {t.propertyDetail.locationSub.replace("{city}", listing.city)}
              </p>
              <div className="h-72 sm:h-96 rounded-2xl overflow-hidden border border-[var(--color-sand)] relative bg-[#FAF7F2]">
                <MapErrorBoundary>
                  <GoogleMapWrapper
                    mode="property"
                    latitude={Number(listing.latitude) || 29.1872}
                    longitude={Number(listing.longitude) || -82.1401}
                    city={listing.city}
                    className="w-full h-full"
                  />
                </MapErrorBoundary>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Contact Owner & Pricing Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-8 shadow-xl border border-[var(--color-sand-light)] space-y-6">
              {/* Rate Header & Period Selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif font-bold text-3xl text-[var(--color-forest)]">
                      ${getActiveRate()}
                    </span>
                    <span className="text-sm text-[var(--color-muted)]">
                      / {getLocalizedPeriodLabel()}
                    </span>
                  </div>
                </div>

                {/* Period switch buttons if week or month rates are set */}
                {(listing.price_per_week || listing.price_per_month) && (
                  <div className="flex p-1 bg-[var(--color-cream)] rounded-xl text-xs font-semibold mb-2">
                    <button
                      type="button"
                      onClick={() => setPricePeriod("night")}
                      className={`flex-1 py-1.5 rounded-lg transition-colors ${
                        pricePeriod === "night" ? "bg-white shadow-sm text-[var(--color-forest)]" : "text-[var(--color-muted)]"
                      }`}
                    >
                      {t.propertyDetail.night}
                    </button>
                    {listing.price_per_week && (
                      <button
                        type="button"
                        onClick={() => setPricePeriod("week")}
                        className={`flex-1 py-1.5 rounded-lg transition-colors ${
                          pricePeriod === "week" ? "bg-white shadow-sm text-[var(--color-forest)]" : "text-[var(--color-muted)]"
                        }`}
                      >
                        {t.propertyDetail.week}
                      </button>
                    )}
                    {listing.price_per_month && (
                      <button
                        type="button"
                        onClick={() => setPricePeriod("month")}
                        className={`flex-1 py-1.5 rounded-lg transition-colors ${
                          pricePeriod === "month" ? "bg-white shadow-sm text-[var(--color-forest)]" : "text-[var(--color-muted)]"
                        }`}
                      >
                        {t.propertyDetail.month}
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 p-2.5 bg-green-50 rounded-xl text-xs text-green-800 font-medium">
                  <Shield size={14} className="text-green-700 flex-shrink-0" />
                  <span>{t.propertyDetail.directBookingNote}</span>
                </div>
              </div>

              {/* Inquiry Form */}
              {inquirySent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-green-900">{t.propertyDetail.inquirySentTitle}</h3>
                  <p className="text-xs text-green-700 leading-relaxed">
                    {t.propertyDetail.inquirySentSuccess.replace("{name}", listing.contact_name || "")}
                  </p>
                  <Button
                    variant="forest"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setInquirySent(false)}
                  >
                    {t.propertyDetail.sendAnotherMessage}
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-forest)]">
                    {t.propertyDetail.contactHostDirectly}
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-[var(--color-charcoal)] mb-1">{t.propertyDetail.yourName}</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="input-base text-sm py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--color-charcoal)] mb-1">{t.propertyDetail.yourEmail}</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@equestrian.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="input-base text-sm py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-charcoal)] mb-1">{t.propertyDetail.arrival}</label>
                      <input
                        type="date"
                        value={inquiryArrival}
                        onChange={(e) => setInquiryArrival(e.target.value)}
                        className="input-base text-xs py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-charcoal)] mb-1">{t.propertyDetail.departure}</label>
                      <input
                        type="date"
                        value={inquiryDeparture}
                        onChange={(e) => setInquiryDeparture(e.target.value)}
                        className="input-base text-xs py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--color-charcoal)] mb-1">{t.propertyDetail.numberOfHorses}</label>
                    <select
                      value={inquiryHorses}
                      onChange={(e) => setInquiryHorses(Number(e.target.value))}
                      className="input-base text-sm py-2"
                    >
                      {[...Array(listing.horse_capacity || 10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i > 0 ? t.propertyDetail.horsePlural : t.propertyDetail.horseSingle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--color-charcoal)] mb-1">{t.propertyDetail.messageToHost}</label>
                    <textarea
                      required
                      rows={3}
                      placeholder={t.propertyDetail.messagePlaceholder}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="input-base text-sm py-2 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    isLoading={submittingInquiry}
                  >
                    <Send size={16} />
                    {t.propertyDetail.sendInquiryBtn}
                  </Button>
                </form>
              )}

              {/* Host bio snippet */}
              <div className="pt-6 border-t border-[var(--color-sand-light)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-forest)] text-white font-bold flex items-center justify-center">
                    {listing.contact_name?.[0] || "H"}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{t.propertyDetail.hostedBy}</p>
                    <p className="text-sm font-semibold text-[var(--color-forest)]">{listing.contact_name}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-3 text-xs text-[var(--color-muted)]">
                  <span className="flex items-center gap-1"><Mail size={12} /> {t.propertyDetail.directMessageVerified}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      <Modal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        size="xl"
        title={t.propertyDetail.photoGallery}
      >
        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {photos.map((photo, i) => (
            <div
              key={photo.id || i}
              onClick={() => {
                setLightboxIndex(i);
                setGalleryModalOpen(false);
                setLightboxOpen(true);
              }}
              className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
            >
              <Image
                src={photo.url}
                alt={`${localizedListing.title} photo ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-black/75 text-white text-xs px-3.5 py-1.5 rounded-full transition-opacity backdrop-blur-sm flex items-center gap-1.5 shadow-md">
                  <Maximize2 size={13} />
                  Click to view full size
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Fullscreen Photo Lightbox Viewer */}
      <PhotoLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={photos}
        initialIndex={lightboxIndex}
        title={localizedListing.title}
      />
    </div>
  );
}
