/**
 * Database type definitions for Supabase.
 *
 * These are hand-authored to match the migration schema in
 * supabase/migrations/001_schema.sql.
 *
 * For production use, generate these automatically with:
 *   bunx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "guest" | "owner" | "admin";
export type ListingStatus = "draft" | "active" | "paused" | "expired";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          role: UserRole;
          is_suspended: boolean;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          role?: UserRole;
          is_suspended?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      listings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          owner_id: string;
          status: ListingStatus;
          is_featured: boolean;
          // Step 1: Plan
          plan: "standard" | "premium";
          // Step 2: Basics
          property_type: string;
          title: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          // Step 3: Location
          latitude: number | null;
          longitude: number | null;
          // Step 4: Accommodation
          bedrooms: number;
          bathrooms: number;
          max_guests: number;
          acreage: number | null;
          amenities: string[];
          languages_spoken: string[];
          pets_allowed: boolean;
          smoking_allowed: boolean;
          // Step 5: Horse facilities
          stalls: number;
          barns: number;
          horse_capacity: number;
          horse_facilities: string[];
          facility_notes: string | null;
          horse_description: string;
          // Step 7: Pricing
          price_per_night: number;
          price_per_week: number | null;
          price_per_month: number | null;
          minimum_stay: number;
          // Step 8: Contact
          contact_name: string;
          contact_email: string;
          contact_phone: string | null;
          preferred_contact: "email" | "phone" | "both";
          // Subscription
          subscription_expires_at: string | null;
          views_count: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["listings"]["Row"],
          "id" | "created_at" | "updated_at" | "views_count"
        > & {
          id?: string;
          views_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
      };
      listing_photos: {
        Row: {
          id: string;
          created_at: string;
          listing_id: string;
          storage_path: string;
          url: string;
          sort_order: number;
          is_cover: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["listing_photos"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["listing_photos"]["Insert"]>;
      };
      inquiries: {
        Row: {
          id: string;
          created_at: string;
          listing_id: string;
          owner_id: string;
          guest_name: string;
          guest_email: string;
          message: string;
          arrival_date: string | null;
          departure_date: string | null;
          horse_count: number | null;
          is_read: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["inquiries"]["Row"],
          "id" | "created_at" | "is_read"
        >;
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Insert"]>;
      };
      favorites: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          listing_id: string;
        };
        Insert: Omit<Database["public"]["Tables"]["favorites"]["Row"], "id" | "created_at">;
        Update: never;
      };
      alert_subscriptions: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          is_active: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["alert_subscriptions"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["alert_subscriptions"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          created_at: string;
          owner_id: string;
          listing_id: string;
          stripe_session_id: string;
          stripe_payment_intent_id: string | null;
          amount: number;
          plan: "standard" | "premium";
          status: PaymentStatus;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["settings"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}

// Convenience row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Listing = Database["public"]["Tables"]["listings"]["Row"];
export type ListingPhoto = Database["public"]["Tables"]["listing_photos"]["Row"];
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];

// Listing with photos (common join)
export type ListingWithPhotos = Listing & {
  listing_photos: ListingPhoto[];
  profiles?: Pick<Profile, "full_name" | "avatar_url">;
};
