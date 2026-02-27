import { buildRoomName } from "@/lib/livekit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { EventRecord, GuessRecord, PublicEvent, StreamState, StreamStatus } from "@/lib/types";

function generateSlug() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function getUniqueSlug() {
  const supabase = getSupabaseAdmin();

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const slug = generateSlug();
    const { data } = await supabase.from("events").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
  }

  throw new Error("Failed to generate a unique event code.");
}

export async function createOwnedEvent(title: string, youthName: string, ownerClerkUserId: string) {
  const slug = await getUniqueSlug();
  const { data, error } = await getSupabaseAdmin()
    .from("events")
    .insert({
      title,
      youth_name: youthName,
      slug,
      owner_clerk_user_id: ownerClerkUserId,
      stream_status: "idle",
      livekit_room_name: null,
      active_broadcaster_identity: null,
      stream_started_at: null,
      stream_ended_at: null,
    })
    .select("id, slug")
    .single();

  if (error) throw error;
  return data;
}

export async function getOwnedEvents(ownerClerkUserId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("events")
    .select("*")
    .eq("owner_clerk_user_id", ownerClerkUserId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as EventRecord[];
}

export async function getEventBySlug(slug: string) {
  const { data, error } = await getSupabaseAdmin().from("events").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as EventRecord | null) ?? null;
}

export async function requireOwnedEvent(slug: string, ownerClerkUserId: string) {
  const event = await getEventBySlug(slug);
  if (!event) return null;
  if (event.owner_clerk_user_id !== ownerClerkUserId) {
    throw new Error("Forbidden");
  }
  return event;
}

export async function getEventGuesses(eventId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("guesses")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as GuessRecord[];
}

export async function getDashboardPayload(slug: string, ownerClerkUserId: string) {
  const event = await requireOwnedEvent(slug, ownerClerkUserId);
  if (!event) return null;

  const guesses = await getEventGuesses(event.id);
  return { event, guesses };
}

export async function getPublicEvent(slug: string): Promise<PublicEvent | null> {
  const event = await getEventBySlug(slug);
  if (!event) return null;

  return {
    id: event.id,
    title: event.title,
    youth_name: event.youth_name,
    slug: event.slug,
    is_revealed: event.is_revealed,
    actual_mission: event.actual_mission,
  };
}

export async function getPublicGuesses(slug: string) {
  const event = await getEventBySlug(slug);
  if (!event) return [];
  return getEventGuesses(event.id);
}

export async function createGuess(input: {
  slug: string;
  guestName: string;
  missionId: string;
  missionName: string;
  lat: number;
  lng: number;
}) {
  const event = await getEventBySlug(input.slug);
  if (!event) throw new Error("Event not found");

  const { error } = await getSupabaseAdmin().from("guesses").insert({
    event_id: event.id,
    guest_name: input.guestName,
    mission_id: input.missionId,
    mission_name: input.missionName,
    lat: input.lat,
    lng: input.lng,
  });

  if (error) throw error;
}

export async function updateStreamState(
  slug: string,
  updates: Partial<Pick<EventRecord, "stream_status" | "stream_started_at" | "stream_ended_at" | "livekit_room_name" | "active_broadcaster_identity">>
) {
  const { data, error } = await getSupabaseAdmin()
    .from("events")
    .update(updates)
    .eq("slug", slug)
    .select("*")
    .single();

  if (error) throw error;
  return data as EventRecord;
}

export async function ensureBroadcastRoom(event: EventRecord, broadcasterIdentity: string) {
  const roomName = event.livekit_room_name ?? buildRoomName(event.id);
  const { error } = await getSupabaseAdmin()
    .from("events")
    .update({
      livekit_room_name: roomName,
      stream_status: "starting",
      stream_started_at: null,
      stream_ended_at: null,
      active_broadcaster_identity: broadcasterIdentity,
    })
    .eq("id", event.id);

  if (error) throw error;
  return roomName;
}

export async function getStreamState(slug: string): Promise<StreamState | null> {
  const event = await getEventBySlug(slug);
  if (!event) return null;

  return {
    status: event.stream_status,
    startedAt: event.stream_started_at,
    endedAt: event.stream_ended_at,
    hasActiveBroadcaster: Boolean(event.active_broadcaster_identity),
  };
}

export async function markStreamLiveByRoom(roomName: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("events")
    .update({ stream_status: "live", stream_started_at: new Date().toISOString() })
    .eq("livekit_room_name", roomName)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return (data as EventRecord | null) ?? null;
}

export async function markStreamEndedByRoom(roomName: string, status: StreamStatus = "ended") {
  const { data, error } = await getSupabaseAdmin()
    .from("events")
    .update({
      stream_status: status,
      stream_ended_at: new Date().toISOString(),
      active_broadcaster_identity: null,
    })
    .eq("livekit_room_name", roomName)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return (data as EventRecord | null) ?? null;
}
