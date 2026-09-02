// mobile/src/lib/database.types.ts
//
// Hand-written to match supabase/migrations/*.sql exactly. Once a
// real Supabase project exists, regenerate this file for real with:
//
//   supabase gen types typescript --local > src/lib/database.types.ts
//
// (or --project-id <ref> against a linked remote project) and this
// file becomes redundant — keep the same export names so
// mobile/src/lib/supabase.ts doesn't need to change.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type SubscriptionStatus = "trial" | "active" | "cancelled" | "expired";
type DuaCategory = "Morning" | "Evening" | "Sleep" | "Eat";
type JourneyItemType = "quran" | "dua" | "story" | "quiz" | "game";

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
        Insert: {
          id?: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["families"]["Insert"]>;
        Relationships: [];
      };
      parents: {
        Row: {
          id: string;
          family_id: string;
          full_name: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          family_id: string;
          full_name?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parents"]["Insert"]>;
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
        Insert: {
          id?: string;
          family_id: string;
          name: string;
          age?: number | null;
          emoji?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["children"]["Insert"]>;
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
        Insert: {
          child_id: string;
          level?: number;
          xp?: number;
          streak?: number;
          accuracy?: number;
          badges_count?: number;
          stars_count?: number;
          active_days_count?: number;
          total_questions_answered?: number;
          total_correct_answers?: number;
          last_activity_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["child_progress"]["Insert"]>;
        Relationships: [];
      };
      child_daily_activity: {
        Row: {
          child_id: string;
          activity_date: string;
          questions_answered: number;
          xp_earned: number;
        };
        Insert: {
          child_id: string;
          activity_date: string;
          questions_answered?: number;
          xp_earned?: number;
        };
        Update: Partial<Database["public"]["Tables"]["child_daily_activity"]["Insert"]>;
        Relationships: [];
      };
      family_codes: {
        Row: {
          id: string;
          family_id: string;
          code: string;
          created_by: string | null;
          bound_device_id: string | null;
          bound_at: string | null;
          revoked_at: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          code: string;
          created_by?: string | null;
          bound_device_id?: string | null;
          bound_at?: string | null;
          revoked_at?: string | null;
          expires_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["family_codes"]["Insert"]>;
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          price_cents: number;
          currency?: string;
          period?: string;
          max_children: number;
          features?: Json;
          best_value?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscription_plans"]["Insert"]>;
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
          external_provider: string | null;
          external_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          plan_id: string;
          status?: SubscriptionStatus;
          trial_ends_at?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          external_provider?: string | null;
          external_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [];
      };
      quran_surahs: {
        Row: {
          id: string;
          slug: string;
          name: string;
          arabic_name: string;
          juz: string;
          unlock_level: number;
          audio_url: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          arabic_name: string;
          juz: string;
          unlock_level?: number;
          audio_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quran_surahs"]["Insert"]>;
        Relationships: [];
      };
      duas: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: DuaCategory;
          arabic: string;
          transliteration: string;
          translation: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category: DuaCategory;
          arabic: string;
          transliteration: string;
          translation?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["duas"]["Insert"]>;
        Relationships: [];
      };
      stories: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          icon: string;
          tone: string;
          unlock_level: number;
          content: Json | null;
          audio_url: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          icon: string;
          tone: string;
          unlock_level?: number;
          content?: Json | null;
          audio_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stories"]["Insert"]>;
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quizzes"]["Insert"]>;
        Relationships: [];
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          prompt: string;
          // array of { id, label, emoji } — see mobile/src/data/mock.ts QuizOption
          options: Json;
          correct_option_id: string;
          xp: number;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          prompt: string;
          options: Json;
          correct_option_id: string;
          xp?: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quiz_questions"]["Insert"]>;
        Relationships: [];
      };
      games: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          icon: string;
          tone: string;
          unlock_level: number;
          config: Json | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          icon: string;
          tone: string;
          unlock_level?: number;
          config?: Json | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          slug: string;
          label: string;
          icon: string;
          tone: string;
          criteria: Json | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          label: string;
          icon: string;
          tone: string;
          criteria?: Json | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
        Relationships: [];
      };
      child_achievements: {
        Row: {
          id: string;
          child_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          achievement_id: string;
          earned_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["child_achievements"]["Insert"]>;
        Relationships: [];
      };
      daily_journeys: {
        Row: {
          id: string;
          child_id: string;
          journey_date: string;
          daily_limit_minutes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          journey_date?: string;
          daily_limit_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_journeys"]["Insert"]>;
        Relationships: [];
      };
      daily_journey_items: {
        Row: {
          id: string;
          daily_journey_id: string;
          item_type: JourneyItemType;
          label: string;
          icon: string;
          minutes: number;
          content_id: string | null;
          done: boolean;
          completed_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          daily_journey_id: string;
          item_type: JourneyItemType;
          label: string;
          icon: string;
          minutes?: number;
          content_id?: string | null;
          done?: boolean;
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_journey_items"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
