import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment environment."
      );
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export type Event = {
  id: string;
  title: string;
  youth_name: string;
  slug: string;
  created_at: string;
  is_revealed: boolean;
  actual_mission: string | null;
};

export type Guess = {
  id: string;
  event_id: string;
  guest_name: string;
  mission_id: string;
  mission_name: string;
  lat: number;
  lng: number;
  created_at: string;
};
