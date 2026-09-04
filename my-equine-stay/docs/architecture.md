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

## 5. Subscription Billing & Proration Policy

### Flat 3-Month Plan Tiers
- **Standard**: $59 per 3-month cycle ($19.99/mo equivalent)
- **Premium**: $89 per 3-month cycle ($29.99/mo equivalent, includes homepage feature badge)

### Plan Switching & Proration Policy (`proration_behavior: 'none'`)
When a property owner transitions between Standard and Premium tiers:
1. **No Stripe Proration**: `proration_behavior: 'none'` is strictly enforced on all `stripe.subscriptions.update()` requests (`/api/listings/[id]/change-plan`).
2. **No Partial Credits or Retroactive Invoices**: Stripe will not calculate partial daily credits or generate mid-cycle prorated line items. The new rate takes effect cleanly without fractional charge complications.
3. **Marketplace Feature Synchronization**: The listing's `plan` and `is_featured` flags update immediately in the database upon plan change, ensuring instant marketing visibility without billing distortion.

### Listing Deletion & Subscription Termination
When an owner deletes a property listing from their dashboard:
1. **Immediate Cancellation**: The platform calls `/api/listings/[id]/cancel-subscription`, retrieving the listing's Stripe subscription and immediately invoking `stripe.subscriptions.cancel(subscriptionId)`.
2. **Owner Warning Confirmation**: Owners are prompted with an explicit confirmation dialog: *"Deleting this listing will immediately cancel its active subscription. This cannot be undone."*
3. **Graceful Fallback**: If Stripe is unconfigured or operating in local development mode, the cancellation gracefully logs a notice and allows deletion to complete without blocking testing workflows.

