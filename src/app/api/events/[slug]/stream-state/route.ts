import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { getStreamState } from "@/lib/server-events";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const authResult = await requireUserId();
  if (authResult.error) return authResult.error;
  const userId = authResult.userId;

  const { slug } = await context.params;

  try {
    const streamState = await getStreamState(slug);
    if (!streamState) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json(streamState);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load stream state." }, { status: 500 });
  }
}
