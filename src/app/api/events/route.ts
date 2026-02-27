import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { createOwnedEvent } from "@/lib/server-events";

export async function POST(request: Request) {
  const authResult = await requireUserId();
  if (authResult.error) return authResult.error;
  const userId = authResult.userId;

  const body = (await request.json()) as { title?: string; youthName?: string };
  const title = body.title?.trim();
  const youthName = body.youthName?.trim();

  if (!title || !youthName) {
    return NextResponse.json({ error: "Title and youth name are required." }, { status: 400 });
  }

  try {
    const event = await createOwnedEvent(title, youthName, userId);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create event." }, { status: 500 });
  }
}
