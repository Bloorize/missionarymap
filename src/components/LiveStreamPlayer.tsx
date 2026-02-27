"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RadioTower } from "lucide-react";
import { Room, RoomEvent, Track } from "livekit-client";
import { readJson } from "@/lib/http";

export function LiveStreamPlayer({ slug }: { slug: string }) {
  const roomRef = useRef<Room | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const audioContainerRef = useRef<HTMLDivElement | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const attachTrack = useCallback((track: Track, identity?: string) => {
    if (!identity?.startsWith("host:")) return;

    if (track.kind === Track.Kind.Video && videoContainerRef.current) {
      videoContainerRef.current.innerHTML = "";
      const element = track.attach();
      element.className = "h-full w-full object-cover";
      videoContainerRef.current.appendChild(element);
    }

    if (track.kind === Track.Kind.Audio && audioContainerRef.current) {
      audioContainerRef.current.innerHTML = "";
      const element = track.attach();
      audioContainerRef.current.appendChild(element);
    }
  }, []);

  const detachTrack = useCallback((track: Track) => {
    track.detach().forEach((element) => element.remove());
  }, []);

  useEffect(() => {
    let cancelled = false;

    const connect = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        const { token, url } = await readJson<{ token: string; url: string }>(
          await fetch(`/api/events/${slug}/viewer/token`, { method: "POST" })
        );

        if (cancelled) return;

        const room = new Room({ adaptiveStream: true, dynacast: true });
        roomRef.current = room;

        room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
          attachTrack(track, participant.identity);
        });
        room.on(RoomEvent.TrackUnsubscribed, (track) => {
          detachTrack(track);
        });
        room.on(RoomEvent.Disconnected, () => {
          if (!cancelled) {
            setError("The broadcast ended or the connection was lost.");
          }
        });

        await room.connect(url, token);

        room.remoteParticipants.forEach((participant) => {
          participant.trackPublications.forEach((publication) => {
            if (publication.track) {
              attachTrack(publication.track, participant.identity);
            }
          });
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to join the livestream.");
        }
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    };

    void connect();

    return () => {
      cancelled = true;
      roomRef.current?.disconnect();
      roomRef.current = null;
    };
  }, [attachTrack, detachTrack, slug]);

  if (isConnecting) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-black/50 text-white backdrop-blur-md">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin" /> Connecting to the livestream...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/50 p-6 text-center text-white backdrop-blur-md">
        <RadioTower className="mb-4 h-8 w-8 text-red-300" />
        <p className="font-semibold">Livestream unavailable</p>
        <p className="mt-2 text-sm text-slate-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-md">
      <div ref={videoContainerRef} className="aspect-video min-h-[280px] w-full bg-black" />
      <div ref={audioContainerRef} className="hidden" />
    </div>
  );
}
