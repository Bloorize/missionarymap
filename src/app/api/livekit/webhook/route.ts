import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getWebhookReceiver } from "@/lib/livekit";
import { markStreamEndedByRoom, markStreamLiveByRoom } from "@/lib/server-events";

export async function POST(request: Request) {
  const headerStore = await headers();
  const authorization = headerStore.get("authorization");
  const body = await request.text();

  if (!authorization) {
    return NextResponse.json({ error: "Missing authorization header." }, { status: 401 });
  }

  try {
    const receiver = getWebhookReceiver();
    const event = await receiver.receive(body, authorization);
    const roomName = event.room?.name;

    if (!roomName) {
      return NextResponse.json({ received: true });
    }

    switch (event.event) {
      case "track_published":
      case "participant_joined": {
        if (event.participant?.identity?.startsWith("host:")) {
          await markStreamLiveByRoom(roomName);
        }
        break;
      }
      case "participant_left":
      case "room_finished": {
        if (!event.participant || event.participant.identity.startsWith("host:")) {
          await markStreamEndedByRoom(roomName, "ended");
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook." }, { status: 400 });
  }
}
