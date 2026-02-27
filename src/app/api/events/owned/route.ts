import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { getOwnedEvents } from "@/lib/server-events";

export async function GET() {
  const authResult = await requireUserId();
  if (authResult.error) return authResult.error;
  const userId = authResult.userId;

  try {
    const events = await getOwnedEvents(userId);
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load events." }, { status: 500 });
  }
}
