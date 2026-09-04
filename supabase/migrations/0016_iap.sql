-- 0016_iap.sql
-- Maps subscription_plans to real App Store product identifiers so
-- verify-apple-purchase (a new edge function) can turn "Apple says
-- transaction X is for product Y" into "which of our plans is that".
--
-- The product IDs below are a naming convention (bundle id + plan
-- slug + period) — they must be created in App Store Connect with
-- these exact strings before purchases can go through. See
-- supabase/README.md's "In-app purchases (iOS)" section.

alter table public.subscription_plans
  add column if not exists apple_product_id text unique;

update public.subscription_plans
  set apple_product_id = 'com.muslimkidsworld.app.single.yearly'
  where slug = 'single' and apple_product_id is null;

update public.subscription_plans
  set apple_product_id = 'com.muslimkidsworld.app.family.yearly'
  where slug = 'family' and apple_product_id is null;
