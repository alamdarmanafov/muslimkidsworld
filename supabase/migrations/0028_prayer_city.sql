-- 0028_prayer_city.sql
--
-- The city a parent picks for prayer-time calculation
-- (app/parent/prayer-city.tsx) — used by app/child/salah.tsx to show
-- today's 5 prayer times. Deliberately a hand-picked city from
-- mobile/src/data/prayerCities.json rather than GPS: no location
-- permission to request, nothing to explain to a parent about why a
-- kids' app wants their location, same reasoning as this app already
-- having no other geo/tz data anywhere (see families.timezone_offset_
-- minutes' sibling comment in 0026_quiet_hours.sql).

alter table public.families
  add column if not exists prayer_city_id text;
