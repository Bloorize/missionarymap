import { AccessToken, RoomServiceClient, WebhookReceiver } from "livekit-server-sdk";

function getLiveKitConfig() {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    throw new Error("Missing LiveKit environment variables.");
  }

  return { apiKey, apiSecret, wsUrl };
}

export function getLiveKitUrl() {
  return getLiveKitConfig().wsUrl;
}

export function createLiveKitToken(params: {
  identity: string;
  roomName: string;
  canPublish: boolean;
  canSubscribe: boolean;
}) {
  const { apiKey, apiSecret } = getLiveKitConfig();
  const token = new AccessToken(apiKey, apiSecret, {
    identity: params.identity,
    ttl: "1h",
  });

  token.addGrant({
    room: params.roomName,
    roomJoin: true,
    canPublish: params.canPublish,
    canSubscribe: params.canSubscribe,
    canPublishData: false,
  });

  return token.toJwt();
}

export function getRoomServiceClient() {
  const { apiKey, apiSecret, wsUrl } = getLiveKitConfig();
  return new RoomServiceClient(wsUrl, apiKey, apiSecret);
}

export function getWebhookReceiver() {
  const { apiKey, apiSecret } = getLiveKitConfig();
  return new WebhookReceiver(apiKey, apiSecret);
}

export function buildRoomName(eventId: string) {
  return `missionary-event-${eventId}`;
}
