# Security Architecture & Policies — My Equine Stay

## 1. Authentication & Authorization

- **Supabase Auth**: Password verification, session rotation, and token issuance are handled securely by Supabase.
- **Server-Enforced Role-Based Access Control (RBAC)**:
  - User roles (`guest`, `owner`, `admin`) are stored in the PostgreSQL `profiles` table.
  - The PostgreSQL function `is_admin()` verifies administrative authorization at the database layer via security-definer semantics.
  - Next.js Edge Middleware (`middleware.ts`) inspects sessions and rejects unauthenticated or unauthorized access to `/admin` routes.

---

## 2. Row Level Security (RLS) Policies

All 8 application tables (`profiles`, `listings`, `listing_photos`, `inquiries`, `favorites`, `alert_subscriptions`, `payments`, `settings`) have strict Row-Level Security enabled:

1. **Listings**:
   - `SELECT`: Public access for `status = 'active'`; Owners access all their own; Admins access all.
   - `INSERT / UPDATE / DELETE`: Restricted to verified owners (`auth.uid() = owner_id`) and admins.
2. **Inquiries**:
   - `INSERT`: Publicly accessible for guest communications.
   - `SELECT / UPDATE`: Restricted to the specific listing host (`auth.uid() = owner_id`) and administrators.
3. **Payments**:
   - `INSERT`: Restricted exclusively to `SUPABASE_SERVICE_ROLE_KEY` called from the Stripe webhook listener.
   - `SELECT`: Restricted to paying owners and admins.

---

## 3. Data Validation & Sanitization

- **Zod Schemas**: Every client and server endpoint validates payloads using Zod (`lib/validations/schemas.ts`).
- **Password Enforcement**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 numeric digit
  - At least 1 special character
- **Street Address Privacy**: Physical street addresses and gate access details are shielded from public API queries. Only approximate coordinates and city zones are rendered in browse views.

---

## 4. Stripe Security

- **No Cardholder Data Storage**: Credit card numbers and payment tokens are processed directly inside Stripe-hosted checkout elements and never touch application database servers.
- **Webhook Signature Verification**: The `/api/stripe/webhook` endpoint cryptographically verifies the `stripe-signature` header against `STRIPE_WEBHOOK_SECRET` before processing.

---

## 5. Admin Promotion & Access Control

### No Self-Serve Admin Signup
There is strictly **no public or self-serve administrative registration**. Any user registering via `/auth`, `/signup`, or `/login` is automatically provisioned as either a `guest` or `owner` role via the PostgreSQL `handle_new_user()` trigger.

### Promoting a User to Admin
Administrative privileges must be granted manually by an authorized database administrator or Supabase project owner:

1. The target user must first create a standard account at `/auth`.
2. In the **Supabase SQL Editor** (or via a secure migration / service-role execution), execute:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'authorized_admin@myequinestay.com';
   ```
3. To verify the promotion was applied:
   ```sql
   SELECT id, email, full_name, role
   FROM public.profiles
   WHERE role = 'admin';
   ```
4. Upon next login (or session token refresh), the user will:
   - Gain access to the `/admin` suite (`/admin`, `/admin/users`, `/admin/listings`, `/admin/payments`, `/admin/reports`, `/admin/settings`).
   - See the administrative link in the navigation footer.
   - Pass database-level RLS checks via `public.is_admin()`.

### Multi-Layer Admin Defense Architecture
Admin authorization is enforced across **three independent layers** (Defense-in-Depth):

1. **Edge Middleware Guard (`middleware.ts` / `lib/supabase/middleware.ts`)**:
   - Inspects incoming requests to `/admin/*`.
   - If unauthenticated, immediately redirects to `/auth?mode=signin&redirectTo=/admin`.
   - If authenticated but `profile.role !== 'admin'`, immediately redirects to `/dashboard?unauthorized=admin`.
2. **Server Component Guard (`app/admin/layout.tsx`)**:
   - Executes server-side with cookie-based session extraction.
   - Re-verifies user profile role against the database before any admin layouts or child components are evaluated.
3. **Database Row Level Security (RLS) (`002_rls.sql`)**:
   - All admin reads, status changes, listing suspensions, user bans, and settings modifications call `public.is_admin()`.
   - Even if frontend or middleware layers were compromised, PostgreSQL rejects non-admin queries at the data level.

