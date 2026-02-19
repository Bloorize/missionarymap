import { getSupabase } from "./supabase";

export async function submitGuess(
  slug: string,
  guestName: string,
  missionId: string,
  missionName: string,
  lat: number,
  lng: number
) {
  const { data: event } = await getSupabase()
    .from("events")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!event) throw new Error("Event not found");

  const { error } = await getSupabase().from("guesses").insert({
    event_id: event.id,
    guest_name: guestName,
    mission_id: missionId,
    mission_name: missionName,
    lat,
    lng,
  });

  if (error) throw error;
  return { success: true };
}

export async function getGuesses(slug: string) {
  const { data: event } = await getSupabase()
    .from("events")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!event) return [];

  const { data, error } = await getSupabase()
    .from("guesses")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
