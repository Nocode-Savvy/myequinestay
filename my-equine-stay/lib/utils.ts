import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combines class names and merges Tailwind conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a price in USD */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents);
}

/** Truncates text to maxLength with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Generates a slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Returns a relative time string (e.g. "2 days ago") */
export function relativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Pluralizes a word based on count */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? singular + "s");
}

/** Converts property type slug to display label */
export function propertyTypeLabel(slug: string): string {
  const map: Record<string, string> = {
    equestrian_farm: "Equestrian Farm",
    house: "House",
    apartment: "Apartment",
    private_bedroom: "Private Bedroom",
    rv: "RV",
    rv_hookup: "RV Hookup",
    pasture_rental: "Pasture Rental",
    barn_stall: "Barn / Stall",
  };
  return map[slug] ?? slug;
}
