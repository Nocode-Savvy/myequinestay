"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";

export interface FilterValues {
  maxPriceNight: number;
  maxPriceWeek: number;
  maxPriceMonth: number;
  minAcreage: number;
  venue: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  horses: number;
  stalls: number;
  barns: number;
  amenities: string[];
  equestrianFacilities: string[];
  houseAmenities: string[];
}

export const DEFAULT_FILTER_VALUES: FilterValues = {
  maxPriceNight: 600,
  maxPriceWeek: 3500,
  maxPriceMonth: 12000,
  minAcreage: 0,
  venue: "Any",
  bedrooms: 0,
  bathrooms: 0,
  guests: 0,
  horses: 0,
  stalls: 0,
  barns: 0,
  amenities: [],
  equestrianFacilities: [],
  houseAmenities: [],
};

const VENUES = [
  "Any",
  "World Equestrian Center",
  "HITS Ocala",
  "Florida Horse Park",
];

const AMENITIES_LIST = [
  "Pasture",
  "Pool",
  "Air conditioning",
  "Fenced",
  "Trailer parking",
];

const EQUESTRIAN_FACILITIES_LIST = [
  "Wash bay",
  "Round pen",
  "Dressage arena",
  "Jumping arena",
  "Outdoor arena",
  "Indoor arena",
  "Tack room",
  "Feed / hay storage",
  "Automatic waterers",
  "Run-in shelter",
  "Turnout paddocks",
  "Trail access",
  "Hot walker",
];

