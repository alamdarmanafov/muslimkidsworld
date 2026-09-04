-- 0031_annual_pricing.sql
--
-- Switches the two subscription plans from monthly to annual billing:
-- Single Child $4.99/month -> $29.99/year, Family $7.99/month ->
-- $49.99/year. 0005_seed_content.sql's own INSERT was updated to
-- match (so a fresh install seeds the right numbers from the start),
-- but that migration's `on conflict (slug) do nothing` means it can
-- never retroactively fix a project that already ran it — this
-- migration is that retroactive fix, an UPDATE keyed on the same
-- `slug` values.
update public.subscription_plans
set price_cents = 2999, period = 'year'
where slug = 'single';

update public.subscription_plans
set price_cents = 4999, period = 'year'
where slug = 'family';
