// lib/database.types.ts
//
// Hand-written to match supabase/migrations/*.sql — scoped to just the
// tables the admin dashboard (app/admin/*) actually reads/writes,
// unlike mobile/src/lib/database.types.ts which covers the full app.
// Once a real Supabase project exists, regenerate with:
//
//   supabase gen types typescript --local > lib/database.types.ts
//
// (keeping this file's shape) and hand-written status goes away.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type SubscriptionStatus = "trial" | "active" | "cancelled" | "expired";

export type Database = {
  public: {
    Tables: {
      families: {
        Row: {
          id: string;
          name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      parents: {
        Row: {
          id: string;
          family_id: string;
          full_name: string | null;
          email: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      children: {
        Row: {
          id: string;
          family_id: string;
          name: string;
          age: number | null;
          emoji: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      child_progress: {
        Row: {
          child_id: string;
          level: number;
          xp: number;
          streak: number;
          accuracy: number;
          badges_count: number;
          stars_count: number;
          active_days_count: number;
          total_questions_answered: number;
          total_correct_answers: number;
          last_activity_at: string | null;
          updated_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      child_achievements: {
        Row: {
          id: string;
          child_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      child_category_stats: {
        Row: {
          child_id: string;
          category: string;
          questions_answered: number;
          correct_answers: number;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      family_codes: {
        Row: {
          id: string;
          family_id: string;
          code: string;
          bound_device_id: string | null;
          revoked_at: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      subscription_plans: {
        Row: {
          id: string;
          slug: string;
          name: string;
          price_cents: number;
          currency: string;
          period: string;
          max_children: number;
          features: Json;
          best_value: boolean;
          is_active: boolean;
          sort_order: number;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          family_id: string;
          plan_id: string;
          status: SubscriptionStatus;
          trial_ends_at: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          parent_id: string;
          subject: string | null;
          message: string;
          status: "open" | "answered" | "closed";
          admin_reply: string | null;
          replied_at: string | null;
          created_at: string;
        };
        Insert: never;
        Update: {
          admin_reply?: string | null;
          status?: "open" | "answered" | "closed";
          replied_at?: string | null;
        };
        Relationships: [];
      };
      error_reports: {
        Row: {
          id: string;
          source: "parent" | "child";
          kind: "crash" | "user_report";
          device_id: string | null;
          parent_id: string | null;
          message: string;
          stack: string | null;
          screenshot_path: string | null;
          app_version: string | null;
          platform: string | null;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      quran_surahs: {
        Row: {
          id: string;
          slug: string;
          chapter: number | null;
          name: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      quran_verses: {
        Row: {
          chapter: number;
          verse_number: number;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      quran_translations: {
        Row: {
          chapter: number;
          verse_number: number;
          lang: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      duas: {
        Row: { id: string; slug: string };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      dua_translations: {
        Row: { dua_id: string; lang: string };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      stories: {
        Row: { id: string; slug: string };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      story_translations: {
        Row: { story_id: string; lang: string };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      achievements: {
        Row: { id: string; slug: string; label: string };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      admin_broadcasts: {
        Row: {
          id: string;
          title: string;
          body: string;
          audience: "all_parents" | "premium_parents";
          sent_count: number;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          audience: "all_parents" | "premium_parents";
          sent_count?: number;
          created_by?: string | null;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
