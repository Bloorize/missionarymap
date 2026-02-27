import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { getRoomServiceClient } from "@/lib/livekit";
import { ensureBroadcastRoom, requireOwnedEvent } from "@/lib/server-events";

export async function POST(_: Request, context: { params: Promise<{ slug: string }> }) {
  const authResult = await requireUserId();
  if (authResult.error) return authResult.error;
  const userId = authResult.userId;

  const { slug } = await context.params;

  try {
    const event = await requireOwnedEvent(slug, userId);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const broadcasterIdentity = `host:${event.id}:${userId}`;
    const roomName = await ensureBroadcastRoom(event, broadcasterIdentity);

    try {
      await getRoomServiceClient().createRoom({ name: roomName, emptyTimeout: 60 * 5, maxParticipants: 150 });
    } catch {
      // Room already exists or the API returned a transient create error. The client can still attempt to join.
    }

    return NextResponse.json({ roomName, identity: broadcasterIdentity, status: "starting" });
  } catch (error) {
    const status = error instanceof Error && error.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to start broadcast." }, { status });
  }
}
