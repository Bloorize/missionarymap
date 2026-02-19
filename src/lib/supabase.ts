import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
