# System Architecture — My Equine Stay

## 1. Overview & Master Template Philosophy

**My Equine Stay** is a production-grade, resellable SaaS marketplace engineered to connect horse owners and equestrian travelers with specialized accommodations across Florida (equestrian farms, private homes with stalls, barns, RV pads, and pasture rentals).

This codebase is architected as a **reusable master template**. Nothing buyer-specific is hardcoded. Any future operator can re-brand and deploy an independent copy of this platform by setting their environment variables and populating the database `settings` table.

---

## 2. Technical Stack

- **Framework**: Next.js 14+ (App Router) with React 19
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS with custom HSL brand color tokens (warm cream, deep forest green, equestrian gold/amber)
- **Database & Auth**: Supabase (PostgreSQL with Row-Level Security, Supabase Auth, Storage)
- **Payments**: Stripe Checkout with test mode fallback and webhook reconciliation
- **Maps**: Mapbox GL JS with approximate location radius protections
- **Animations**: Framer Motion for micro-interactions, page transitions, accordion accordions, and scroll-reveal triggers
- **Icons**: Lucide React

---

## 3. Directory Structure

```
my-equine-stay/
├── app/
│   ├── (auth)/                # Signup & Login with role selector & password strength
│   ├── (dashboard)/           # Owner Portal & Guest Saved Stays
│   │   ├── dashboard/         # Owner metrics, listing control & direct inquiry inbox
│   │   └── favorites/         # Guest saved properties
│   ├── (marketing)/
│   │   ├── browse/            # Interactive filterable grid & Mapbox map
│   │   ├── listings/[id]/     # Comprehensive listing detail, calendar & inquiry
│   │   ├── faq/               # Categorized animated FAQ
│   │   ├── contact/           # Direct contact channels & support
│   │   ├── alerts/            # Email alerts subscription & unsubscribe
│   │   └── legal/             # Terms, Privacy Policy & FL Equine Liability Notice
│   ├── admin/                 # Role-gated Admin Panel
│   │   ├── users/             # User & role management, suspension
│   │   ├── listings/          # Moderation & featured stay toggle
│   │   ├── payments/          # Stripe transaction log & refund trigger
│   │   ├── reports/           # Flagged listing moderation center
│   │   └── settings/          # Live config & branding customization editor
│   ├── api/
│   │   ├── alerts/subscribe/  # Listing notification subscriber endpoint
│   │   ├── inquiries/         # Direct owner inquiry processor
│   │   └── stripe/            # Checkout session creator & webhook listener
│   ├── globals.css            # Custom brand tokens & typography utilities
│   └── layout.tsx             # Root layout with responsive Navbar & Footer
├── components/
│   └── ui/                    # Reusable Button, Input, Modal, Badge, Navbar, Footer
├── lib/
│   ├── config.ts              # Single source of truth for platform configuration
│   ├── email.ts               # Email notification abstraction (Resend integration ready)
│   ├── stripe/                # Stripe SDK & Pricing plans
│   ├── supabase/              # SSR Browser, Server & Admin client helpers
│   └── validations/           # Zod schemas for all forms
├── supabase/
│   └── migrations/            # Version-controlled SQL migrations & RLS
└── docs/                      # Architecture, deployment & security guides
```

---

## 4. Key Architectural Decisions (Documented per Brief)

1. **Working Mapbox Integration**: Replaced the broken Google Maps implementation from the legacy site with a reliable Mapbox GL JS setup. Displays approximate area markers to protect property owner and resident horse biosecurity.
2. **0% Platform Booking Commission Model**: Listings operate on a flat 3-month subscription ($59 Standard or $89 Premium). Guests message owners directly via the embedded inquiry form with zero commission deducted from stays.
3. **Live Immediate Activation**: Upon successful checkout through Stripe, listings transition to `active` status immediately. Administrators retain the ability to unpublish, feature, or delete any listing from `/admin`.
4. **Resilient Offline / Demo Mode**: The application gracefully detects when live Supabase or Stripe credentials are absent, providing realistic sample data and test checkout simulations so that demonstrations never fail.
5. **Config-Driven White-Labeling**: Colors, site name, tagline, support emails, and charitable partners can be updated in real time via the Admin settings panel without code modifications.
