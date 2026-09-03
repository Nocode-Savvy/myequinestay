import { z } from "zod";

// Password must be 8+ chars with upper, lower, number, and special character
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.enum(["guest", "owner"]),
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const listingBasicsSchema = z.object({
  property_type: z.string().min(1, "Please select a property type"),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be under 100 characters"),
  address: z.string().min(5, "Please enter a full address"),
  city: z.string().min(2, "City is required"),
  state: z.string().default("FL"),
  zip_code: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit ZIP code"),
});

export const locationSchema = z.object({
  latitude: z.number().min(24).max(31, "Latitude must be within Florida"),
  longitude: z.number().min(-87).max(-80, "Longitude must be within Florida"),
});

export const accommodationSchema = z.object({
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().min(0).max(20),
  max_guests: z.number().int().min(1).max(50),
  acreage: z.number().min(0).max(10000).optional(),
  amenities: z.array(z.string()).default([]),
  languages_spoken: z.array(z.string()).default(["English"]),
  pets_allowed: z.boolean().default(false),
  smoking_allowed: z.boolean().default(false),
});

export const horseFacilitiesSchema = z.object({
  stalls: z.number().int().min(0).max(500),
  barns: z.number().int().min(0).max(50),
  horse_capacity: z.number().int().min(0).max(500),
  horse_facilities: z.array(z.string()).default([]),
  facility_notes: z.string().max(1000).optional(),
  horse_description: z
    .string()
    .min(20, "Please provide a description of your horse facilities (at least 20 characters)")
    .max(3000),
});

export const pricingSchema = z.object({
  price_per_night: z.number().min(0).max(10000),
  price_per_week: z.number().min(0).max(50000).optional(),
  price_per_month: z.number().min(0).max(200000).optional(),
  minimum_stay: z.number().int().min(1).max(365).default(1),
});

export const contactSchema = z.object({
  contact_name: z.string().min(2, "Name is required"),
  contact_email: z.string().email("Please enter a valid email"),
  contact_phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  preferred_contact: z.enum(["email", "phone", "both"]).default("email"),
});

export const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
  arrival_date: z.string().optional(),
  departure_date: z.string().optional(),
  horse_count: z.number().int().min(0).max(100).optional(),
});

export const alertSubscriptionSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ListingBasicsInput = z.infer<typeof listingBasicsSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type AccommodationInput = z.infer<typeof accommodationSchema>;
export type HorseFacilitiesInput = z.infer<typeof horseFacilitiesSchema>;
export type PricingInput = z.infer<typeof pricingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
