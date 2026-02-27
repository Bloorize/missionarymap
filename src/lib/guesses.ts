import { readJson } from "@/lib/http";
import type { GuessRecord } from "@/lib/types";

export async function submitGuess(
  slug: string,
  guestName: string,
  missionId: string,
  missionName: string,
  lat: number,
  lng: number
) {
  return readJson<{ success: true }>(
    await fetch(`/api/events/${slug}/guesses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName, missionId, missionName, lat, lng }),
    })
  );
}

export async function getGuesses(slug: string) {
  return readJson<GuessRecord[]>(await fetch(`/api/events/${slug}/guesses`, { cache: "no-store" }));
}
