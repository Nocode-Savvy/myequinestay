-- ============================================================
-- Migration 003: Seed Data
-- ~10 realistic equestrian property listings in Florida
-- City focus: Ocala / Central Florida (horse capital of the world)
-- ============================================================
-- NOTE: Photos use placeholder URLs. In production, these would
-- point to real Supabase Storage URLs or Unsplash images.
-- ============================================================

-- Create a demo owner profile
-- NOTE: This inserts a profile directly. In production, owners sign up
-- via Supabase Auth. For demo, use the Supabase dashboard to create
-- a user and update the owner_id values below to match.

-- We'll use placeholder UUIDs that can be replaced after creating real users.
-- To create a real admin + owner for demo:
-- 1. Go to Supabase Dashboard > Authentication > Users > Add User
-- 2. Create: demo-owner@myequinestay.com / DemoOwner123!
-- 3. Create: admin@myequinestay.com / AdminPass123!
-- 4. Update profiles: SET role = 'admin' WHERE email = 'admin@myequinestay.com'

-- ============================================================
-- Sample listings using a service-role insert (bypasses RLS)
-- Replace owner_id values after creating demo users
-- ============================================================

do $$
declare
  demo_owner_id uuid;
begin
  -- Try to find or create a demo owner profile
  -- In a real setup, this user would exist from Auth signup
  select id into demo_owner_id from public.profiles
  where role in ('owner', 'admin')
  limit 1;

  -- Only seed if we have at least one owner/admin user
  if demo_owner_id is not null then

    -- ---- Listing 1: Equestrian Farm ----
    with l as (
      insert into public.listings (
        owner_id, status, plan, is_featured,
        property_type, title, address, city, state, zip_code,
        latitude, longitude,
        bedrooms, bathrooms, max_guests, acreage,
        amenities, pets_allowed,
        stalls, barns, horse_capacity, horse_facilities,
        horse_description,
        price_per_night, price_per_week, minimum_stay,
        contact_name, contact_email,
        subscription_expires_at
      ) values (
        demo_owner_id, 'active', 'premium', true,
        'equestrian_farm', 'Farm 5 Minutes from World Equestrian Center',
        '7890 NW 80th Ave', 'Ocala', 'FL', '34482',
        29.2218, -82.2073,
        3, 2, 6, 10,
        array['wifi','air_conditioning','washer_dryer','kitchen','parking','pet_friendly'],
        true,
        4, 1, 6, array['stalls','barn','pasture','wash_rack','tack_room','trailer_parking','cross_ties'],
        'Welcome to our peaceful country farm, just 5 minutes from the World Equestrian Center (WEC). This comfortable 3-bedroom, 2-bathroom home is perfect for equestrians, families, and groups looking for a relaxing stay. The property includes 4 stall barn, accommodations for up to 4 horses, and fenced pasture for turnout. Enjoy the privacy of a rural setting while being only minutes from shopping, restaurants, and equestrian events.',
        120, 700, 1,
        'Sarah Mitchell', 'sarah@mitchellfarm.com',
        now() + interval '90 days'
      ) returning id
    )
    insert into public.listing_photos (listing_id, storage_path, url, sort_order, is_cover)
    select l.id, 'seed/farm-wec-1.jpg',
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80',
      0, true from l
    union all
    select l.id, 'seed/farm-wec-2.jpg',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      1, false from l
    union all
    select l.id, 'seed/farm-wec-3.jpg',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      2, false from l;

    -- ---- Listing 2: Equestrian Farm ----
    with l as (
      insert into public.listings (
        owner_id, status, plan, is_featured,
        property_type, title, address, city, state, zip_code,
        latitude, longitude,
        bedrooms, bathrooms, max_guests, acreage,
        amenities, pets_allowed,
        stalls, barns, horse_capacity, horse_facilities,
        horse_description,
        price_per_night, price_per_week, minimum_stay,
        contact_name, contact_email,
        subscription_expires_at
      ) values (
        demo_owner_id, 'active', 'premium', true,
        'equestrian_farm', 'Golden Oak Manor — Private Equestrian Estate',
        '4521 SE 40th St', 'Ocala', 'FL', '34480',
        29.1564, -82.0891,
        4, 3, 8, 25,
        array['wifi','air_conditioning','kitchen','parking','pool','pet_friendly','bbq_grill'],
        true,
        6, 2, 8, array['stalls','barn','pasture','arena','round_pen','wash_rack','tack_room','trailer_parking','trail_access'],
        'A stunning private equestrian estate nestled on 25 acres of pristine Central Florida landscape. The main house features 4 bedrooms and a resort-style pool. For your horses, enjoy a full 6-stall center-aisle barn with rubber mats, automatic waterers, and a well-lit feed room. Adjacent to miles of private trails.',
        165, 950, 2,
        'James & Patricia Owens', 'info@goldenoakmanor.com',
        now() + interval '90 days'
      ) returning id
    )
    insert into public.listing_photos (listing_id, storage_path, url, sort_order, is_cover)
    select l.id, 'seed/golden-oak-1.jpg',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
      0, true from l
    union all
    select l.id, 'seed/golden-oak-2.jpg',
      'https://images.unsplash.com/photo-1553444836-bc6c8d340d56?w=800&q=80',
      1, false from l;

    -- ---- Listing 3: House ----
    with l as (
      insert into public.listings (
        owner_id, status, plan,
        property_type, title, address, city, state, zip_code,
        latitude, longitude,
        bedrooms, bathrooms, max_guests, acreage,
        amenities, pets_allowed,
        stalls, barns, horse_capacity, horse_facilities,
        horse_description,
        price_per_night, price_per_week, minimum_stay,
        contact_name, contact_email,
        subscription_expires_at
      ) values (
        demo_owner_id, 'active', 'standard',
        'house', 'The Bridle Gate — Country Home on 5 Acres',
        '1203 SW 95th Ave', 'Ocala', 'FL', '34476',
        29.1102, -82.2345,
        3, 2, 5, 5,
        array['wifi','air_conditioning','kitchen','parking','washer_dryer'],
        false,
        2, 1, 4, array['stalls','barn','pasture','water_access','hay_storage'],
        'Charming 3-bedroom country home with a 2-stall barn and 4 fenced acres of improved pasture. Perfect for couples or small families traveling with 1-4 horses. The barn features rubber matted stalls, automatic waterers, and a hay loft. Easy access to HITS and WEC.',
        75, 450, 2,
        'Tom Carlyle', 'tom@bridlegate.com',
        now() + interval '90 days'
      ) returning id
    )
    insert into public.listing_photos (listing_id, storage_path, url, sort_order, is_cover)
    select l.id, 'seed/bridle-gate-1.jpg',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      0, true from l;

    -- ---- Listing 4: Equestrian Farm ----
    with l as (
      insert into public.listings (
        owner_id, status, plan, is_featured,
        property_type, title, address, city, state, zip_code,
        latitude, longitude,
        bedrooms, bathrooms, max_guests, acreage,
        amenities, pets_allowed,
        stalls, barns, horse_capacity, horse_facilities,
        horse_description,
        price_per_night, price_per_week, minimum_stay,
        contact_name, contact_email,
        subscription_expires_at
      ) values (
        demo_owner_id, 'active', 'premium', true,
        'equestrian_farm', 'Marenella Oaks — Showstopper Ocala Farm',
        '8900 NE 35th St', 'Anthony', 'FL', '32617',
        29.3015, -82.1234,
        2, 2, 4, 15,
        array['wifi','air_conditioning','kitchen','parking','pet_friendly'],
        true,
        4, 1, 6, array['stalls','barn','pasture','arena','wash_rack','tack_room','trailer_parking'],
        'A showstopper property in the heart of horse country, just 20 minutes from the WEC. Our 4-stall barn has everything your show horses need — rubber mats, hot/cold wash rack, tack room with AC, and a full-size arena. The 2-bedroom cottage is newly renovated with a full kitchen and private screened porch overlooking the pasture.',
        91, 560, 3,
        'Elena Vasquez', 'elena@marenellaoaks.com',
        now() + interval '90 days'
      ) returning id
    )
    insert into public.listing_photos (listing_id, storage_path, url, sort_order, is_cover)
    select l.id, 'seed/marenella-1.jpg',
      'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=800&q=80',
      0, true from l
    union all
    select l.id, 'seed/marenella-2.jpg',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      1, false from l;

    -- ---- Listing 5: RV Hookup ----
    with l as (
      insert into public.listings (
        owner_id, status, plan,
        property_type, title, address, city, state, zip_code,
        latitude, longitude,
        bedrooms, bathrooms, max_guests, acreage,
        amenities, pets_allowed,
        stalls, barns, horse_capacity, horse_facilities,
        horse_description,
        price_per_night, minimum_stay,
        contact_name, contact_email,
        subscription_expires_at
      ) values (
        demo_owner_id, 'active', 'standard',
        'rv_hookup', 'Live Oak RV Pad — Full Hookup with 4 Stalls',
        '3344 NW Marion County Rd', 'Reddick', 'FL', '32686',
        29.3891, -82.2567,
        0, 0, 4, 8,
        array['parking','pet_friendly','water_access'],
        true,
        4, 1, 4, array['stalls','barn','pasture','water_access','trailer_parking'],
        'Full RV hookup (30/50 amp electric, water, septic) on a quiet 8-acre farm with 4 stalls available. Great for show circuit travelers heading to WEC, HITS, or FHJA events. Stalls include shavings and hay on request (fee). The property has a round pen and direct access to County Road for easy trailer maneuvering.',
        79, 1,
        'Mark & Linda Houser', 'liveoakrvpad@gmail.com',
        now() + interval '90 days'
      ) returning id
    )
    insert into public.listing_photos (listing_id, storage_path, url, sort_order, is_cover)
    select l.id, 'seed/rv-pad-1.jpg',
      'https://images.unsplash.com/photo-1532264523420-881a47db012d?w=800&q=80',
      0, true from l;

    -- ---- Listing 6: House ----
    with l as (
      insert into public.listings (
        owner_id, status, plan,
        property_type, title, address, city, state, zip_code,
        latitude, longitude,
        bedrooms, bathrooms, max_guests, acreage,
        amenities, pets_allowed,
        stalls, barns, horse_capacity, horse_facilities,
        horse_description,
        price_per_night, price_per_week, price_per_month, minimum_stay,
        contact_name, contact_email,
        subscription_expires_at
      ) values (
        demo_owner_id, 'active', 'standard',
        'house', 'White Pines Farm — Extended Stay Specialist',
        '2200 SE Maricamp Rd', 'Ocala', 'FL', '34471',
        29.1834, -82.0571,
        3, 2, 6, 10,
        array['wifi','air_conditioning','kitchen','parking','washer_dryer','pet_friendly','workspace'],
        true,
        10, 2, 12, array['stalls','barn','pasture','arena','wash_rack','tack_room','trailer_parking','trail_access','hay_storage'],
        'Our extended-stay specialty means we''re set up for weeks or months, not just nights. The 3-bedroom home is fully equipped for long-term comfort. The barn complex features 10 stalls across 2 barns, a full arena, and direct trail access to the Greenway. Weekly and monthly rates available.',
        130, 750, 2200, 3,
        'Christine Holloway', 'stay@whitepinesfarm.com',
        now() + interval '90 days'
      ) returning id
    )
    insert into public.listing_photos (listing_id, storage_path, url, sort_order, is_cover)
    select l.id, 'seed/white-pines-1.jpg',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&q=80',
      0, true from l;

    -- ---- Listing 7: Private Bedroom ----
    with l as (
      insert into public.listings (
        owner_id, status, plan,
        property_type, title, address, city, state, zip_code,
        latitude, longitude,
        bedrooms, bathrooms, max_guests, acreage,
        amenities, pets_allowed,
        stalls, barns, horse_capacity, horse_facilities,
        horse_description,
        price_per_night, minimum_stay,
        contact_name, contact_email,
        subscription_expires_at
      ) values (
        demo_owner_id, 'active', 'standard',
        'private_bedroom', 'Horse Haven at Niker Lane — Private Room + 3 Stalls',
        '500 Niker Lane', 'Ocala', 'FL', '34472',
        29.1640, -82.0325,
        1, 1, 2, 7,
        array['wifi','air_conditioning','kitchen','parking','pet_friendly'],
        true,
        3, 1, 3, array['stalls','barn','pasture','wash_rack','cross_ties'],
        'Private room in a working equestrian homestead. You''ll have your own entrance, private bathroom, and use of the common kitchen. Outside, 3 rubber-matted stalls await your horses, along with a wash rack and shaded paddock turnout. Perfect for solo competitors or couples.',
        55, 1,
        'Angela Rodriguez', 'angela@nikerlane.com',
        now() + interval '90 days'
      ) returning id
    )
    insert into public.listing_photos (listing_id, storage_path, url, sort_order, is_cover)
    select l.id, 'seed/niker-lane-1.jpg',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      0, true from l;

    -- ---- Listing 8: Pasture Rental ----
    with l as (
      insert into public.listings (
        owner_id, status, plan,
        property_type, title, address, city, state, zip_code,
        latitude, longitude,
        bedrooms, bathrooms, max_guests, acreage,
        amenities, pets_allowed,
        stalls, barns, horse_capacity, horse_facilities,
        horse_description,
        price_per_night, minimum_stay,
        contact_name, contact_email,
        subscription_expires_at
      ) values (
        demo_owner_id, 'active', 'standard',
        'pasture_rental', 'WildBit Pasture Rental — RV-Friendly 6 Stalls',
        '8801 SW 27th Ave', 'Reddick', 'FL', '32686',
        29.3721, -82.2989,
        0, 0, 0, 12,
        array['parking','water_access'],
        true,
        6, 1, 8, array['stalls','barn','pasture','water_access','trailer_parking','hay_storage'],
        'Horse-only property — no house accommodation, but perfect if you have your own trailer or RV (dry camping). 6 stalls available, 3 fenced paddocks, and 12 acres of improved Bermuda grass pasture. Water access at every stall. Ideal for layovers or longer stays.',
        50, 1,
        'Billy Watkins', 'billy@wildbitfarm.com',
        now() + interval '90 days'
      ) returning id
    )
    insert into public.listing_photos (listing_id, storage_path, url, sort_order, is_cover)
    select l.id, 'seed/wildbit-1.jpg',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
      0, true from l;

    -- ---- Listing 9: Barn / Stall ----
    with l as (
      insert into public.listings (
        owner_id, status, plan,
        property_type, title, address, city, state, zip_code,
        latitude, longitude,
        bedrooms, bathrooms, max_guests, acreage,
        amenities, pets_allowed,
        stalls, barns, horse_capacity, horse_facilities,
        horse_description,
        price_per_night, minimum_stay,
        contact_name, contact_email,
        subscription_expires_at
      ) values (
        demo_owner_id, 'active', 'standard',
        'barn_stall', 'Ironwood Stable — Show Circuit Barn',
        '12500 NW 80th Ave', 'Reddick', 'FL', '32686',
        29.4012, -82.2156,
        0, 0, 0, 18,
        array['parking','water_access','security_cameras'],
        false,
        12, 2, 12, array['stalls','barn','arena','round_pen','wash_rack','tack_room','trailer_parking','cross_ties','night_check'],
        'Professional show barn offering nightly and weekly stabling for visiting competitors. 12 12x12 stalls with rubber mats, automatic waterers, and fans. Full-time barn manager on site. Night check included. 5 minutes from HITS Ocala. Hay and grain available at additional cost.',
        40, 1,
        'Donna Ironwood', 'donna@ironwoodstable.com',
        now() + interval '90 days'
      ) returning id
    )
    insert into public.listing_photos (listing_id, storage_path, url, sort_order, is_cover)
    select l.id, 'seed/ironwood-1.jpg',
      'https://images.unsplash.com/photo-1560870899-c3c83b2c7c12?w=800&q=80',
      0, true from l;

    -- ---- Listing 10: Equestrian Farm (Ocala area) ----
    with l as (
      insert into public.listings (
        owner_id, status, plan, is_featured,
        property_type, title, address, city, state, zip_code,
        latitude, longitude,
        bedrooms, bathrooms, max_guests, acreage,
        amenities, pets_allowed,
        stalls, barns, horse_capacity, horse_facilities,
        horse_description,
        price_per_night, price_per_week, minimum_stay,
        contact_name, contact_email,
        subscription_expires_at
      ) values (
        demo_owner_id, 'active', 'premium', true,
        'equestrian_farm', 'Serenity Pines — Family Farm Near HITS',
        '3000 SW 60th Ave', 'Ocala', 'FL', '34476',
        29.0988, -82.2012,
        4, 2.5, 8, 20,
        array['wifi','air_conditioning','kitchen','parking','washer_dryer','pet_friendly','bbq_grill','fireplace'],
        true,
        8, 2, 10, array['stalls','barn','pasture','arena','round_pen','wash_rack','tack_room','trailer_parking','trail_access','feed_included','hay_storage','night_check'],
        'Our flagship property — a beautifully maintained 20-acre farm with two barns totaling 8 stalls. The spacious 4-bedroom farmhouse features a wraparound porch with pastoral views, a wood-burning fireplace, and a full country kitchen. Feed and hay included in the stall rate. 8 minutes from HITS Champions Show Grounds.',
        195, 1200, 2,
        'Robert & Anne Pines', 'stay@serenitypinesfarm.com',
        now() + interval '90 days'
      ) returning id
    )
    insert into public.listing_photos (listing_id, storage_path, url, sort_order, is_cover)
    select l.id, 'seed/serenity-1.jpg',
      'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800&q=80',
      0, true from l
    union all
    select l.id, 'seed/serenity-2.jpg',
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80',
      1, false from l
    union all
    select l.id, 'seed/serenity-3.jpg',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
      2, false from l;

  end if;
end;
$$;
