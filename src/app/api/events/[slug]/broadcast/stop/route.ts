import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { getRoomServiceClient } from "@/lib/livekit";
import { requireOwnedEvent, updateStreamState } from "@/lib/server-events";

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

    if (event.livekit_room_name) {
      try {
        await getRoomServiceClient().deleteRoom(event.livekit_room_name);
      } catch {
        // The room may already be gone. We still want to finalize the event state.
      }
    }

    await updateStreamState(slug, {
      stream_status: "ended",
      stream_ended_at: new Date().toISOString(),
      active_broadcaster_identity: null,
    });

    return NextResponse.json({ success: true, status: "ended" });
  } catch (error) {
    const status = error instanceof Error && error.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to stop broadcast." }, { status });
  }
}
