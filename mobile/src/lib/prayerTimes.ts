// mobile/src/lib/prayerTimes.ts
//
// Computes today's 5 daily prayer times for a parent-chosen city
// (app/parent/prayer-city.tsx, families.prayer_city_id) — shown on
// app/child/salah.tsx next to each prayer's name. Calculated
// on-device with adhan (a well-established, pure-JS implementation of
// the standard astronomical formulas — no server round trip, no API
// key), using the Muslim World League method, a widely-used global
// default; this app doesn't offer a per-family calculation-method
// choice, to keep the setting to the one thing that actually varies
// city to city.
//
// Each city stores an IANA timezone name (not a fixed UTC offset) so
// this stays correct across a DST change without any extra logic —
// the Date objects adhan returns are real UTC instants; only the
// *display* formatting below needs to know the city's zone.

import { CalculationMethod, Coordinates, PrayerTimes as AdhanPrayerTimes } from "adhan";
import citiesData from "../data/prayerCities.json";

export type PrayerCity = { id: string; lat: number; lon: number; timezone: string };
const cities = citiesData as PrayerCity[];

export function getPrayerCities(): PrayerCity[] {
  return cities;
}

export function findPrayerCity(cityId: string | null): PrayerCity | null {
  if (!cityId) return null;
  return cities.find((c) => c.id === cityId) ?? null;
}

export type TodayPrayerTimes = {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

/** Today's prayer times for `city`, formatted as "HH:MM" in the city's own local time. */
export function computeTodayPrayerTimes(city: PrayerCity): TodayPrayerTimes {
  const coordinates = new Coordinates(city.lat, city.lon);
  const params = CalculationMethod.MuslimWorldLeague();
  const times = new AdhanPrayerTimes(coordinates, new Date(), params);

  const format = (d: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: city.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);

  return {
    fajr: format(times.fajr),
    dhuhr: format(times.dhuhr),
    asr: format(times.asr),
    maghrib: format(times.maghrib),
    isha: format(times.isha),
  };
}
