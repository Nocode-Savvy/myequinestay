# Buyer Deployment Guide — My Equine Stay

Follow these step-by-step instructions to deploy a brand-new, isolated instance of the **My Equine Stay** platform for a new client or buyer.

---

## 1. Prerequisites

- A **GitHub** account
- A **Supabase** account (Free or Pro tier)
- A **Stripe** account (with Checkout & Webhooks enabled)
- A **Mapbox** account (for interactive map view)
- A **Vercel** account

---

## 2. Step 1: Clone Repository & Create New Project

1. Clone or duplicate this repository to the new buyer's GitHub organization:
   ```bash
   git clone https://github.com/your-org/my-equine-stay.git client-equine-stay
   cd client-equine-stay
   ```
2. Install dependencies:
   ```bash
   bun install  # or npm install
   ```

---

## 3. Step 2: Supabase Database Setup

1. Log in to [Supabase](https://supabase.com) and create a **New Project**.
2. Note your **Project URL**, **Anon Key**, and **Service Role Key** under `Project Settings > API`.
3. Open the **SQL Editor** in Supabase and run the migration files in order:
   - Run `supabase/migrations/001_schema.sql` (Creates tables, triggers, and functions)
   - Run `supabase/migrations/002_rls.sql` (Applies Row-Level Security policies)
   - (Optional) Run `supabase/migrations/003_seed.sql` (Populates initial sample Florida listings)
4. Go to `Storage` and create a public bucket named `listing-photos`.

---

## 4. Step 3: Stripe Billing Setup

1. Open the [Stripe Dashboard](https://dashboard.stripe.com).
2. Create two Products with Recurring or One-Time pricing:
   - **Standard Plan**: $59 (3-month interval)
   - **Premium Plan**: $89 (3-month interval)
3. Copy the Price IDs (`price_...`).
4. Set up a Webhook endpoint pointing to:
   `https://your-domain.vercel.app/api/stripe/webhook`
   - Listen for event: `checkout.session.completed`
   - Copy the Signing Secret (`whsec_...`).

---

## 5. Step 4: Mapbox Token

1. Sign up at [Mapbox](https://account.mapbox.com).
2. Generate a public access token (`pk.ey...`).

---

## 6. Step 5: Vercel Deployment

1. Import the GitHub repository into Vercel.
2. Under **Environment Variables**, add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your_anon_key]
   SUPABASE_SERVICE_ROLE_KEY=[your_service_role_key]

   NEXT_PUBLIC_MAPBOX_TOKEN=pk.[your_token]

   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_STANDARD=price_...
   STRIPE_PRICE_PREMIUM=price_...

   NEXT_PUBLIC_SITE_NAME=Buyer Brand Name
   NEXT_PUBLIC_SITE_URL=https://buyerdomain.com
   NEXT_PUBLIC_CONTACT_EMAIL=hello@buyerdomain.com
   NEXT_PUBLIC_SUPPORT_EMAIL=support@buyerdomain.com
   ```
3. Click **Deploy**. Vercel will build and publish the live production application.
