"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ChevronLeft, Loader2, Monitor, Users } from "lucide-react";
import { BroadcasterPanel } from "@/components/BroadcasterPanel";
import { QRCodeCard } from "@/components/QRCodeCard";
import { StreamStatusBadge } from "@/components/StreamStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardEvent } from "@/lib/events";
import type { DashboardEventPayload, StreamStatus } from "@/lib/types";

export default function EventAdminPage() {
  const params = useParams();
  const slug = params.id as string;

  const [payload, setPayload] = useState<DashboardEventPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamStatus, setStreamStatus] = useState<StreamStatus>("idle");

  const load = useCallback(async () => {
    try {
      const nextPayload = await getDashboardEvent(slug);
      setPayload(nextPayload);
      setStreamStatus(nextPayload.event.stream_status);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event.");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
    const interval = setInterval(() => {
      void load();
    }, 5000);
    return () => clearInterval(interval);
  }, [load]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const joinUrl = `${origin}/join/${slug}`;
  const liveUrl = `/live/${slug}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-10 text-center text-slate-600">
        {error ?? "Event not found."}
      </div>
    );
  }

  const { event, guesses } = payload;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto flex max-w-5xl items-center justify-between py-6 px-4">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 transition-colors hover:text-slate-700">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div className="container mx-auto max-w-5xl py-10 px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
              <StreamStatusBadge status={streamStatus} />
            </div>
            <p className="text-slate-500">
              Managing call for <span className="font-semibold">{event.youth_name}</span>
            </p>
          </div>
          <Link href={liveUrl} target="_blank">
            <Button size="lg" className="shadow-md">
              <Monitor className="mr-2 h-5 w-5" /> Launch Viewer Page
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <BroadcasterPanel slug={slug} initialStatus={streamStatus} onStatusChange={setStreamStatus} />

            <Card className="border-blue-100 bg-blue-50/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-blue-950">Next Phase</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-900">
                Recording is intentionally deferred for now. Once storage is configured, this panel can grow into replay and download controls.
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="mr-2 h-5 w-5 text-slate-500" /> Guest Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-sm text-slate-500">Guests can scan this code to submit guesses. Signed-in users can watch from the live page.</p>
                <div className="flex justify-center">
                  <QRCodeCard url={joinUrl} slug={event.slug} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Total Guesses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-slate-900">{guesses.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
