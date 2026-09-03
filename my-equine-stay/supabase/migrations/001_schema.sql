-- ============================================================
-- Migration 001: Core Schema
-- My Equine Stay Platform
-- ============================================================
-- Run this against a fresh Supabase project.
-- After running: execute 002_rls.sql, then 003_seed.sql
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- Helper: is_admin()
-- Used in RLS policies to check if current user is admin.
-- Avoids hardcoding any user IDs or emails.
-- ============================================================
create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language plpgsql
security definer
stable
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
end;
$$;

-- ============================================================
-- PROFILES
-- Extends auth.users — created automatically on signup via trigger
-- ============================================================
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null,
  email           text not null,
  full_name       text not null,
  avatar_url      text,
  phone           text,
  role            text not null default 'guest' check (role in ('guest', 'owner', 'admin')),
  is_suspended    boolean not null default false
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'guest')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- LISTINGS
-- ============================================================
create table public.listings (
  id                      uuid primary key default uuid_generate_v4(),
  created_at              timestamptz default now() not null,
  updated_at              timestamptz default now() not null,
  owner_id                uuid not null references public.profiles(id) on delete cascade,
  status                  text not null default 'draft'
                            check (status in ('draft', 'active', 'paused', 'expired')),
  is_featured             boolean not null default false,

  -- Plan
  plan                    text not null default 'standard'
                            check (plan in ('standard', 'premium')),

  -- Step 2: Property basics
  property_type           text not null,
  title                   text not null,
  address                 text not null,
  city                    text not null,
  state                   text not null default 'FL',
  zip_code                text not null,

  -- Step 3: Location (approximate — not exact address)
  latitude                numeric(9, 6),
  longitude               numeric(9, 6),

  -- Step 4: Accommodation
  bedrooms                integer not null default 0,
  bathrooms               numeric(3, 1) not null default 0,
  max_guests              integer not null default 1,
  acreage                 numeric(8, 2),
  amenities               text[] not null default '{}',
  languages_spoken        text[] not null default '{English}',
  pets_allowed            boolean not null default false,
  smoking_allowed         boolean not null default false,

  -- Step 5: Horse facilities
  stalls                  integer not null default 0,
  barns                   integer not null default 0,
  horse_capacity          integer not null default 0,
  horse_facilities        text[] not null default '{}',
  facility_notes          text,
  horse_description       text not null default '',

  -- Step 7: Pricing
  price_per_night         numeric(8, 2) not null default 0,
  price_per_week          numeric(8, 2),
  price_per_month         numeric(8, 2),
  minimum_stay            integer not null default 1,

  -- Step 8: Contact
  contact_name            text not null default '',
  contact_email           text not null default '',
  contact_phone           text,
  preferred_contact       text not null default 'email'
                            check (preferred_contact in ('email', 'phone', 'both')),

  -- Subscription
  subscription_expires_at timestamptz,
  views_count             integer not null default 0
);

create trigger listings_updated_at
  before update on public.listings
  for each row execute procedure public.set_updated_at();

-- Indexes for common queries
create index listings_owner_id_idx on public.listings(owner_id);
create index listings_status_idx on public.listings(status);
create index listings_city_idx on public.listings(city);
create index listings_property_type_idx on public.listings(property_type);
create index listings_featured_idx on public.listings(is_featured) where is_featured = true;

-- ============================================================
-- LISTING PHOTOS
-- ============================================================
create table public.listing_photos (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz default now() not null,
  listing_id    uuid not null references public.listings(id) on delete cascade,
  storage_path  text not null,  -- Supabase Storage path
  url           text not null,  -- Public URL
  sort_order    integer not null default 0,
  is_cover      boolean not null default false
);

create index listing_photos_listing_id_idx on public.listing_photos(listing_id);

-- Ensure only one cover photo per listing
create unique index listing_photos_cover_idx
  on public.listing_photos(listing_id)
  where is_cover = true;

-- ============================================================
-- INQUIRIES
-- ============================================================
create table public.inquiries (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz default now() not null,
  listing_id      uuid not null references public.listings(id) on delete cascade,
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  guest_name      text not null,
  guest_email     text not null,
  message         text not null,
  arrival_date    date,
  departure_date  date,
  horse_count     integer,
  is_read         boolean not null default false
);

create index inquiries_owner_id_idx on public.inquiries(owner_id);
create index inquiries_listing_id_idx on public.inquiries(listing_id);

-- ============================================================
-- FAVORITES
-- ============================================================
create table public.favorites (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz default now() not null,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  listing_id    uuid not null references public.listings(id) on delete cascade,
  unique(user_id, listing_id)
);

create index favorites_user_id_idx on public.favorites(user_id);

-- ============================================================
-- ALERT SUBSCRIPTIONS
-- ============================================================
create table public.alert_subscriptions (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz default now() not null,
  email       text not null unique,
  is_active   boolean not null default true
);

-- ============================================================
-- PAYMENTS
-- ============================================================
create table public.payments (
  id                        uuid primary key default uuid_generate_v4(),
  created_at                timestamptz default now() not null,
  owner_id                  uuid not null references public.profiles(id),
  listing_id                uuid not null references public.listings(id),
  stripe_session_id         text not null unique,
  stripe_payment_intent_id  text,
  amount                    integer not null,  -- in cents
  plan                      text not null check (plan in ('standard', 'premium')),
  status                    text not null default 'pending'
                              check (status in ('pending', 'completed', 'failed', 'refunded'))
);

create index payments_owner_id_idx on public.payments(owner_id);
create index payments_listing_id_idx on public.payments(listing_id);
create index payments_status_idx on public.payments(status);

-- ============================================================
-- SETTINGS
-- Platform configuration — read by the app, writable by admin only
-- ============================================================
create table public.settings (
  id          uuid primary key default uuid_generate_v4(),
  key         text not null unique,
  value       text not null,
  updated_at  timestamptz default now() not null
);

create trigger settings_updated_at
  before update on public.settings
  for each row execute procedure public.set_updated_at();

-- Default platform settings
insert into public.settings (key, value) values
  ('site_name', 'My Equine Stay'),
  ('site_tagline', 'Where horses stay too.'),
  ('contact_email', 'hello@myequinestay.com'),
  ('support_email', 'support@myequinestay.com'),
  ('logo_url', ''),
  ('primary_color', '#1e3a2f'),
  ('accent_color', '#c8922a'),
  ('shelter_name', 'Florida Equine Rescue Alliance'),
  ('shelter_url', 'https://example.com'),
  ('shelter_description', 'A portion of platform proceeds supports equine rescue organizations across Florida.');
