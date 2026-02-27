import { readJson } from "@/lib/http";
import type { DashboardEventPayload, EventRecord, PublicEvent, StreamState } from "@/lib/types";

export async function createEvent(title: string, youthName: string) {
  return readJson<{ id: string; slug: string }>(
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, youthName }),
    })
  );
}

export async function getOwnedEvents() {
  return readJson<EventRecord[]>(await fetch("/api/events/owned", { cache: "no-store" }));
}

export async function getPublicEvent(slug: string) {
  return readJson<PublicEvent>(await fetch(`/api/events/${slug}/public`, { cache: "no-store" }));
}

export async function getDashboardEvent(slug: string) {
  return readJson<DashboardEventPayload>(await fetch(`/api/events/${slug}/dashboard`, { cache: "no-store" }));
}

export async function getStreamState(slug: string) {
  return readJson<StreamState>(await fetch(`/api/events/${slug}/stream-state`, { cache: "no-store" }));
}
