// mobile/src/lib/supabase.ts
//
// Typed Supabase client factory for the mobile app. Used by
// app/parent-auth.tsx (email/password auth), app/child-code.tsx and
// app/parent/family-code.tsx (the redeem-family-code /
// generate-family-code edge functions). Most screens still read from
// mobile/src/data/mock.ts — replacing that with real queries is the
// ongoing follow-up, not something this file needs to change for.
//
// Reads EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY, which
// Expo inlines automatically for any env var prefixed EXPO_PUBLIC_
// (see https://docs.expo.dev/versions/v57.0.0/guides/environment-variables/).
// Set them in mobile/.env — see supabase/README.md for where the
// values come from.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Builds a fresh, typed Supabase client configured for React Native:
 * session tokens are persisted in AsyncStorage (the same storage the
 * app already uses for device binding, see ./deviceBinding.ts) and
 * URL-based session detection is disabled since there is no browser
 * redirect flow on-device.
 *
 * Throws if the required env vars aren't set, rather than returning a
 * client that will fail confusingly on its first request.
 */
export function createSupabaseClient(): TypedSupabaseClient {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY. " +
        "Set them in mobile/.env — see supabase/README.md for where the values come from.",
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

let cachedClient: TypedSupabaseClient | null = null;

/**
 * Lazily creates and reuses a single Supabase client for the app's
 * lifetime. Prefer this over calling createSupabaseClient() directly
 * so the whole app shares one auth session.
 */
export function getSupabaseClient(): TypedSupabaseClient {
  if (!cachedClient) {
    cachedClient = createSupabaseClient();
  }
  return cachedClient;
}
