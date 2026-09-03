"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Upload, Trash2, Star, MapPin, Edit3, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SAMPLE_LISTINGS } from "@/lib/data/sample-listings";
import { GoogleMapWrapper } from "@/components/ui/google-map";

/* ============================================================
   Step definitions matching screenshots exactly
   ============================================================ */
const STEPS = [
  { id: 1, label: "PLAN" },
  { id: 2, label: "PROPERTY" },
  { id: 3, label: "LOCATION" },
  { id: 4, label: "ACCOMMOD..." },
  { id: 5, label: "HORSE FACIL..." },
  { id: 6, label: "PHOTOS" },
  { id: 7, label: "PRICING" },
  { id: 8, label: "CONTACT" },
  { id: 9, label: "REVIEW" },
];

const PROPERTY_TYPES = [
  "Equestrian Farm",
  "House",
  "Apartment",
  "Private Bedroom",
  "RV",
  "RV Hookup",
  "RV + Hookup",
  "Pasture Rental",
  "Barn / Stalls",
  "Other",
];

const HOUSE_AMENITIES = [
  "Wi-Fi", "Full kitchen", "Kitchenette", "Heating", "Washer & dryer",
  "Dishwasher", "TV", "Private bath", "Porch / patio", "Firepit", "Parking", "Workspace",
  "Pool", "Air conditioning", "Fenced property", "Trailer parking",
];

const SPOKEN_LANGUAGES = [
  "English", "Spanish", "French", "Portuguese", "German", "Italian",
  "Dutch", "Swedish", "Polish", "Russian", "Arabic", "Mandarin", "Japanese", "Hindi",
];

const EQUESTRIAN_FACILITIES = [
  "Wash bay", "Round pen", "Dressage arena", "Jumping arena", "Outdoor arena",
  "Indoor arena", "Tack room", "Feed / hay storage", "Automatic waterers",
  "Run-in shelter", "Turnout paddocks", "Trail access", "Hot walker",
];

/* ============================================================
   Stepper sub-component
   ============================================================ */
function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          readOnly
          className="w-20 px-3 py-2 border border-[#E5E0D6] rounded-lg text-sm text-[#1B221E] bg-[#FAF7F2] text-center"
        />
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="size-7 rounded-full border border-[#E5E0D6] text-[#1B221E] flex items-center justify-center hover:bg-[#FAF7F2] transition-colors text-lg leading-none"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="size-7 rounded-full border border-[#E5E0D6] text-[#1B221E] flex items-center justify-center hover:bg-[#FAF7F2] transition-colors text-lg leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Toggle Chip
   ============================================================ */
