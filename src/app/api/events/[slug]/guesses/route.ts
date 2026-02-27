import { NextResponse } from "next/server";
import { createGuess, getPublicGuesses } from "@/lib/server-events";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  try {
    const guesses = await getPublicGuesses(slug);
    return NextResponse.json(guesses);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load guesses." }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const body = (await request.json()) as {
    guestName?: string;
    missionId?: string;
    missionName?: string;
    lat?: number;
    lng?: number;
  };

  if (!body.guestName?.trim() || !body.missionId || !body.missionName) {
    return NextResponse.json({ error: "Guest name and mission are required." }, { status: 400 });
  }

  if (typeof body.lat !== "number" || typeof body.lng !== "number") {
    return NextResponse.json({ error: "Mission coordinates are required." }, { status: 400 });
  }

  try {
    await createGuess({
      slug,
      guestName: body.guestName.trim(),
      missionId: body.missionId,
      missionName: body.missionName,
      lat: body.lat,
      lng: body.lng,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const status = error instanceof Error && error.message === "Event not found" ? 404 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to submit guess." }, { status });
  }
}
