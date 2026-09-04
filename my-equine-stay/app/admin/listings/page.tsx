"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, Trash2, Eye, Edit3, Building2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { propertyTypeLabel } from "@/lib/utils";

interface ListingPhoto {
  id: string;
  url: string;
  is_cover: boolean;
}

interface AdminListing {
  id: string;
  title: string;
  property_type: string;
  city: string;
  price_per_night: number;
  plan: "standard" | "premium";
  status: "active" | "draft" | "paused" | "expired";
  is_featured: boolean;
  stalls: number;
  created_at: string;
  listing_photos?: ListingPhoto[];
  profiles?: {
    full_name: string;
    email: string;
  };
}

export default function AdminListingsPage() {
  const supabase = createClient();

  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadListings = async () => {
    try {
      setLoading(true);
      const { data, error } = (await (supabase
        .from("listings") as any)
        .select("*, listing_photos(*), profiles(full_name, email)")
        .order("created_at", { ascending: false })) as any;

      if (!error && data) {
        setListings(data);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error("Failed to load listings:", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    const nextVal = !currentFeatured;
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, is_featured: nextVal } : l))
    );

    try {
      await (supabase.from("listings") as any)
        .update({ is_featured: nextVal })
        .eq("id", id);
    } catch (err) {
      console.error("Failed to update featured status:", err);
      // Revert on error
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, is_featured: currentFeatured } : l))
      );
    }
  };

  const deleteListing = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this listing? Any active Stripe subscription will be cancelled."
      )
    ) {
      return;
    }

    setListings((prev) => prev.filter((l) => l.id !== id));

    try {
      // Cancel Stripe subscription
      await fetch(`/api/listings/${id}/cancel-subscription`, { method: "POST" });
      // Delete from database
      await (supabase.from("listings") as any).delete().eq("id", id);
    } catch (err) {
      console.error("Failed to delete listing:", err);
      loadListings();
    }
  };

  const filtered = listings.filter((l) =>
    (l.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.city || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1F3A2B]">Listings Moderation</h1>
          <p className="text-xs text-[#6E7771] mt-0.5">
            Review properties, feature top stays on the homepage, and manage live listings.
          </p>
        </div>
        <Link
          href="/list-property"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E1B534] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs self-start"
        >
          + Add New Listing
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E7771]" />
        <input
          type="text"
          placeholder="Search listings by title or Florida city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#E5E0D6] bg-white text-[#1B221E] focus:outline-none focus:border-[#1F3A2B] transition-colors"
        />
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-[#E5E0D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5E0D6] text-[#6E7771] uppercase font-semibold">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Type</th>
                <th className="p-4">Rate</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D6]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#6E7771]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="size-6 border-2 border-[#1F3A2B] border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs">Loading listings from live database…</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#6E7771]">
                    <Building2 size={32} className="text-[#E5E0D6] mx-auto mb-2" />
                    <p className="font-medium text-sm text-[#1B221E] mb-1">
                      {search ? `No listings match "${search}"` : "No properties listed yet"}
                    </p>
                    <p className="text-xs max-w-sm mx-auto">
                      {search
                        ? "Try clearing your search terms to see all properties."
                        : "When property owners add equestrian stays, they will appear here for moderation, approval, and homepage featuring."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((l) => {
                  const cover = l.listing_photos?.[0]?.url;
                  return (
                    <tr key={l.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#FAF7F2] border border-[#E5E0D6]">
                            {cover ? (
                              <Image src={cover} alt={l.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-[#6E7771]">No photo</div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1B221E] line-clamp-1">{l.title}</p>
                            <p className="text-[#6E7771] text-[11px]">
                              {l.city ? `${l.city}, FL · ` : ""}{l.stalls || 0} stalls
                              {l.profiles?.full_name ? ` · Host: ${l.profiles.full_name}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[#6E7771] font-medium">{propertyTypeLabel(l.property_type)}</td>
                      <td className="p-4 font-semibold text-[#1B221E]">${l.price_per_night}/nt</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            l.plan === "premium"
                              ? "bg-[#E1B534]/15 text-[#C8A928] border border-[#E1B534]/30"
                              : "bg-[#FAF7F2] text-[#6E7771] border border-[#E5E0D6]"
                          }`}
                        >
                          {l.plan}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => toggleFeatured(l.id, l.is_featured)}
                          className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                            l.is_featured
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-[#FAF7F2] text-[#6E7771] border border-[#E5E0D6] hover:bg-slate-100"
                          }`}
                        >
                          <Star size={12} className={l.is_featured ? "fill-amber-500 text-amber-500" : ""} />
                          {l.is_featured ? "Featured" : "Regular"}
                        </button>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            l.status === "active"
                              ? "bg-green-100 text-green-800"
                              : l.status === "paused"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/property/${l.id}`}
                            target="_blank"
                            className="p-1.5 text-[#6E7771] hover:text-[#1F3A2B] hover:bg-[#FAF7F2] rounded-lg border border-[#E5E0D6] transition-colors inline-flex items-center justify-center"
                            title="View live listing"
                            aria-label="View live listing"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            href={`/list-property?edit=${l.id}`}
                            className="p-1.5 text-[#6E7771] hover:text-[#1F3A2B] hover:bg-[#FAF7F2] rounded-lg border border-[#E5E0D6] transition-colors inline-flex items-center justify-center"
                            title="Edit listing details"
                            aria-label="Edit listing details"
                          >
                            <Edit3 size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteListing(l.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors inline-flex items-center justify-center"
                            title="Delete listing"
                            aria-label="Delete listing"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