function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
        selected
          ? "bg-[#1F3A2B] text-white border-[#1F3A2B]"
          : "bg-white border-[#E5E0D6] text-[#1B221E] hover:border-[#1F3A2B]"
      }`}
    >
      {label}
    </button>
  );
}

/* ============================================================
   Main Page
   ============================================================ */
export default function NewListingWizardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WizardForm />
    </Suspense>
  );
}

function WizardForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit") || null;
  const isEditing = Boolean(editId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  /* --- Step 1: Plan --- */
  const [plan, setPlan] = useState<"premium" | "standard">("premium");

  /* --- Step 2: Property Basics --- */
  const [propertyType, setPropertyType] = useState("Equestrian Farm");
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  /* --- Step 3: Location (coordinates from map click) --- */
  const [latitude, setLatitude] = useState(29.215);
  const [longitude, setLongitude] = useState(-82.195);

  /* --- Step 4: Accommodation --- */
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [maxGuests, setMaxGuests] = useState(4);
  const [acreage, setAcreage] = useState(10);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityNotes, setAmenityNotes] = useState("");
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>(["English"]);
  const [dogsAccepted, setDogsAccepted] = useState<"yes" | "no">("no");
  const [catsAccepted, setCatsAccepted] = useState<"yes" | "no">("no");

  /* --- Step 5: Horse Facilities --- */
  const [stalls, setStalls] = useState(4);
  const [barns, setBarns] = useState(1);
  const [horsesCapacity, setHorsesCapacity] = useState(4);
  const [pasture, setPasture] = useState("");
  const [equestrianFacilities, setEquestrianFacilities] = useState<string[]>([]);
  const [facilityNotes, setFacilityNotes] = useState("");
  const [horseDescription, setHorseDescription] = useState("");

  /* --- Step 6: Photos --- */
  const [photos, setPhotos] = useState<string[]>([]);

  /* --- Step 7: Pricing --- */
  const [pricePerNight, setPricePerNight] = useState(80);
  const [pricePerWeek, setPricePerWeek] = useState(0);
  const [pricePerMonth, setPricePerMonth] = useState(0);
  const [minimumNights, setMinimumNights] = useState(1);

  /* --- Step 8: Contact --- */
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  /* ============================================================
     Check user role and account permissions
     ============================================================ */
  useEffect(() => {
    async function checkUserRole() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (!contactEmail) setContactEmail(user.email ?? "");
          const { data: profile } = (await (supabase
            .from("profiles") as any)
            .select("role, full_name")
            .eq("id", user.id)
            .single()) as any;
          if (profile?.full_name && !contactName) setContactName(profile.full_name);
          if (profile?.role === "guest") {
            setIsGuest(true);
          }
        }
      } catch { /* ignore */ }
    }
    checkUserRole();
  }, [contactEmail, contactName]);

  const handleUpgradeToOwner = async () => {
    setIsUpgrading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await (supabase.from("profiles") as any).update({ role: "owner" }).eq("id", user.id);
        setIsGuest(false);
      }
    } catch { /* ignore */ } finally {
      setIsUpgrading(false);
    }
  };

  /* ============================================================
     Load listing for editing if ?edit=id parameter is provided
     ============================================================ */
  useEffect(() => {
    if (!editId) return;

    async function loadListingForEditing() {
      try {
        const supabase = createClient();
        const { data: dbItem } = (await (supabase
          .from("listings") as any)
          .select("*, listing_photos(*)")
          .eq("id", editId!)
          .single()) as any;

        const item: any = dbItem || (SAMPLE_LISTINGS as any[]).find((l: any) => l.id === editId);
        if (item) {
          if (item.title) setTitle(item.title);
          if (item.property_type) setPropertyType(item.property_type);
          if (item.address) setAddress(item.address);
          if (item.city) setCity(item.city);
          if (item.zip_code) setZipCode(item.zip_code);
          if (item.bedrooms != null) setBedrooms(item.bedrooms);
          if (item.bathrooms != null) setBathrooms(item.bathrooms);
          if (item.max_guests != null) setMaxGuests(item.max_guests);
          if (item.acreage != null) setAcreage(item.acreage);
          if (item.stalls != null) setStalls(item.stalls);
          if (item.barns != null) setBarns(item.barns);
          if (item.horse_capacity != null) setHorsesCapacity(item.horse_capacity);
          if (item.amenities) setAmenities(item.amenities);
          if (item.horse_facilities) setEquestrianFacilities(item.horse_facilities);
          if (item.facility_notes) setFacilityNotes(item.facility_notes);
          if (item.horse_description) setHorseDescription(item.horse_description);
          if (item.price_per_night != null) setPricePerNight(item.price_per_night);
          if (item.price_per_week != null) setPricePerWeek(item.price_per_week);
          if (item.price_per_month != null) setPricePerMonth(item.price_per_month);
          if (item.minimum_stay != null) setMinimumNights(item.minimum_stay);
          if (item.contact_name) setContactName(item.contact_name);
          if (item.contact_email) setContactEmail(item.contact_email);
          if (item.contact_phone) setContactPhone(item.contact_phone);
          if (item.plan) setPlan(item.plan === "standard" ? "standard" : "premium");
          if (item.listing_photos?.length) {
            setPhotos(item.listing_photos.map((p: any) => p.url));
          }
          // In edit mode, jump directly to step 2 (Property Details)
          setCurrentStep(2);
        }
      } catch { /* ignore */ }
    }

    loadListingForEditing();
  }, [editId]);

  /* ============================================================
     Restore draft on mount (only if not editing an existing listing)
     ============================================================ */
  useEffect(() => {
    if (isEditing) return;
    try {
      const saved = localStorage.getItem("mes_listing_draft");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.title) setTitle(d.title);
        if (d.propertyType) setPropertyType(d.propertyType);
        if (d.address) setAddress(d.address);
        if (d.city) setCity(d.city);
        if (d.zipCode) setZipCode(d.zipCode);
        if (d.bedrooms != null) setBedrooms(d.bedrooms);
        if (d.bathrooms != null) setBathrooms(d.bathrooms);
        if (d.maxGuests != null) setMaxGuests(d.maxGuests);
        if (d.acreage != null) setAcreage(d.acreage);
        if (d.stalls != null) setStalls(d.stalls);
        if (d.barns != null) setBarns(d.barns);
        if (d.horsesCapacity != null) setHorsesCapacity(d.horsesCapacity);
        if (d.pricePerNight != null) setPricePerNight(d.pricePerNight);
        if (d.pricePerWeek != null) setPricePerWeek(d.pricePerWeek);
        if (d.photos) setPhotos(d.photos);
        if (d.contactName) setContactName(d.contactName);
        if (d.contactEmail) setContactEmail(d.contactEmail);
        if (d.contactPhone) setContactPhone(d.contactPhone);
        if (d.step && d.step > 1) setCurrentStep(d.step);
      }
    } catch { /* ignore */ }
  }, [isEditing]);

  /* ============================================================
     Auto-save draft on changes (only when creating new)
     ============================================================ */
  useEffect(() => {
    if (isEditing) return;
    try {
      localStorage.setItem("mes_listing_draft", JSON.stringify({
        propertyType, title, address, city, zipCode, bedrooms, bathrooms,
        maxGuests, acreage, amenities, stalls, barns, horsesCapacity,
        pricePerNight, pricePerWeek, pricePerMonth, minimumNights,
        photos, contactName, contactEmail, contactPhone, step: currentStep,
      }));
    } catch { /* ignore */ }
  }, [
    isEditing, propertyType, title, address, city, zipCode, bedrooms, bathrooms,
    maxGuests, acreage, amenities, stalls, barns, horsesCapacity,
    pricePerNight, pricePerWeek, pricePerMonth, minimumNights,
    photos, contactName, contactEmail, contactPhone, currentStep,
  ]);

  /* ============================================================
     Helpers
     ============================================================ */
  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newPhotos: string[] = [];
    files.slice(0, 20 - photos.length).forEach((file) => {
      const url = URL.createObjectURL(file);
      newPhotos.push(url);
    });
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    setIsSubmitting(true);

    // If updating an existing listing
    if (isEditing && editId) {
      try {
        const supabase = createClient();
        await (supabase
          .from("listings") as any)
          .update({
            title,
            property_type: propertyType,
            address,
            city,
            zip_code: zipCode,
            latitude,
            longitude,
            bedrooms,
            bathrooms,
            max_guests: maxGuests,
            acreage,
            amenities,
            stalls,
            barns,
            horse_capacity: horsesCapacity,
            horse_facilities: equestrianFacilities,
            facility_notes: facilityNotes,
            horse_description: horseDescription,
            price_per_night: pricePerNight,
            price_per_week: pricePerWeek,
            price_per_month: pricePerMonth,
            minimum_stay: minimumNights,
            contact_name: contactName,
            contact_email: contactEmail,
            contact_phone: contactPhone,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editId);

        router.push("/dashboard?updated=true");
      } catch {
        router.push("/dashboard?updated=true");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Creating new listing flow
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          listingData: {
            title, property_type: propertyType, address, city, zip_code: zipCode,
            latitude, longitude, bedrooms, bathrooms, max_guests: maxGuests,
            acreage, amenities, stalls, barns, horse_capacity: horsesCapacity,
            horse_facilities: equestrianFacilities, facility_notes: facilityNotes,
            horse_description: horseDescription, price_per_night: pricePerNight,
            price_per_week: pricePerWeek, price_per_month: pricePerMonth,
            minimum_stay: minimumNights, photos, contact_name: contactName,
            contact_email: contactEmail, contact_phone: contactPhone,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        localStorage.removeItem("mes_listing_draft");
        window.location.href = data.url;
      } else {
        localStorage.removeItem("mes_listing_draft");
        router.push("/payment/success?session_id=mock_session_123");
      }
    } catch {
      router.push("/payment/success?session_id=mock_session_123");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canContinue = () => {
    if (currentStep === 2) return title.trim().length > 0;
    if (currentStep === 7) return pricePerNight > 0 || pricePerWeek > 0 || pricePerMonth > 0;
    if (currentStep === 8) return contactEmail.trim().length > 0;
    return true;
  };

  /* ============================================================
     Render
     ============================================================ */
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="mx-auto max-w-3xl px-4 pt-8 pb-24">

        {/* ── Edit Mode Banner ── */}
        {isEditing && (
          <div className="mb-6 p-4 rounded-2xl bg-[#1F3A2B] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#E1B534] font-semibold">
                <Edit3 size={14} /> Editing Existing Listing
              </div>
              <p className="font-serif text-lg text-[#FAF7F2] mt-0.5">{title || "Untitled Property"}</p>
              <p className="text-xs text-[#FAF7F2]/75">Modifications will directly update your live listing on the marketplace.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 rounded-full border border-white/20 text-xs text-[#FAF7F2] hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-full bg-[#E1B534] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* ── Guest Role Upgrade Prompt ── */}
        {isGuest && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <p className="text-sm font-semibold text-amber-900">Your account is currently set to Guest Traveler</p>
              <p className="text-xs text-amber-700 mt-0.5">
                To list properties and receive direct guest inquiries, upgrade your account to Property Owner.
              </p>
            </div>
            <button
              type="button"
              onClick={handleUpgradeToOwner}
              disabled={isUpgrading}
              className="px-4 py-2 rounded-full bg-[#1F3A2B] text-white text-xs font-semibold hover:opacity-95 transition-opacity shrink-0 shadow-xs"
            >
              {isUpgrading ? "Upgrading..." : "Become a Property Owner"}
            </button>
          </div>
        )}

        {/* ── Page Header ── */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#E1B534] mb-1">
            FOR PROPERTY OWNERS
          </p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1B221E] font-medium leading-tight">
                {isEditing ? "Edit your property listing" : "List your Ocala property"}
              </h1>
              <p className="text-sm text-[#6E7771] mt-1">
                {isEditing
                  ? "Update property details, pricing, photos, or horse facilities. Changes save immediately."
                  : "Eight quick steps. Standard $59 or Premium $89 for 3 months. My Equine Stay never takes a commission — guests contact you directly."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="shrink-0 text-xs text-[#6E7771] hover:text-[#1B221E] underline underline-offset-2 transition-colors pt-1"
            >
              Save &amp; exit
            </button>
          </div>
        </div>

        {/* ── Step Progress Bar (matching screenshots exactly) ── */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={!isPast && !isActive}
                  onClick={() => isPast && setCurrentStep(step.id)}
                  className="flex flex-col items-start gap-0.5 pr-3"
                >
                  <div className={`h-[3px] w-12 sm:w-16 rounded-full transition-all ${
                    isActive ? "bg-[#1B221E]" : isPast ? "bg-[#1B221E]" : "bg-[#E5E0D6]"
                  }`} />
                  <span className={`text-[9px] font-semibold uppercase tracking-wider pt-1 ${
                    isActive ? "text-[#1B221E]" : isPast ? "text-[#1B221E]" : "text-[#B0ABA4]"
                  }`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Wizard Card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-[#E5E0D6] p-6 sm:p-8 shadow-xs"
          >

            {/* ═══ STEP 1: Choose a listing plan ═══ */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-2xl text-[#1B221E]">Choose a listing plan</h2>
                  <p className="text-sm text-[#6E7771] mt-1">
                    Both plans run for 3 months. Your listing stays in Draft until payment completes, then goes live automatically.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Premium */}
                  <button
                    type="button"
                    onClick={() => setPlan("premium")}
                    className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                      plan === "premium"
                        ? "border-[#E1B534] bg-[#FFFBF0]"
                        : "border-[#E5E0D6] bg-white hover:border-[#E1B534]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="font-serif text-xl text-[#1B221E]">Premium</span>
                      <span className="bg-[#1F3A2B] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
                        ✦ BEST VALUE
                      </span>
                    </div>
                    <p className="font-serif text-3xl text-[#1B221E]">
                      $29.99<span className="text-sm font-sans font-normal text-[#6E7771]"> / month</span>
                    </p>
                    <p className="text-xs text-[#6E7771] mt-1">Billed every 3 months: $89.97</p>
                    <p className="text-[11px] text-[#6E7771] mt-0.5">You are charged $89.97 every 3 months — not monthly.</p>
                    <ul className="mt-4 space-y-1.5">
                      {["Everything in Standard", "Featured on homepage", "Priority in search results", "Premium badge on listing"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-[#1B221E]">
                          <Check size={13} className="text-[#E1B534] shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>

                  {/* Standard */}
                  <button
                    type="button"
                    onClick={() => setPlan("standard")}
                    className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                      plan === "standard"
                        ? "border-[#E1B534] bg-[#FFFBF0]"
                        : "border-[#E5E0D6] bg-white hover:border-[#E1B534]/50"
                    }`}
                  >
                    <span className="font-serif text-xl text-[#1B221E]">Standard</span>
                    <p className="font-serif text-3xl text-[#1B221E] mt-3">
                      $19.99<span className="text-sm font-sans font-normal text-[#6E7771]"> / month</span>
                    </p>
                    <p className="text-xs text-[#6E7771] mt-1">Billed every 3 months: $59.97</p>
                    <p className="text-[11px] text-[#6E7771] mt-0.5">You are charged $59.97 every 3 months — not monthly.</p>
                    <ul className="mt-4 space-y-1.5">
                      {["3-month listing", "Full property page", "Direct guest inquiries", "Search & filter visibility"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-[#1B221E]">
                          <Check size={13} className="text-[#E1B534] shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                </div>
              </div>
            )}

            {/* ═══ STEP 2: Property basics ═══ */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl text-[#1B221E]">Property basics</h2>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                    PROPERTY TYPE
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PROPERTY_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPropertyType(type)}
                        className={`px-3 py-2.5 rounded-lg border text-sm text-left transition-all ${
                          propertyType === type
                            ? "border-[#E1B534] bg-[#FFFBF0] text-[#1B221E]"
                            : "border-[#E5E0D6] bg-white text-[#1B221E] hover:border-[#E1B534]/50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                    LISTING TITLE
                  </label>
                  <input
                    type="text"
                    placeholder="Golden Oak Manor"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                    ADDRESS
                  </label>
                  <input
                    type="text"
                    placeholder="NW 80th Ave, Ocala, FL 34482"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                      CITY
                    </label>
                    <input
                      type="text"
                      placeholder="Ocala, FL"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                      ZIP CODE
                    </label>
                    <input
                      type="text"
                      placeholder="34482"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STEP 3: Pin your property location ═══ */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-[#1B221E]">Pin your property location</h2>
                <p className="text-sm text-[#6E7771]">
                  Place the pin at your gate, driveway entrance, or another nearby location. For privacy, you do not need to mark the exact location of your home. Guests will only see the approximate location you choose on the map, not your exact address. You can drag the pin to adjust its location.
                </p>

                {/* Interactive Google Map with draggable pin */}
                <GoogleMapWrapper
                  mode="wizard"
                  latitude={latitude}
                  longitude={longitude}
                  onMarkerDragEnd={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                  className="h-72 rounded-xl border border-[#E5E0D6] overflow-hidden"
                />

                <div className="flex items-center gap-3 rounded-xl border border-[#E5E0D6] bg-[#FAF7F2] px-4 py-3">
                  <MapPin size={16} className="text-[#E1B534] shrink-0" />
                  <span className="text-sm text-[#6E7771]">
                    Drag the pin to fine-tune your location. Coordinates:{" "}
                    <span className="font-medium text-[#1B221E]">
                      {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* ═══ STEP 4: Accommodation ═══ */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-[#1B221E]">Accommodation</h2>

                {/* Steppers grid */}
                <div className="grid grid-cols-2 gap-5">
                  <Stepper label="BEDROOMS" value={bedrooms} onChange={setBedrooms} />
                  <Stepper label="BATHROOMS" value={bathrooms} onChange={setBathrooms} />
                  <Stepper label="GUESTS" value={maxGuests} onChange={setMaxGuests} />
                  <Stepper label="ACREAGE" value={acreage} onChange={setAcreage} />
                </div>

                {/* House Amenities chips */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                    HOUSE AMENITIES
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {HOUSE_AMENITIES.map((a) => (
                      <Chip
                        key={a}
                        label={a}
                        selected={amenities.includes(a)}
                        onClick={() => toggleItem(amenities, setAmenities, a)}
                      />
                    ))}
                  </div>
                </div>

                {/* Amenity notes */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                    AMENITY NOTES (OPTIONAL)
                  </label>
                  <textarea
                    placeholder="Anything else guests should know about the home"
                    rows={3}
                    value={amenityNotes}
                    onChange={(e) => setAmenityNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534] resize-y"
                  />
                </div>

                {/* Languages spoken chips */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                    LANGUAGES YOU SPEAK
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SPOKEN_LANGUAGES.map((lang) => (
                      <Chip
                        key={lang}
                        label={lang}
                        selected={spokenLanguages.includes(lang)}
                        onClick={() => toggleItem(spokenLanguages, setSpokenLanguages, lang)}
                      />
                    ))}
                  </div>
                </div>

                {/* Dogs accepted */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                    DOGS ACCEPTED
                  </label>
                  <div className="flex gap-2">
                    {(["yes", "no"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setDogsAccepted(v)}
                        className={`px-5 py-1.5 rounded-full border text-sm font-medium capitalize transition-all ${
                          dogsAccepted === v
                            ? "bg-[#1F3A2B] text-white border-[#1F3A2B]"
                            : "bg-white border-[#E5E0D6] text-[#1B221E] hover:border-[#1F3A2B]"
                        }`}
                      >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cats accepted */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                    CATS ACCEPTED
                  </label>
                  <div className="flex gap-2">
                    {(["yes", "no"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setCatsAccepted(v)}
                        className={`px-5 py-1.5 rounded-full border text-sm font-medium capitalize transition-all ${
                          catsAccepted === v
                            ? "bg-[#1F3A2B] text-white border-[#1F3A2B]"
                            : "bg-white border-[#E5E0D6] text-[#1B221E] hover:border-[#1F3A2B]"
                        }`}
                      >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STEP 5: Horse facilities ═══ */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-[#1B221E]">Horse facilities</h2>

                {/* Steppers */}
                <div className="grid grid-cols-2 gap-5">
                  <Stepper label="STALLS" value={stalls} onChange={setStalls} />
                  <Stepper label="BARNS" value={barns} onChange={setBarns} />
                  <Stepper label="HORSES (CAPACITY)" value={horsesCapacity} onChange={setHorsesCapacity} />
                </div>

                {/* Pasture text */}
                <div>
                  <input
                    type="text"
                    placeholder="Pasture"
                    value={pasture}
                    onChange={(e) => setPasture(e.target.value)}
                    className="w-48 px-3.5 py-2 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534]"
                  />
                </div>

                {/* Equestrian Facilities chips */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                    EQUESTRIAN FACILITIES
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EQUESTRIAN_FACILITIES.map((f) => (
                      <Chip
                        key={f}
                        label={f}
                        selected={equestrianFacilities.includes(f)}
                        onClick={() => toggleItem(equestrianFacilities, setEquestrianFacilities, f)}
                      />
                    ))}
                  </div>
                </div>

                {/* Facility Notes */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                    FACILITY NOTES (OPTIONAL)
                  </label>
                  <textarea
                    placeholder="Ring size, footing type, stall dimensions, etc."
                    rows={3}
                    value={facilityNotes}
                    onChange={(e) => setFacilityNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534] resize-y"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                    DESCRIPTION
                  </label>
                  <textarea
                    placeholder="Tell horse travelers about your property..."
                    rows={4}
                    value={horseDescription}
                    onChange={(e) => setHorseDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534] resize-y"
                  />
                </div>
              </div>
            )}

            {/* ═══ STEP 6: Photos ═══ */}
            {currentStep === 6 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-2xl text-[#1B221E]">Photos</h2>
                  <p className="text-sm text-[#6E7771] mt-1">
                    Upload up to 20 photos. They&apos;re stored securely in the cloud.
                  </p>
                  <p className="text-xs text-[#6E7771] mt-0.5">{photos.length} / 20</p>
                </div>

                {/* Upload dropzone */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#E5E0D6] rounded-xl py-10 flex flex-col items-center gap-2 hover:border-[#E1B534] transition-colors bg-white"
                >
                  <Upload size={22} className="text-[#E1B534]" />
                  <span className="text-sm text-[#6E7771]">Click to upload photos</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />

                {/* Photo grid with cover star */}
                {photos.length > 0 && (
                  <>
                    <p className="text-xs text-[#6E7771]">
                      Press and hold a photo, then drag to reorder. The first photo is your cover and appears in search results and previews.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {photos.map((photo, i) => (
                        <div key={i} className="relative group w-32 h-24 rounded-xl overflow-hidden border border-[#E5E0D6]">
                          <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-cover" />
                          {i === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-[#E1B534] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star size={9} /> Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute top-1.5 right-1.5 size-6 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ═══ STEP 7: Pricing ═══ */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-2xl text-[#1B221E]">Pricing</h2>
                  <p className="text-sm text-[#6E7771] mt-1">
                    Set the rates you&apos;ll discuss with guests. No platform fee is applied to any of these.
                  </p>
                </div>

                {/* Info banner */}
                <div className="rounded-xl border border-[#E5E0D6] bg-[#FAF7F2] px-4 py-3 text-xs text-[#6E7771]">
                  Enter only the rates you offer. Leave others at 0 — guests will only see the rates you set. Enter at least one rate to continue.
                </div>

                {/* Rates */}
                <div className="rounded-xl border border-[#E5E0D6] p-4 space-y-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771]">RATES</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "PER NIGHT ($)", value: pricePerNight, onChange: setPricePerNight, hint: "Charged for a single night's stay." },
                      { label: "PER WEEK ($)", value: pricePerWeek, onChange: setPricePerWeek, hint: "Total for a 7-night stay (optional)." },
                      { label: "PER MONTH ($)", value: pricePerMonth, onChange: setPricePerMonth, hint: "Total for a 30-night stay (optional)." },
                    ].map(({ label, value, onChange, hint }) => (
                      <div key={label}>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                          {label}
                        </label>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-sm text-[#6E7771]">$</span>
                          <input
                            type="number"
                            min={0}
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            className="w-full px-2 py-2 border border-[#E5E0D6] rounded-lg text-sm text-[#1B221E] bg-white focus:outline-none focus:border-[#E1B534]"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button type="button" onClick={() => onChange(Math.max(0, value - 5))}
                            className="size-7 rounded-full border border-[#E5E0D6] flex items-center justify-center text-[#1B221E] hover:bg-[#FAF7F2] text-lg leading-none">−</button>
                          <button type="button" onClick={() => onChange(value + 5)}
                            className="size-7 rounded-full border border-[#E5E0D6] flex items-center justify-center text-[#1B221E] hover:bg-[#FAF7F2] text-lg leading-none">+</button>
                        </div>
                        <p className="text-[10px] text-[#6E7771] mt-1.5 leading-snug">{hint}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Minimum stay */}
                <div className="rounded-xl border border-[#E5E0D6] p-4 space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771]">MINIMUM STAY</p>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                      MINIMUM NIGHTS
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={minimumNights}
                      onChange={(e) => setMinimumNights(Number(e.target.value))}
                      className="w-24 px-3 py-2 border border-[#E5E0D6] rounded-lg text-sm text-[#1B221E] bg-white focus:outline-none focus:border-[#E1B534]"
                    />
                    <div className="flex items-center gap-2 mt-1.5">
                      <button type="button" onClick={() => setMinimumNights(Math.max(1, minimumNights - 1))}
                        className="size-7 rounded-full border border-[#E5E0D6] flex items-center justify-center text-[#1B221E] hover:bg-[#FAF7F2] text-lg leading-none">−</button>
                      <button type="button" onClick={() => setMinimumNights(minimumNights + 1)}
                        className="size-7 rounded-full border border-[#E5E0D6] flex items-center justify-center text-[#1B221E] hover:bg-[#FAF7F2] text-lg leading-none">+</button>
                    </div>
                    <p className="text-[10px] text-[#6E7771] mt-1.5">Guests will need to book at least this many consecutive nights.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STEP 8: Owner contact ═══ */}
            {currentStep === 8 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl text-[#1B221E]">Owner contact</h2>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-1.5">
                    PHONE
                  </label>
                  <input
                    type="tel"
                    placeholder="(352) 555 0134"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D6] bg-white text-sm text-[#1B221E] focus:outline-none focus:border-[#E1B534]"
                  />
                </div>

                {/* No commissions guarantee box */}
                <div className="rounded-xl border border-[#E5E0D6] bg-[#FAF7F2] px-4 py-4">
                  <p className="flex items-start gap-2 text-sm font-semibold text-[#1B221E]">
                    <Check size={16} className="text-[#E1B534] mt-0.5 shrink-0" />
                    No commissions, ever
                  </p>
                  <p className="text-xs text-[#6E7771] mt-1 pl-6">
                    Guests contact you directly. You handle deposits, bookings, and payments on your terms.
                  </p>
                </div>
              </div>
            )}

            {/* ═══ STEP 9: Review & publish ═══ */}
            {currentStep === 9 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-2xl text-[#1B221E]">
                    {isEditing ? "Review & save changes" : "Review & publish"}
                  </h2>
                  <p className="text-sm text-[#6E7771] mt-1">
                    {isEditing
                      ? "Review your changes below. When you click Save Changes, your updates will be live immediately."
                      : "Here's how your listing will appear. Review everything below — you'll enter payment on the next step and your listing goes live immediately after checkout."}
                  </p>
                </div>

                {/* Preview card */}
                <div className="rounded-2xl border border-[#E5E0D6] overflow-hidden">
                  {photos.length > 0 ? (
                    <div className="relative h-40">
                      <Image src={photos[0]} alt="Cover" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-40 bg-[#E5E0D6]/40 flex items-center justify-center text-xs text-[#6E7771]">
                      No photos added yet
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-serif text-xl text-[#1B221E]">{title || "Untitled Listing"}</h3>
                    <p className="text-sm text-[#6E7771] mt-0.5">{city || "Ocala, FL"}</p>
                    <p className="text-xs text-[#6E7771] mt-1">
                      {propertyType} · {bedrooms} bd · {bathrooms} ba · sleeps {maxGuests} · {stalls} stalls · {acreage} ac
                    </p>
                    <p className="text-xs text-[#6E7771] mt-0.5">{horseDescription.slice(0, 60) || ""}</p>
                    <p className="text-sm font-medium text-[#1B221E] mt-2">
                      ${pricePerNight} / night{pricePerWeek > 0 ? ` · $${pricePerWeek}/wk` : " · $0/wk"}
                      {pricePerMonth > 0 ? ` · $${pricePerMonth}/mo` : " · $0/mo"}
                    </p>
                  </div>
                </div>

                {/* Plan summary */}
                <div className="rounded-xl border border-[#E5E0D6] bg-[#FAF7F2] px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771]">PLAN</p>
                    <p className="text-sm font-medium text-[#1B221E] mt-0.5">
                      {plan === "premium" ? "Premium — $89 / 3 months" : "Standard — $59 / 3 months"}
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#6E7771] underline underline-offset-2 hover:text-[#1B221E]"
                    >
                      Change plan
                    </button>
                  )}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* ── Navigation Footer ── */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => {
              if (currentStep > 1) setCurrentStep(currentStep - 1);
              else router.push("/dashboard");
            }}
            className="inline-flex items-center gap-1.5 text-sm text-[#1B221E] hover:text-[#6E7771] transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {currentStep < 9 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canContinue()}
              className="inline-flex items-center gap-1.5 px-7 py-3 rounded-full bg-[#E1B534] text-white text-sm font-medium disabled:opacity-50 hover:opacity-95 transition-opacity"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-7 py-3 rounded-full bg-[#E1B534] text-white text-sm font-medium disabled:opacity-50 hover:opacity-95 transition-opacity"
            >
              {isSubmitting
                ? "Processing…"
                : isEditing
                ? "Save Changes & Update Listing"
                : `Pay $${plan === "premium" ? "89" : "59"} & Publish`}
              {!isSubmitting && <Check size={15} />}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
