// mobile/src/lib/world.ts
//
// Client side of the "Muslim World" explore feature
// (app/child/world.tsx, app/child/world/[id].tsx) — site content
// itself is mobile/src/data/mock.ts `worldSites` + i18n
// content.worldSites.*, same pattern as Stories/Dua (see
// supabase/README.md). The only thing that needs the backend is
// recording a visit, for the mosque-visitor achievement.

import { getDeviceId } from "./deviceBinding";
import { getSupabaseClient } from "./supabase";

/** Records that a child opened a "Muslim World" site (mock.ts WorldSite.id). Fails silently. */
export async function markWorldVisited(worldSlug: string): Promise<void> {
  try {
    const deviceId = await getDeviceId();
    const { error } = await getSupabaseClient().functions.invoke("mark-world-visit", {
      body: { deviceId, worldSlug },
    });
    if (error && __DEV__) {
      console.warn("markWorldVisited failed", error.message);
    }
  } catch (err) {
    if (__DEV__) {
      console.warn("markWorldVisited failed", err instanceof Error ? err.message : String(err));
    }
  }
}
