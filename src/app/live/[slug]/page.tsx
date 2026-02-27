"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { LiveStreamPlayer } from "@/components/LiveStreamPlayer";
import { StreamStatusBadge } from "@/components/StreamStatusBadge";
import { WorldMap } from "@/components/WorldMap";
import { getGuesses } from "@/lib/guesses";
import { getPublicEvent, getStreamState } from "@/lib/events";
import type { PublicEvent, StreamState } from "@/lib/types";

export default function LiveMapPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { isSignedIn } = useAuth();
  const [event, setEvent] = useState<PublicEvent | null | undefined>(undefined);
  const [guessCount, setGuessCount] = useState(0);
  const [joinOrigin, setJoinOrigin] = useState("");
  const [streamState, setStreamState] = useState<StreamState>({
    status: "idle",
    startedAt: null,
    endedAt: null,
    hasActiveBroadcaster: false,
  });

  useEffect(() => {
    getPublicEvent(slug).then(setEvent).catch(() => setEvent(null));
  }, [slug]);

  useEffect(() => {
    setJoinOrigin(typeof window !== "undefined" ? window.location.origin : "");
  }, []);

  useEffect(() => {
    const load = () => getGuesses(slug).then((g) => setGuessCount(g.length)).catch(() => setGuessCount(0));
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [slug]);

  useEffect(() => {
    if (!isSignedIn) {
      setStreamState({
        status: "idle",
        startedAt: null,
        endedAt: null,
        hasActiveBroadcaster: false,
      });
      return;
    }

    const load = async () => {
      try {
        const nextState = await getStreamState(slug);
        setStreamState(nextState);
      } catch {
        // If auth expires mid-session, the signed-in UI will fall back on the next render.
      }
    };

    void load();
    const interval = setInterval(() => {
      void load();
    }, 3000);
    return () => clearInterval(interval);
  }, [isSignedIn, slug]);

  const redirectTo = useMemo(() => `/live/${slug}`, [slug]);

  if (event === undefined) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0e1a] text-white">
        <Loader2 className="h-10 w-10 animate-spin opacity-50" />
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0e1a] text-2xl font-bold text-white">
        Event not found
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0e1a]">
      <div className="absolute inset-0 z-0">
        <WorldMap slug={slug} />
      </div>

      <div className="pointer-events-none absolute top-0 left-0 z-10 w-full bg-gradient-to-b from-black/70 via-black/25 to-transparent px-4 pt-6 pb-10 md:px-8">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
          <div className="pointer-events-auto">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">{event.title}</h1>
              <StreamStatusBadge status={streamState.status} />
            </div>
            <p className="mt-2 text-lg font-medium text-blue-300 md:text-2xl">Where is {event.youth_name} going?</p>
          </div>
          <div className="pointer-events-auto hidden md:block">
            <SignedIn>
              <UserButton afterSignOutUrl={`/live/${slug}`} />
            </SignedIn>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-28 z-20 w-full max-w-6xl -translate-x-1/2 px-4 md:px-8">
        <div className="pointer-events-auto ml-auto w-full max-w-3xl">
          <AuthGate redirectTo={redirectTo}>
            <SignedIn>
              {streamState.status === "live" || streamState.status === "starting" ? (
                <LiveStreamPlayer slug={slug} />
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/55 p-6 text-white backdrop-blur-md">
                  <p className="text-lg font-bold">Livestream standby</p>
                  <p className="mt-2 text-sm text-slate-300">
                    {streamState.status === "ended"
                      ? "The live call has ended."
                      : "The host has not started broadcasting yet. Keep this page open and the stream will appear here once the call opens."}
                  </p>
                </div>
              )}
            </SignedIn>
          </AuthGate>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-10 z-10 hidden flex-col gap-4 md:flex">
        <div className="rounded-lg border border-white/10 bg-black/50 p-4 text-white backdrop-blur-md">
          <h3 className="text-sm font-medium uppercase tracking-widest text-gray-400">Total Guesses</h3>
          <p className="text-4xl font-bold">{guessCount}</p>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-md">
          <p className="mb-1 text-xs uppercase tracking-widest text-slate-400">Join at</p>
          <p className="text-2xl font-mono font-bold tracking-widest text-white">{joinOrigin || "—"}</p>
          <div className="mt-1 inline-block rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">Code: {event.slug}</div>
        </div>
      </div>

      <SignedOut>
        <div className="absolute right-4 bottom-4 z-20 md:hidden">
          <a
            href={`/sign-in?redirect_url=${encodeURIComponent(redirectTo)}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg"
          >
            Sign in to watch
          </a>
        </div>
      </SignedOut>
    </div>
  );
}
