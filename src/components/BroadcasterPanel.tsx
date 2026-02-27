"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Loader2, Mic, MicOff, RadioTower, Square, Video, VideoOff } from "lucide-react";
import { Room, RoomEvent } from "livekit-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { readJson } from "@/lib/http";
import type { StreamStatus } from "@/lib/types";
import { StreamStatusBadge } from "@/components/StreamStatusBadge";

export function BroadcasterPanel({
  slug,
  initialStatus,
  onStatusChange,
}: {
  slug: string;
  initialStatus: StreamStatus;
  onStatusChange: (status: StreamStatus) => void;
}) {
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const roomRef = useRef<Room | null>(null);
  const [status, setStatus] = useState<StreamStatus>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [hasPreview, setHasPreview] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const isBroadcasting = useMemo(() => status === "starting" || status === "live", [status]);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    onStatusChange(status);
  }, [onStatusChange, status]);

  useEffect(() => {
    if (previewRef.current && previewStreamRef.current) {
      previewRef.current.srcObject = previewStreamRef.current;
    }
  }, [hasPreview]);

  useEffect(() => {
    return () => {
      previewStreamRef.current?.getTracks().forEach((track) => track.stop());
      roomRef.current?.disconnect();
    };
  }, []);

  const handlePrepare = async () => {
    setIsPreparing(true);
    setError(null);

    try {
      const previewStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      previewStream.getVideoTracks().forEach((track) => {
        track.enabled = cameraEnabled;
      });
      previewStream.getAudioTracks().forEach((track) => {
        track.enabled = micEnabled;
      });

      previewStreamRef.current?.getTracks().forEach((track) => track.stop());
      previewStreamRef.current = previewStream;
      setHasPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Camera and microphone access is required.");
    } finally {
      setIsPreparing(false);
    }
  };

  const handleStart = async () => {
    setIsBusy(true);
    setError(null);

    try {
      await readJson(await fetch(`/api/events/${slug}/broadcast/start`, { method: "POST" }));
      const { token, url } = await readJson<{ token: string; url: string }>(
        await fetch(`/api/events/${slug}/broadcast/token`, { method: "POST" })
      );

      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;

      room.on(RoomEvent.Disconnected, () => {
        setStatus("ended");
      });
      room.on(RoomEvent.Reconnecting, () => {
        setStatus("starting");
      });
      room.on(RoomEvent.Reconnected, () => {
        setStatus("live");
      });

      await room.connect(url, token);
      await room.localParticipant.setCameraEnabled(cameraEnabled);
      await room.localParticipant.setMicrophoneEnabled(micEnabled);
      setStatus("live");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to start the broadcast.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleStop = async () => {
    setIsBusy(true);
    setError(null);

    try {
      await readJson(await fetch(`/api/events/${slug}/broadcast/stop`, { method: "POST" }));
      roomRef.current?.disconnect();
      roomRef.current = null;
      setStatus("ended");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to stop the broadcast.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleCameraToggle = async () => {
    const nextValue = !cameraEnabled;
    setCameraEnabled(nextValue);

    previewStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = nextValue;
    });

    if (roomRef.current) {
      await roomRef.current.localParticipant.setCameraEnabled(nextValue);
    }
  };

  const handleMicToggle = async () => {
    const nextValue = !micEnabled;
    setMicEnabled(nextValue);

    previewStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = nextValue;
    });

    if (roomRef.current) {
      await roomRef.current.localParticipant.setMicrophoneEnabled(nextValue);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <RadioTower className="h-5 w-5 text-blue-600" /> Broadcaster
            </CardTitle>
            <CardDescription>Open this on the missionary&apos;s phone, preview the camera, and go live.</CardDescription>
          </div>
          <StreamStatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
          {hasPreview ? (
            <video ref={previewRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-slate-300">
              <Camera className="h-10 w-10" />
              <p className="font-medium">Camera preview is off</p>
              <p className="text-sm text-slate-400">Enter broadcaster mode to request camera and microphone access.</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handlePrepare} disabled={isPreparing || isBroadcasting}>
            {isPreparing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
            Enter Broadcaster Mode
          </Button>
          <Button variant="outline" onClick={handleCameraToggle} disabled={!hasPreview && !roomRef.current}>
            {cameraEnabled ? <Video className="mr-2 h-4 w-4" /> : <VideoOff className="mr-2 h-4 w-4" />}
            {cameraEnabled ? "Camera On" : "Camera Off"}
          </Button>
          <Button variant="outline" onClick={handleMicToggle} disabled={!hasPreview && !roomRef.current}>
            {micEnabled ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
            {micEnabled ? "Mic On" : "Mic Off"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleStart} disabled={isBusy || isBroadcasting || !hasPreview}>
            {isBusy && !isBroadcasting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RadioTower className="mr-2 h-4 w-4" />}
            Start Broadcast
          </Button>
          <Button variant="destructive" onClick={handleStop} disabled={isBusy || !isBroadcasting}>
            {isBusy && isBroadcasting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Square className="mr-2 h-4 w-4" />}
            End Broadcast
          </Button>
        </div>

        <p className="text-sm text-slate-500">
          Viewers will be able to watch and listen, but they will never publish audio or video from their own devices.
        </p>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
