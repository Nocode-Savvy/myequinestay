"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Eye,
  Trash2,
  Edit3,
  Mail,
  AlertTriangle,
  User,
  Check,
  PauseCircle,
  PlayCircle,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Heart,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/context";

interface ListingItem {
  id: string;
  title: string;
  category: string;
  city: string;
  price_per_night: number;
  status: "active" | "draft" | "paused";
  image?: string;
  stalls?: number;
  bedrooms?: number;
  created_at?: string;
}

interface InquiryItem {
  id: string;
  guest_name: string;
  guest_email: string;
  listing_title: string;
  arrival_date: string;
  departure_date: string;
  horse_count: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface FavoriteItem {
  id: string;
  title: string;
  category: string;
  city: string;
  price_per_night: number;
  status: "active" | "draft" | "paused";
  image?: string;
  stalls?: number;
  bedrooms?: number;
}

interface SentInquiryItem {
  id: string;
  property_title: string;
  listing_id: string;
  owner_email: string;
  arrival_date: string;
  departure_date: string;
  horse_count: number;
  message: string;
  created_at: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorized = searchParams.get("unauthorized");
  const supabase = createClient();
  const { t } = useLanguage();

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [rawRole, setRawRole] = useState<"admin" | "owner" | "guest">("guest");
  const [userRole, setUserRole] = useState("Guest Traveler");
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Tab state for owners
  const [ownerTab, setOwnerTab] = useState<"listings" | "inquiries" | "settings">("listings");
  const [listingFilter, setListingFilter] = useState<"all" | "active" | "draft">("all");

  // Tab state for guests
  const [guestTab, setGuestTab] = useState<"favorites" | "sent_inquiries" | "settings">("favorites");

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [receivedInquiries, setReceivedInquiries] = useState<InquiryItem[]>([]);
  const [savedStays, setSavedStays] = useState<FavoriteItem[]>([]);
  const [sentInquiries, setSentInquiries] = useState<SentInquiryItem[]>([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  /* ============================================================
     Load User Profile & Role from Supabase
     ============================================================ */
  useEffect(() => {
    async function loadUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfileLoaded(true);
        return;
      }

      setUserEmail(user.email ?? "");
      const { data: profile } = (await (supabase
        .from("profiles") as any)
        .select("*")
        .eq("id", user.id)
        .single()) as any;

      const role = ((profile?.role as string) || "guest").toLowerCase() as "admin" | "owner" | "guest";
      setRawRole(role);

      if (role === "admin") {
        setUserRole("Platform Administrator");
      } else if (role === "owner") {
        setUserRole("Property Owner");
      } else {
        setUserRole("Guest Traveler");
      }

      if (profile?.full_name) {
        setUserName(profile.full_name.split(" ")[0]);
      } else if (user.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(" ")[0]);
      } else {
        setUserName(user.email?.split("@")[0] ?? "User");
      }

      // Load data based on role
      if (role === "owner" || role === "admin") {
        // Load real listings from DB
        const { data: dbListings } = (await (supabase
          .from("listings") as any)
          .select("*, listing_photos(*)")
          .eq("owner_id", user.id)) as any;

        // Check for a locally saved draft
        const draftListings: ListingItem[] = [];
        try {
          const savedDraft = localStorage.getItem("mes_listing_draft");
          if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            if (parsed.title) {
              draftListings.push({
                id: parsed.id || "draft-local",
                title: parsed.title || "Untitled Equestrian Property (Draft)",
                category: parsed.property_type || "Equestrian Farm",
                city: parsed.city || "",
                price_per_night: parsed.price_per_night || 0,
                status: "draft",
                image: parsed.photos?.[0] || undefined,
                stalls: parsed.stalls || 0,
                bedrooms: parsed.bedrooms || 0,
                created_at: "Draft",
              });
            }
          }
        } catch {
          // ignore
        }

        if (dbListings && dbListings.length > 0) {
          const mapped: ListingItem[] = dbListings.map((l: any) => ({
            id: l.id,
            title: l.title,
            category: l.property_type || "Equestrian Farm",
            city: l.city || "",
            price_per_night: l.price_per_night || 0,
            status: l.status === "active" ? "active" : l.status === "paused" ? "paused" : "draft",
            image: l.listing_photos?.[0]?.url || undefined,
            stalls: l.stalls || 0,
            bedrooms: l.bedrooms || 0,
            created_at: new Date(l.created_at).toLocaleDateString(),
          }));
          setListings([...draftListings, ...mapped]);
        } else {
          // No listings yet — show only local draft if any, otherwise empty
          setListings(draftListings);
        }

        // Load real received inquiries
        const { data: dbInquiries } = (await (supabase
          .from("inquiries") as any)
          .select("*, listings(title)")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })) as any;

