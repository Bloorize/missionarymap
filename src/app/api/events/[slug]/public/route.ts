import { NextResponse } from "next/server";
import { getPublicEvent } from "@/lib/server-events";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  try {
    const event = await getPublicEvent(slug);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load event." }, { status: 500 });
  }
}
