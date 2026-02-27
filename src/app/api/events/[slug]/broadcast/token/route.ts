import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { createLiveKitToken, getLiveKitUrl } from "@/lib/livekit";
import { requireOwnedEvent } from "@/lib/server-events";

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

    if (!event.livekit_room_name || !event.active_broadcaster_identity) {
      return NextResponse.json({ error: "Broadcast has not been prepared yet." }, { status: 409 });
    }

    const token = await createLiveKitToken({
      identity: event.active_broadcaster_identity,
      roomName: event.livekit_room_name,
      canPublish: true,
      canSubscribe: true,
    });

    return NextResponse.json({ token, url: getLiveKitUrl(), roomName: event.livekit_room_name });
  } catch (error) {
    const status = error instanceof Error && error.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create broadcaster token." }, { status });
  }
}