        if (dbInquiries && dbInquiries.length > 0) {
          const mappedInquiries: InquiryItem[] = dbInquiries.map((inq: any) => ({
            id: inq.id,
            guest_name: inq.guest_name,
            guest_email: inq.guest_email,
            listing_title: inq.listings?.title || "Your listing",
            arrival_date: inq.arrival_date || "",
            departure_date: inq.departure_date || "",
            horse_count: inq.horse_count || 0,
            message: inq.message,
            is_read: inq.is_read,
            created_at: new Date(inq.created_at).toLocaleDateString(),
          }));
          setReceivedInquiries(mappedInquiries);
        } else {
          setReceivedInquiries([]);
        }
      }

      if (role === "guest") {
        // Load real favorites
        const { data: dbFavorites } = (await (supabase
          .from("favorites") as any)
          .select("*, listings(*, listing_photos(*))")
          .eq("user_id", user.id)) as any;

        if (dbFavorites && dbFavorites.length > 0) {
          const mappedFavorites: FavoriteItem[] = dbFavorites.map((fav: any) => ({
            id: fav.listings?.id || fav.listing_id,
            title: fav.listings?.title || "Unknown Property",
            category: fav.listings?.property_type || "Equestrian Farm",
            city: fav.listings?.city || "",
            price_per_night: fav.listings?.price_per_night || 0,
            status: "active",
            image: fav.listings?.listing_photos?.[0]?.url || undefined,
            stalls: fav.listings?.stalls || 0,
            bedrooms: fav.listings?.bedrooms || 0,
          }));
          setSavedStays(mappedFavorites);
        } else {
          setSavedStays([]);
        }

        // Load real sent inquiries
        const { data: dbSentInquiries } = (await (supabase
          .from("inquiries") as any)
          .select("*, listings(title, contact_email)")
          .eq("guest_email", user.email)
          .order("created_at", { ascending: false })) as any;

        if (dbSentInquiries && dbSentInquiries.length > 0) {
          const mappedSent: SentInquiryItem[] = dbSentInquiries.map((inq: any) => ({
            id: inq.id,
            property_title: inq.listings?.title || "Unknown Property",
            listing_id: inq.listing_id,
            owner_email: inq.listings?.contact_email || "",
            arrival_date: inq.arrival_date || "",
            departure_date: inq.departure_date || "",
            horse_count: inq.horse_count || 0,
            message: inq.message,
            created_at: new Date(inq.created_at).toLocaleDateString(),
          }));
          setSentInquiries(mappedSent);
        } else {
          setSentInquiries([]);
        }
      }

