import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { getDashboardPayload } from "@/lib/server-events";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const authResult = await requireUserId();
  if (authResult.error) return authResult.error;
  const userId = authResult.userId;

  const { slug } = await context.params;

  try {
    const payload = await getDashboardPayload(slug, userId);
    if (!payload) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json(payload);
  } catch (error) {
    const status = error instanceof Error && error.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load event." }, { status });
  }
}
