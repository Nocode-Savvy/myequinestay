"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MapPin, Compass, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SAMPLE_LISTINGS } from "@/lib/data/sample-listings";
import { propertyTypeLabel } from "@/lib/utils";

export default function FavoritesPage() {
  const [savedListings, setSavedListings] = useState(SAMPLE_LISTINGS.slice(0, 3));

  const removeFavorite = (id: string) => {
    setSavedListings(savedListings.filter((l) => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-28 pb-20">
      <div className="section-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-overline mb-1">Your Account</p>
            <h1 className="text-display-md text-[var(--color-forest)]">Saved Stays</h1>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Properties you have bookmarked for upcoming shows and travels.
            </p>
          </div>
          <Link href="/browse">
            <Button variant="forest" size="sm">
              <Compass size={16} /> Explore Stays
            </Button>
          </Link>
        </div>

        {savedListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-[var(--shadow-card)] border border-[var(--color-sand-light)] space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <Heart size={32} />
            </div>
            <h2 className="font-serif font-bold text-xl text-[var(--color-forest)]">No saved stays yet</h2>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              When browsing farms, barns, and RV pads in Florida, click the heart icon to save them to this list.
            </p>
            <Link href="/browse">
              <Button variant="gold" size="md">
                Browse Stays in Florida
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((listing, idx) => {
              const cover = listing.listing_photos?.[0]?.url;
              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card group overflow-hidden bg-white"
                >
                  <div className="relative aspect-[4/3]">
                    {cover && (
                      <Image
                        src={cover}
                        alt={listing.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <button
                      onClick={() => removeFavorite(listing.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-600 hover:bg-white transition-transform hover:scale-110 shadow-md"
                      title="Remove from saved"
                    >
                      <Heart size={16} className="fill-red-600" />
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="text-overline mb-1">{propertyTypeLabel(listing.property_type)}</p>
                    <Link href={`/listings/${listing.id}`}>
                      <h3 className="font-serif font-bold text-[15px] text-[var(--color-forest)] hover:text-[var(--color-gold)] transition-colors line-clamp-1 mb-1">
                        {listing.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[var(--color-muted)] flex items-center gap-1 mb-3">
                      <MapPin size={12} /> {listing.city}, FL · {listing.stalls} stalls
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-sand-light)]">
                      <div>
                        <span className="font-serif font-bold text-lg text-[var(--color-charcoal)]">${listing.price_per_night}</span>
                        <span className="text-xs text-[var(--color-muted)]"> / night</span>
                      </div>
                      <Link href={`/listings/${listing.id}`}>
                        <span className="text-xs font-semibold text-[var(--color-gold)] hover:underline">
                          View details →
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