      setProfileLoaded(true);
    }

    loadUserData();
  }, [supabase]);

  /* ============================================================
     Upgrade Guest Role to Owner
     ============================================================ */
  const handleUpgradeToOwner = async () => {
    setIsUpgrading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await (supabase.from("profiles") as any).update({ role: "owner" }).eq("id", user.id);
        setRawRole("owner");
        setUserRole("Property Owner");
        // Start with an empty listings array — user has no listings yet
        setListings([]);
        setReceivedInquiries([]);
      }
    } catch {
      // ignore
    } finally {
      setIsUpgrading(false);
    }
  };

  const activeCount = listings.filter((l) => l.status === "active").length;
  const draftCount = listings.filter((l) => l.status === "draft").length;
  const unreadInquiries = receivedInquiries.filter((inq) => !inq.is_read).length;
  const publishedThisMonth = activeCount;

  const togglePause = async (id: string) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing || id.startsWith("draft")) return;

    const newStatus = listing.status === "active" ? "paused" : "active";
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: newStatus } : l
      )
    );

    try {
      await (supabase.from("listings") as any)
        .update({ status: newStatus })
        .eq("id", id);
    } catch {
      // revert optimistic update on error
      setListings((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: listing.status } : l
        )
      );
    }
  };

  const confirmDelete = async () => {
    if (selectedListingId) {
      const listingToDelete = selectedListingId;
      setListings((prev) => prev.filter((l) => l.id !== listingToDelete));

      // Remove from local draft if that was the deleted item
      try {
        const savedDraft = localStorage.getItem("mes_listing_draft");
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.id === listingToDelete || listingToDelete === "draft-local") {
            localStorage.removeItem("mes_listing_draft");
          }
        }
      } catch {
        // ignore
      }

      // Cancel Stripe subscription and delete from database if it's a real listing
      if (!listingToDelete.startsWith("draft")) {
        try {
          await fetch(`/api/listings/${listingToDelete}/cancel-subscription`, {
            method: "POST",
          });
        } catch (subErr) {
          console.warn("[Cancel Subscription Error]", subErr);
        }

        try {
          await (supabase.from("listings") as any).delete().eq("id", listingToDelete);
        } catch {
          // ignore
        }
      }

      setDeleteModalOpen(false);
      setSelectedListingId(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      router.push("/");
      router.refresh();
    } catch {
      // ignore
    }
  };

  const handleDeactivateAccount = async () => {
    setDeactivating(true);
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      router.push("/");
    } finally {
      setDeactivating(false);
    }
  };

  const filteredListings = listings.filter((l) => {
    if (listingFilter === "active") return l.status === "active";
    if (listingFilter === "draft") return l.status === "draft" || l.status === "paused";
    return true;
  });

  /* ── Loading skeleton while profile is being fetched ── */
  if (!profileLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-8 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse">
          <div className="h-8 bg-[#E5E0D6] rounded-full w-48" />
          <div className="h-48 bg-[#E5E0D6] rounded-3xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[#E5E0D6] rounded-2xl" />
            ))}
          </div>
          <div className="h-64 bg-[#E5E0D6] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-8 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Security Alert: Unauthorized Admin Attempt ── */}
        {unauthorized === "admin" && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5 text-red-900 shadow-sm animate-in fade-in">
            <ShieldAlert className="size-6 text-red-600 shrink-0" />
            <div>
              <p className="font-medium text-sm text-red-900">
                Access Restricted: Administrator Privileges Required
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                You do not have permission to access the Admin Console. You have been safely redirected to your dashboard.
              </p>
            </div>
          </div>
        )}

        {/* ── EXECUTIVE BANNER: PLATFORM ADMINISTRATOR ── */}
        {rawRole === "admin" && (
          <div className="mb-8 rounded-3xl bg-[#1F3A2B] text-white p-6 sm:p-8 shadow-md border border-[#2D5440] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1B534]/20 border border-[#E1B534]/40 text-[#E1B534] text-[11px] font-bold tracking-wider uppercase">
                <ShieldCheck size={14} /> Platform Administrator Active
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal">
                Platform Control Center
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF7F2]/80 max-w-2xl leading-relaxed">
                You are signed in with executive administrator privileges. Oversee all platform listings, user accounts, Stripe subscription payments, and marketplace settings.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#E1B534] text-[#1B221E] font-semibold text-sm hover:opacity-95 shadow-sm transition-opacity"
              >
                Open Admin Console <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            GUEST TRAVELER DASHBOARD VIEW
            ════════════════════════════════════════════════════════ */}
        {rawRole === "guest" && (
          <div className="space-y-8">
            {/* Header for Guest */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5E0D6] text-[#1B221E] text-[10px] font-bold tracking-wider uppercase mb-2">
                  Guest Traveler
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl text-[#1B221E] font-medium leading-none">
                  Welcome, {userName}
                </h1>
                <p className="text-sm text-[#6E7771] mt-2">
                  Explore your saved equestrian stays and monitor your sent host inquiries.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full border border-[#E5E0D6] bg-white text-[#6E7771] text-xs font-semibold hover:text-[#C53030] hover:border-red-200 hover:bg-red-50/50 transition-colors shadow-xs"
                >
                  <LogOut size={15} />
                  <span>Sign out</span>
                </button>
                <Link
                  href="/listings"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1F3A2B] text-white text-sm font-medium hover:opacity-95 shadow-sm transition-opacity shrink-0"
                >
                  Browse Stays
                </Link>
              </div>
            </div>

            {/* Upgrade to Owner Prompt Banner */}
            <div className="rounded-3xl border border-[#E5E0D6] bg-white p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E1B534] block">
                  OWN AN EQUINE PROPERTY OR BARN?
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#1B221E]">
                  List your stalls or equestrian farm
                </h3>
                <p className="text-xs sm:text-sm text-[#6E7771] max-w-xl">
                  Upgrade your account to Property Owner to publish your listing, connect directly with guests, and keep 100% of your earnings with zero commissions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleUpgradeToOwner}
                disabled={isUpgrading}
                className="px-6 py-3 rounded-full bg-[#E1B534] text-white text-xs font-semibold hover:opacity-95 transition-opacity shrink-0 shadow-xs"
              >
                {isUpgrading ? "Upgrading…" : "Become a Property Owner"}
              </button>
            </div>

            {/* Guest Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#E5E0D6] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  Saved Stays
                </p>
                <p className="font-serif text-4xl text-[#1B221E] leading-none">
                  {savedStays.length}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E5E0D6] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  Sent Inquiries
                </p>
                <p className="font-serif text-4xl text-[#1B221E] leading-none">
                  {sentInquiries.length}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E5E0D6] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  Upcoming Trips
                </p>
                <p className="font-serif text-4xl text-[#1B221E] leading-none">0</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E5E0D6] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  Account Status
                </p>
                <p className="text-sm font-medium text-green-700 mt-2">Active Member</p>
              </div>
            </div>

            {/* Guest Navigation Tabs */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setGuestTab("favorites")}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  guestTab === "favorites"
                    ? "bg-[#1F3A2B] text-white shadow-xs"
                    : "border border-[#E5E0D6] bg-white text-[#1B221E] hover:border-[#1F3A2B]"
                }`}
              >
                Saved Stays ({savedStays.length})
              </button>

              <button
                type="button"
                onClick={() => setGuestTab("sent_inquiries")}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  guestTab === "sent_inquiries"
                    ? "bg-[#1F3A2B] text-white shadow-xs"
                    : "border border-[#E5E0D6] bg-white text-[#1B221E] hover:border-[#1F3A2B]"
                }`}
              >
                Sent Inquiries ({sentInquiries.length})
              </button>

              <button
                type="button"
                onClick={() => setGuestTab("settings")}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  guestTab === "settings"
                    ? "bg-[#1F3A2B] text-white shadow-xs"
                    : "border border-[#E5E0D6] bg-white text-[#1B221E] hover:border-[#1F3A2B]"
                }`}
              >
                Account Profile
              </button>
            </div>

            {/* Guest Tab 1: Saved Stays */}
            {guestTab === "favorites" && (
              <div>
                {savedStays.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#E5E0D6] p-12 text-center">
                    <Heart size={32} className="text-[#E5E0D6] mx-auto mb-3" />
                    <h3 className="font-serif text-xl text-[#1B221E] mb-2">No saved stays yet</h3>
                    <p className="text-sm text-[#6E7771] mb-6">
                      Browse equestrian properties and save your favorites to compare them later.
                    </p>
                    <Link
                      href="/listings"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1F3A2B] text-white text-xs font-semibold hover:opacity-90"
                    >
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedStays.map((stay) => (
                      <div
                        key={stay.id}
                        className="bg-white rounded-3xl border border-[#E5E0D6] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                      >
                        <div className="relative h-48 w-full bg-slate-100">
                          {stay.image && (
                            <Image
                              src={stay.image}
                              alt={stay.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771]">
                                {stay.category}{stay.city ? ` · ${stay.city}` : ""}
                              </span>
                              <span className="text-sm font-semibold text-[#1F3A2B]">
                                ${stay.price_per_night}/night
                              </span>
                            </div>
                            <h3 className="font-serif text-lg text-[#1B221E] font-medium mt-1">
                              {stay.title}
                            </h3>
                            <p className="text-xs text-[#6E7771] mt-1">
                              {stay.stalls} stalls · {stay.bedrooms} bedrooms
                            </p>
                          </div>

                          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#E5E0D6]">
                            <Link
                              href={`/property/${stay.id}`}
                              className="flex-1 text-center py-2.5 rounded-full bg-[#1F3A2B] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                            >
                              View Property
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                setSavedStays((prev) => prev.filter((s) => s.id !== stay.id))
                              }
                              className="p-2.5 rounded-full border border-[#E5E0D6] text-[#6E7771] hover:text-red-600 hover:border-red-200 transition-colors"
                              title="Remove from saved"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Guest Tab 2: Sent Inquiries */}
            {guestTab === "sent_inquiries" && (
              <div className="space-y-4">
                {sentInquiries.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#E5E0D6] p-12 text-center">
                    <Mail size={32} className="text-[#E5E0D6] mx-auto mb-3" />
                    <h3 className="font-serif text-xl text-[#1B221E] mb-2">No inquiries sent yet</h3>
                    <p className="text-sm text-[#6E7771] mb-6">
                      Find a property you love and send the owner a message to ask about availability.
                    </p>
                    <Link
                      href="/listings"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1F3A2B] text-white text-xs font-semibold hover:opacity-90"
                    >
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  sentInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white rounded-2xl border border-[#E5E0D6] p-6 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                            Sent to Host
                          </span>
                          <h3 className="font-serif text-lg text-[#1B221E] mt-1">
                            {inq.property_title}
                          </h3>
                          <p className="text-xs text-[#6E7771]">
                            Sent {inq.created_at}
                          </p>
                        </div>
                        <div className="text-right">
                          {inq.arrival_date && (
                            <p className="text-xs font-medium text-[#1B221E]">
                              {inq.arrival_date} – {inq.departure_date}
                            </p>
                          )}
                          {inq.horse_count > 0 && (
                            <p className="text-[11px] text-[#6E7771]">{inq.horse_count} Horse{inq.horse_count > 1 ? "s" : ""}</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#FAF7F2] p-3 rounded-xl text-xs text-[#1B221E]">
                        &ldquo;{inq.message}&rdquo;
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Link
                          href={`/property/${inq.listing_id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E5E0D6] text-xs font-medium text-[#1B221E] hover:bg-[#FAF7F2]"
                        >
                          <Eye size={13} /> View Property
                        </Link>
                        {inq.owner_email && (
                          <a
                            href={`mailto:${inq.owner_email}?subject=Follow up: ${encodeURIComponent(
                              inq.property_title
                            )}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1F3A2B] text-white text-xs font-medium hover:opacity-90"
                          >
                            <Mail size={13} /> Contact Host Again
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Guest Tab 3: Settings */}
            {guestTab === "settings" && (
              <div className="max-w-2xl bg-white rounded-3xl border border-[#E5E0D6] p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <h2 className="font-serif text-2xl text-[#1B221E] mb-1">
                    Guest Account Profile
                  </h2>
                  <p className="text-xs text-[#6E7771]">
                    Manage your credentials and preferences
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E7771] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={userName}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF7F2] text-sm text-[#1B221E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E7771] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={userEmail}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF7F2] text-sm text-[#1B221E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E7771] mb-1">
                      Account Role
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        disabled
                        value="Guest Traveler"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF7F2] text-sm text-[#1B221E]"
                      />
                      <button
                        type="button"
                        onClick={handleUpgradeToOwner}
                        disabled={isUpgrading}
                        className="px-4 py-2.5 rounded-xl bg-[#1F3A2B] text-white text-xs font-medium hover:opacity-90 shrink-0"
                      >
                        {isUpgrading ? "Upgrading…" : "Upgrade to Owner"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-red-200 space-y-3">
                  <h3 className="font-serif text-lg text-red-700">Danger zone</h3>
                  <p className="text-xs text-[#6E7771] leading-relaxed">
                    Signing out or deactivating will clear your saved session.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="px-5 py-2.5 rounded-full border border-[#E5E0D6] bg-white text-[#1B221E] text-xs font-semibold hover:border-[#1F3A2B] hover:bg-[#FAF7F2] transition-colors"
                    >
                      Sign out
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeactivateModalOpen(true)}
                      className="px-5 py-2.5 rounded-full border border-red-300 text-red-700 text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      Deactivate account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            PROPERTY OWNER (OR ADMIN) DASHBOARD VIEW
            ════════════════════════════════════════════════════════ */}
        {(rawRole === "owner" || rawRole === "admin") && (
          <div>
            {/* Header matching original layout */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E1B534] block mb-1">
                  {rawRole === "admin" ? "ADMINISTRATOR DASHBOARD" : "PROPERTY OWNER DASHBOARD"}
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl text-[#1B221E] font-medium leading-none">
                  {t.dashboard.welcome}, {userName}
                </h1>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full border border-[#E5E0D6] bg-white text-[#6E7771] text-xs font-semibold hover:text-[#C53030] hover:border-red-200 hover:bg-red-50/50 transition-colors shadow-xs"
                >
                  <LogOut size={15} />
                  <span>Sign out</span>
                </button>
                <Link
                  href="/list-property"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#E1B534] text-white text-sm font-medium hover:opacity-90 shadow-sm transition-opacity shrink-0"
                >
                  <Plus size={16} />
                  {t.dashboard.addProperty}
                </Link>
              </div>
            </div>

            {/* 4 Stat Cards in a row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="bg-white rounded-2xl p-5 border border-[#E5E0D6] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  {t.dashboard.activeListings}
                </p>
                <p className="font-serif text-4xl text-[#1B221E] leading-none">
                  {activeCount}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E5E0D6] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  {t.dashboard.draftsUnpaid}
                </p>
                <p className="font-serif text-4xl text-[#1B221E] leading-none">
                  {draftCount}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E5E0D6] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  {t.dashboard.unreadInquiries}
                </p>
                <p className="font-serif text-4xl text-[#1B221E] leading-none">
                  {unreadInquiries}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E5E0D6] shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  {t.dashboard.publishedThisMonth}
                </p>
                <p className="font-serif text-4xl text-[#1B221E] leading-none">
                  {publishedThisMonth}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <button
                type="button"
                onClick={() => setOwnerTab("listings")}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  ownerTab === "listings"
                    ? "bg-[#1F3A2B] text-white shadow-xs"
                    : "border border-[#E5E0D6] bg-white text-[#1B221E] hover:border-[#1F3A2B]"
                }`}
              >
                {t.dashboard.myListings}
              </button>

              <button
                type="button"
                onClick={() => setOwnerTab("inquiries")}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  ownerTab === "inquiries"
                    ? "bg-[#1F3A2B] text-white shadow-xs"
                    : "border border-[#E5E0D6] bg-white text-[#1B221E] hover:border-[#1F3A2B]"
                }`}
              >
                {t.dashboard.inquiries} ({receivedInquiries.length})
              </button>

              <button
                type="button"
                onClick={() => setOwnerTab("settings")}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  ownerTab === "settings"
                    ? "bg-[#1F3A2B] text-white shadow-xs"
                    : "border border-[#E5E0D6] bg-white text-[#1B221E] hover:border-[#1F3A2B]"
                }`}
              >
                {t.dashboard.accountSettings}
              </button>
            </div>

            {/* Tab 1: Listings */}
            {ownerTab === "listings" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  {(["all", "active", "draft"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setListingFilter(filter)}
                      className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                        listingFilter === filter
                          ? "bg-[#E1B534] text-white font-medium"
                          : "text-[#6E7771] hover:text-[#1B221E]"
                      }`}
                    >
                      {filter === "all"
                        ? `All (${listings.length})`
                        : filter === "active"
                        ? `Active (${activeCount})`
                        : `Drafts (${draftCount})`}
                    </button>
                  ))}
                </div>

                {filteredListings.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#E5E0D6] p-12 text-center">
                    <FileText size={32} className="text-[#E5E0D6] mx-auto mb-3" />
                    <h3 className="font-serif text-xl text-[#1B221E] mb-2">
                      {listingFilter === "all" ? "No properties yet" : `No ${listingFilter} listings`}
                    </h3>
                    <p className="text-sm text-[#6E7771] mb-6">
                      {listingFilter === "all"
                        ? "List your first equestrian property to start connecting with horse travelers."
                        : `You have no ${listingFilter} listings at this time.`}
                    </p>
                    {listingFilter === "all" && (
                      <Link
                        href="/list-property"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E1B534] text-white text-xs font-semibold"
                      >
                        <Plus size={14} /> Add Property
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredListings.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-3xl border border-[#E5E0D6] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  item.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "paused"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {item.status}
                              </span>
                              <span className="text-xs text-[#6E7771]">
                                {item.category}{item.city ? ` · ${item.city}` : ""}
                              </span>
                            </div>
                            <h3 className="font-serif text-lg sm:text-xl text-[#1B221E] font-medium">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[#6E7771] mt-0.5">
                              ${item.price_per_night} / night · {item.stalls ?? 0} stalls · {item.bedrooms ?? 0} beds
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons: View, Edit, Pause, Delete */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5E0D6]">
                          {item.status === "draft" ? (
                            <Link
                              href="/list-property"
                              className="px-4 py-2 rounded-full bg-[#E1B534] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                            >
                              Resume setup
                            </Link>
                          ) : (
                            <>
                              <Link
                                href={`/property/${item.id}`}
                                className="p-2.5 rounded-full border border-[#E5E0D6] text-[#6E7771] hover:text-[#1B221E] hover:bg-[#FAF7F2] transition-colors inline-flex items-center justify-center"
                                aria-label="View listing"
                                title="View listing page"
                              >
                                <Eye size={15} />
                              </Link>

                              <Link
                                href={`/list-property?edit=${item.id}`}
                                className="p-2.5 rounded-full border border-[#E5E0D6] text-[#6E7771] hover:text-[#1B221E] hover:bg-[#FAF7F2] transition-colors inline-flex items-center justify-center"
                                aria-label="Edit listing"
                                title="Edit listing details"
                              >
                                <Edit3 size={15} />
                              </Link>

                              <button
                                type="button"
                                onClick={() => togglePause(item.id)}
                                className="px-3 py-2 rounded-full border border-[#E5E0D6] text-xs font-medium text-[#1B221E] hover:bg-[#FAF7F2] transition-colors"
                                title={
                                  item.status === "active"
                                    ? "Pause listing"
                                    : "Reactivate listing"
                                }
                              >
                                {item.status === "active" ? "Pause" : "Reactivate"}
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedListingId(item.id);
                              setDeleteModalOpen(true);
                            }}
                            className="p-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors inline-flex items-center justify-center"
                            aria-label="Delete listing"
                            title="Delete listing"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Received Inquiries */}
            {ownerTab === "inquiries" && (
              <div className="space-y-4">
                {receivedInquiries.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#E5E0D6] p-12 text-center">
                    <Mail size={32} className="text-[#E5E0D6] mx-auto mb-3" />
                    <h3 className="font-serif text-xl text-[#1B221E] mb-2">No inquiries yet</h3>
                    <p className="text-sm text-[#6E7771]">
                      When guests send you messages about your listings, they will appear here.
                    </p>
                  </div>
                ) : (
                  receivedInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white rounded-3xl border border-[#E5E0D6] p-6 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-lg text-[#1B221E]">
                              {inq.guest_name}
                            </h3>
                            {!inq.is_read && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E1B534] text-white">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6E7771] mt-0.5">
                            Inquired for: <span className="font-medium text-[#1B221E]">{inq.listing_title}</span>
                          </p>
                        </div>
                        <span className="text-xs text-[#6E7771]">{inq.created_at}</span>
                      </div>

                      {(inq.arrival_date || inq.horse_count > 0) && (
                        <p className="text-xs text-[#6E7771]">
                          {inq.arrival_date && `Dates: ${inq.arrival_date} to ${inq.departure_date}`}
                          {inq.horse_count > 0 && ` · ${inq.horse_count} horse${inq.horse_count > 1 ? "s" : ""}`}
                        </p>
                      )}

                      <div className="text-sm text-[#1B221E] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E5E0D6]/60">
                        {inq.message}
                      </div>

                      <div className="pt-1 flex gap-2">
                        <a
                          href={`mailto:${inq.guest_email}?subject=Re: Inquiry for ${encodeURIComponent(
                            inq.listing_title
                          )}`}
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1F3A2B] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                        >
                          <Mail size={13} />
                          Reply to {inq.guest_name}
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Owner Account Settings */}
            {ownerTab === "settings" && (
              <div className="max-w-2xl bg-white rounded-3xl border border-[#E5E0D6] p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <h2 className="font-serif text-2xl text-[#1B221E] mb-1">
                    Account profile
                  </h2>
                  <p className="text-xs text-[#6E7771]">
                    Manage your user credentials and platform settings
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E7771] mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={userName}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF7F2] text-sm text-[#1B221E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E7771] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={userEmail}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF7F2] text-sm text-[#1B221E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E7771] mb-1">
                      Account role
                    </label>
                    <input
                      type="text"
                      disabled
                      value={userRole}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF7F2] text-sm text-[#1B221E]"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-red-200 space-y-3">
                  <h3 className="font-serif text-lg text-red-700">Danger zone</h3>
                  <p className="text-xs text-[#6E7771] leading-relaxed">
                    Deactivating your account will hide your active listings from search and sign you out of My Equine Stay.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="px-5 py-2.5 rounded-full border border-[#E5E0D6] bg-white text-[#1B221E] text-xs font-semibold hover:border-[#1F3A2B] hover:bg-[#FAF7F2] transition-colors"
                    >
                      Sign out
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeactivateModalOpen(true)}
                      className="px-5 py-2.5 rounded-full border border-red-300 text-red-700 text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      Deactivate account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#E5E0D6] text-center"
            >
              <div className="size-12 rounded-full bg-red-100 text-red-700 grid place-items-center mx-auto mb-3">
                <Trash2 size={20} />
              </div>
              <h3 className="font-serif text-xl text-[#1B221E] mb-1">
                Delete listing?
              </h3>
              <p className="text-xs text-[#6E7771] mb-6 leading-relaxed">
                Deleting this listing will immediately cancel its active subscription. This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#E5E0D6] text-xs font-medium text-[#1B221E]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                >
                  Yes, delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Account Deactivation Modal */}
      <AnimatePresence>
        {deactivateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E5E0D6] text-center"
            >
              <div className="size-12 rounded-full bg-amber-100 text-amber-700 grid place-items-center mx-auto mb-3">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-serif text-2xl text-[#1B221E] mb-2">
                Deactivate account?
              </h3>
              <p className="text-xs text-[#6E7771] leading-relaxed mb-6">
                Are you sure you want to deactivate your account? Your listings will be hidden from travelers and you will be signed out.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeactivateModalOpen(false)}
                  className="flex-1 py-3 rounded-full border border-[#E5E0D6] text-xs font-medium text-[#1B221E]"
                >
                  Keep account
                </button>
                <button
                  type="button"
                  onClick={handleDeactivateAccount}
                  disabled={deactivating}
                  className="flex-1 py-3 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                >
                  {deactivating ? "Deactivating…" : "Yes, deactivate"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OwnerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] p-8 text-center text-sm text-[#6E7771]">Loading dashboard…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
