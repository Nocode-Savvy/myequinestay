/**
 * Platform-level config driven by environment variables.
 * This is the single source of truth for branding values that
 * can be customized per buyer deployment without touching code.
 *
 * For DB-driven settings (logo URL, primary color overrides),
 * use the settings table via the admin panel.
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "My Equine Stay",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@myequinestay.com",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@myequinestay.com",
  description:
    "Find and book equestrian-friendly short-term stays in Florida — farms, barns, private homes, RV hookups, and pasture rentals for you and your horses.",
  tagline: "Where horses stay too.",
  location: "Florida, USA",
  social: {
    instagram: "https://instagram.com/myequinestay",
    facebook: "https://facebook.com/myequinestay",
  },
  plans: {
    standard: {
      name: "Standard",
      price: 59,
      interval: "3 months",
      priceId: process.env.STRIPE_PRICE_STANDARD ?? "",
      features: [
        "Listed on the browse page",
        "Up to 10 photos",
        "Inquiry form for guests",
        "3-month listing term",
      ],
    },
    premium: {
      name: "Premium",
      price: 89,
      interval: "3 months",
      priceId: process.env.STRIPE_PRICE_PREMIUM ?? "",
      features: [
        "Featured badge on listing",
        "Priority placement in search",
        "Up to 20 photos",
        "Inquiry form for guests",
        "3-month listing term",
        "Eligible for homepage feature",
      ],
    },
  },
  propertyTypes: [
    { value: "equestrian_farm", label: "Equestrian Farm" },
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "private_bedroom", label: "Private Bedroom" },
    { value: "rv", label: "RV" },
    { value: "rv_hookup", label: "RV Hookup" },
    { value: "pasture_rental", label: "Pasture Rental" },
    { value: "barn_stall", label: "Barn / Stall" },
  ],
  amenities: [
    { value: "wifi", label: "WiFi" },
    { value: "air_conditioning", label: "Air Conditioning" },
    { value: "washer_dryer", label: "Washer / Dryer" },
    { value: "kitchen", label: "Full Kitchen" },
    { value: "parking", label: "Parking" },
    { value: "pet_friendly", label: "Pet Friendly" },
    { value: "pool", label: "Pool" },
    { value: "hot_tub", label: "Hot Tub" },
    { value: "bbq_grill", label: "BBQ / Grill" },
    { value: "fireplace", label: "Fireplace" },
    { value: "ev_charging", label: "EV Charging" },
    { value: "security_cameras", label: "Security Cameras" },
    { value: "smart_tv", label: "Smart TV" },
    { value: "workspace", label: "Dedicated Workspace" },
  ],
  horseFacilities: [
    { value: "stalls", label: "Stalls" },
    { value: "barn", label: "Barn" },
    { value: "pasture", label: "Pasture" },
    { value: "arena", label: "Riding Arena" },
    { value: "round_pen", label: "Round Pen" },
    { value: "wash_rack", label: "Wash Rack" },
    { value: "tack_room", label: "Tack Room" },
    { value: "trailer_parking", label: "Trailer Parking" },
    { value: "feed_included", label: "Feed Included" },
    { value: "hay_storage", label: "Hay Storage" },
    { value: "water_access", label: "Water Access" },
    { value: "vet_access", label: "Vet Access Nearby" },
    { value: "trail_access", label: "Trail Access" },
    { value: "cross_ties", label: "Cross Ties" },
    { value: "night_check", label: "Night Check Available" },
  ],
} as const;

export type PlanKey = keyof typeof siteConfig.plans;
export type PropertyType = (typeof siteConfig.propertyTypes)[number]["value"];
