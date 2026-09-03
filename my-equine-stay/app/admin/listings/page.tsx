"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, Trash2, Eye, Edit3, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SAMPLE_LISTINGS } from "@/lib/data/sample-listings";
import { propertyTypeLabel } from "@/lib/utils";

export default function AdminListingsPage() {
  const [listings, setListings] = useState(SAMPLE_LISTINGS);
  const [search, setSearch] = useState("");

  const toggleFeatured = (id: string) => {
    setListings(
      listings.map((l) =>
        l.id === id ? { ...l, is_featured: !l.is_featured } : l
      )
    );
  };

  const deleteListing = (id: string) => {
    if (window.confirm("Are you sure you want to remove this listing?")) {
      setListings(listings.filter((l) => l.id !== id));
    }
  };

  const filtered = listings.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase())
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#6E7771]">
                    <p className="font-medium text-sm text-[#1B221E] mb-1">No listings found</p>
                    <p className="text-xs">No listings match your search query &quot;{search}&quot;</p>
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
                            {cover && <Image src={cover} alt={l.title} fill className="object-cover" />}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1B221E] line-clamp-1">{l.title}</p>
                            <p className="text-[#6E7771] text-[11px]">{l.city}, FL · {l.stalls} stalls</p>
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
                          onClick={() => toggleFeatured(l.id)}
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
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/listings/${l.id}`}
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
