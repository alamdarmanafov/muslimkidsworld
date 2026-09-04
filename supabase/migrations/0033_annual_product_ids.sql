-- 0033_annual_product_ids.sql
--
-- 0031_annual_pricing.sql switched both plans to annual billing but
-- left their apple_product_id values naming ".monthly" products
-- (0016_iap.sql's seed) — not a functional bug (no App Store Connect
-- product exists yet with either name; this column is still null in
-- practice pre-launch), but stale/misleading placeholder naming that
-- would send whoever eventually sets this up chasing the wrong
-- product id. Renamed to match the real annual billing period.
update public.subscription_plans
set apple_product_id = 'com.muslimkidsworld.app.single.yearly'
where slug = 'single' and apple_product_id = 'com.muslimkidsworld.app.single.monthly';

update public.subscription_plans
set apple_product_id = 'com.muslimkidsworld.app.family.yearly'
where slug = 'family' and apple_product_id = 'com.muslimkidsworld.app.family.monthly';