const HOUSE_AMENITIES_LIST = [
  "Wi-Fi",
  "Full kitchen",
  "Kitchenette",
  "Heating",
  "Washer & dryer",
  "Dishwasher",
  "TV",
  "Private bath",
  "Porch / patio",
  "Firepit",
  "Parking",
  "Workspace",
];

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onChange,
  matchCount = 10,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterValues;
  onChange: (f: FilterValues) => void;
  matchCount?: number;
}) {
  const [draft, setDraft] = useState<FilterValues>(filters);

  const toggleArrayItem = (
    key: "amenities" | "equestrianFacilities" | "houseAmenities",
    item: string
  ) => {
    setDraft((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(item)
          ? current.filter((x) => x !== item)
          : [...current, item],
      };
    });
  };

  const stepValue = (
    key: "bedrooms" | "bathrooms" | "guests" | "horses" | "stalls" | "barns",
    delta: number
  ) => {
    setDraft((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const handleClearAll = () => {
    setDraft(DEFAULT_FILTER_VALUES);
    onChange(DEFAULT_FILTER_VALUES);
  };

  const handleApply = () => {
    onChange(draft);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-[#E5E0D6] flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#E5E0D6] flex items-center justify-between shrink-0">
            <h2 className="font-serif text-3xl text-[#1B221E]">Filter</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#6E7771] hover:bg-[#FAF7F2] transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-7 flex-1">
            {/* Sliders */}
            <div className="space-y-6">
              {/* Max Price / Night */}
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  <span>Max Price / Night</span>
                  <span className="text-[#1B221E] font-serif text-base font-normal">
                    ${draft.maxPriceNight.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1500}
                  step={25}
                  value={draft.maxPriceNight}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      maxPriceNight: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#1F3A2B] h-2 bg-[#E5E0D6] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Max Price / Week */}
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  <span>Max Price / Week</span>
                  <span className="text-[#1B221E] font-serif text-base font-normal">
                    ${draft.maxPriceWeek.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={10000}
                  step={100}
                  value={draft.maxPriceWeek}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      maxPriceWeek: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#1F3A2B] h-2 bg-[#E5E0D6] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Max Price / Month */}
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  <span>Max Price / Month</span>
                  <span className="text-[#1B221E] font-serif text-base font-normal">
                    ${draft.maxPriceMonth.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={40000}
                  step={500}
                  value={draft.maxPriceMonth}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      maxPriceMonth: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#1F3A2B] h-2 bg-[#E5E0D6] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Min Acreage */}
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#6E7771] mb-2">
                  <span>Min Acreage</span>
                  <span className="text-[#1B221E] font-serif text-base font-normal">
                    {draft.minAcreage} AC
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={draft.minAcreage}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      minAcreage: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#1F3A2B] h-2 bg-[#E5E0D6] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Equestrian Venue */}
            <div className="rounded-2xl border border-[#E5E0D6] p-4 space-y-2.5">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#6E7771]">
                Equestrian Venue
              </label>
              <div className="flex flex-wrap gap-2">
                {VENUES.map((venue) => {
                  const active = draft.venue === venue;
                  return (
                    <button
                      key={venue}
                      type="button"
                      onClick={() => setDraft((p) => ({ ...p, venue }))}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                        active
                          ? "bg-[#E1B534] text-white border border-[#E1B534]"
                          : "bg-white border border-[#E5E0D6] text-[#1B221E] hover:border-[#1F3A2B]"
                      }`}
                    >
                      {venue}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Numeric Steppers: 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Bedrooms", key: "bedrooms" as const },
                { label: "Bathrooms", key: "bathrooms" as const },
                { label: "Guests", key: "guests" as const },
                { label: "Horses", key: "horses" as const },
                { label: "Stalls", key: "stalls" as const },
                { label: "Barns", key: "barns" as const },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#6E7771]">
                    {label}
                  </span>
                  <div className="flex items-center justify-between px-3 py-2 rounded-full border border-[#E5E0D6] bg-white">
                    <button
                      type="button"
                      onClick={() => stepValue(key, -1)}
                      disabled={draft[key] === 0}
                      className="size-7 rounded-full grid place-items-center text-[#6E7771] hover:text-[#1B221E] hover:bg-[#FAF7F2] disabled:opacity-30 transition-colors"
                      aria-label={`Decrease ${label}`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium text-[#1B221E]">
                      {draft[key]}+
                    </span>
                    <button
                      type="button"
                      onClick={() => stepValue(key, 1)}
                      className="size-7 rounded-full grid place-items-center text-[#6E7771] hover:text-[#1B221E] hover:bg-[#FAF7F2] transition-colors"
                      aria-label={`Increase ${label}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Amenities Chips */}
            <div className="space-y-2.5">
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#6E7771]">
                Amenities
              </span>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map((item) => {
                  const active = draft.amenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleArrayItem("amenities", item)}
                      className={`px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                        active
                          ? "bg-[#1F3A2B] text-white border border-[#1F3A2B]"
                          : "bg-white border border-[#E5E0D6] text-[#1B221E] hover:border-[#1F3A2B]"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Equestrian Facilities Chips */}
            <div className="space-y-2.5">
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#6E7771]">
                Equestrian Facilities
              </span>
              <div className="flex flex-wrap gap-2">
                {EQUESTRIAN_FACILITIES_LIST.map((item) => {
                  const active = draft.equestrianFacilities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggleArrayItem("equestrianFacilities", item)
                      }
                      className={`px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                        active
                          ? "bg-[#1F3A2B] text-white border border-[#1F3A2B]"
                          : "bg-white border border-[#E5E0D6] text-[#1B221E] hover:border-[#1F3A2B]"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* House Amenities Chips */}
            <div className="space-y-2.5">
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#6E7771]">
                House Amenities
              </span>
              <div className="flex flex-wrap gap-2">
                {HOUSE_AMENITIES_LIST.map((item) => {
                  const active = draft.houseAmenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleArrayItem("houseAmenities", item)}
                      className={`px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                        active
                          ? "bg-[#1F3A2B] text-white border border-[#1F3A2B]"
                          : "bg-white border border-[#E5E0D6] text-[#1B221E] hover:border-[#1F3A2B]"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 sm:p-5 border-t border-[#E5E0D6] bg-white flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleClearAll}
              className="flex-1 py-3 px-6 rounded-full border border-[#E5E0D6] bg-white text-sm font-medium text-[#1B221E] hover:border-[#1F3A2B] transition-colors"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-3 px-6 rounded-full bg-[#E1B534] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Show {matchCount}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
