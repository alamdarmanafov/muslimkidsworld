// lib/supabaseAdmin.ts
//
// Typed Supabase client for the admin dashboard (app/admin/*). Mirrors
// mobile/src/lib/supabase.ts's pattern (env-based config, one cached
// client) but reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_
// ANON_KEY, which is how Next.js inlines browser-visible env vars (the
// EXPO_PUBLIC_ prefix mobile/ uses is an Expo-specific convention, not
// a Next.js one). Set these in a root .env.local — same project URL
// and anon key mobile/.env and admin/index.html's setup screen use;
// see supabase/README.md for where the values come from.
//
// The anon key is safe to expose in the browser bundle — RLS is what
// actually protects data, and admin writes are gated by the
// is_admin() Postgres function (0015_admin_panel.sql), checked by
// components/admin/AdminGate.tsx before any admin page renders.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type TypedSupabaseClient = SupabaseClient<Database>;

let cachedClient: TypedSupabaseClient | null = null;

export function getSupabaseAdminClient(): TypedSupabaseClient {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Set them in a root .env.local — see supabase/README.md for where the values come from.",
    );
  }

  cachedClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return cachedClient;
}
