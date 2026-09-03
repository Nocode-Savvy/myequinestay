-- ============================================================
-- Migration 002: Row Level Security Policies
-- My Equine Stay Platform
-- ============================================================
-- All tables use RLS. Users can only read/write their own data.
-- Admins have elevated access via is_admin() function.
-- NEVER trust client-side role checks — RLS is the auth layer.
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.inquiries enable row level security;
alter table public.favorites enable row level security;
alter table public.alert_subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.settings enable row level security;

-- ============================================================
-- PROFILES
-- ============================================================
-- Anyone can view profiles (needed for listing owner display)
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

-- Users can update their own profile
create policy "profiles_own_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can update any profile (for suspend/role-change)
create policy "profiles_admin_update"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- LISTINGS
-- ============================================================
-- Public can read active listings
create policy "listings_public_read"
  on public.listings for select
  using (status = 'active');

-- Owners can read their own listings (any status)
create policy "listings_owner_read"
  on public.listings for select
  using (auth.uid() = owner_id);

-- Admins can read all listings
create policy "listings_admin_read"
  on public.listings for select
  using (public.is_admin());

-- Owners can insert their own listings
create policy "listings_owner_insert"
  on public.listings for insert
  with check (auth.uid() = owner_id);

-- Owners can update their own listings
create policy "listings_owner_update"
  on public.listings for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Owners can delete their own listings
create policy "listings_owner_delete"
  on public.listings for delete
  using (auth.uid() = owner_id);

-- Admins can update any listing (feature/unfeature/approve/reject)
create policy "listings_admin_update"
  on public.listings for update
  using (public.is_admin());

-- Admins can delete any listing
create policy "listings_admin_delete"
  on public.listings for delete
  using (public.is_admin());

-- ============================================================
-- LISTING PHOTOS
-- ============================================================
-- Photos follow the same visibility as their listing
create policy "photos_public_read"
  on public.listing_photos for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'active'
    )
  );

-- Owners can read photos for their own listings
create policy "photos_owner_read"
  on public.listing_photos for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

-- Owners can insert/update/delete photos for their own listings
create policy "photos_owner_insert"
  on public.listing_photos for insert
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

create policy "photos_owner_update"
  on public.listing_photos for update
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

create policy "photos_owner_delete"
  on public.listing_photos for delete
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

-- Admins can do anything with photos
create policy "photos_admin_all"
  on public.listing_photos for all
  using (public.is_admin());

-- ============================================================
-- INQUIRIES
-- ============================================================
-- Anyone can submit an inquiry (guest contact form — no auth required)
create policy "inquiries_public_insert"
  on public.inquiries for insert
  with check (true);

-- Owners can read inquiries for their listings
create policy "inquiries_owner_read"
  on public.inquiries for select
  using (auth.uid() = owner_id);

-- Owners can mark inquiries as read
create policy "inquiries_owner_update"
  on public.inquiries for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Admins can read and manage all inquiries
create policy "inquiries_admin_all"
  on public.inquiries for all
  using (public.is_admin());

-- ============================================================
-- FAVORITES
-- ============================================================
-- Users can read their own favorites
create policy "favorites_own_read"
  on public.favorites for select
  using (auth.uid() = user_id);

-- Users can add favorites
create policy "favorites_own_insert"
  on public.favorites for insert
  with check (auth.uid() = user_id);

-- Users can remove their own favorites
create policy "favorites_own_delete"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Admins can read all
create policy "favorites_admin_read"
  on public.favorites for select
  using (public.is_admin());

-- ============================================================
-- ALERT SUBSCRIPTIONS
-- ============================================================
-- Anyone can subscribe (no auth required)
create policy "alerts_public_insert"
  on public.alert_subscriptions for insert
  with check (true);

-- Admins can read/manage all subscriptions
create policy "alerts_admin_all"
  on public.alert_subscriptions for all
  using (public.is_admin());

-- ============================================================
-- PAYMENTS
-- ============================================================
-- Users can read their own payments
create policy "payments_own_read"
  on public.payments for select
  using (auth.uid() = owner_id);

-- Payment records inserted by service role (webhook) only
-- No client insert policy — only SUPABASE_SERVICE_ROLE_KEY can insert

-- Admins can read all payments
create policy "payments_admin_all"
  on public.payments for all
  using (public.is_admin());

-- ============================================================
-- SETTINGS
-- ============================================================
-- Public can read settings (needed for branding in UI)
create policy "settings_public_read"
  on public.settings for select
  using (true);

-- Only admins can modify settings
create policy "settings_admin_write"
  on public.settings for all
  using (public.is_admin())
  with check (public.is_admin());
