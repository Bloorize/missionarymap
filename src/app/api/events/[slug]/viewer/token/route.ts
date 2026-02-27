import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { createLiveKitToken, getLiveKitUrl } from "@/lib/livekit";
import { getEventBySlug } from "@/lib/server-events";

export async function POST(_: Request, context: { params: Promise<{ slug: string }> }) {
  const authResult = await requireUserId();
  if (authResult.error) return authResult.error;
  const userId = authResult.userId;

  const { slug } = await context.params;

  try {
    const event = await getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    if (!event.livekit_room_name || !["starting", "live"].includes(event.stream_status)) {
      return NextResponse.json({ error: "Broadcast is not live." }, { status: 409 });
    }

    const token = await createLiveKitToken({
      identity: `viewer:${event.id}:${userId}`,
      roomName: event.livekit_room_name,
      canPublish: false,
      canSubscribe: true,
    });

    return NextResponse.json({ token, url: getLiveKitUrl(), roomName: event.livekit_room_name });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create viewer token." }, { status: 500 });
  }
}
