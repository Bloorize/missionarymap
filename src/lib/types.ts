export type EventRecord = {
  id: string;
  title: string;
  youth_name: string;
  slug: string;
  created_at: string;
  is_revealed: boolean;
  actual_mission: string | null;
  owner_clerk_user_id: string;
  stream_status: StreamStatus;
  livekit_room_name: string | null;
  stream_started_at: string | null;
  stream_ended_at: string | null;
  active_broadcaster_identity: string | null;
};

export type PublicEvent = Pick<
  EventRecord,
  "id" | "title" | "youth_name" | "slug" | "is_revealed" | "actual_mission"
>;

export type GuessRecord = {
  id: string;
  event_id: string;
  guest_name: string;
  mission_id: string;
  mission_name: string;
  lat: number;
  lng: number;
  created_at: string;
};

export type StreamStatus = "idle" | "starting" | "live" | "ending" | "ended" | "error";

export type StreamState = {
  status: StreamStatus;
  startedAt: string | null;
  endedAt: string | null;
  hasActiveBroadcaster: boolean;
};

export type DashboardEventPayload = {
  event: EventRecord;
  guesses: GuessRecord[];
};
