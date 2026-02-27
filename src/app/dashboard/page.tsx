"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getOwnedEvents } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, ArrowRight, Loader2 } from "lucide-react";
import type { EventRecord } from "@/lib/types";
import { StreamStatusBadge } from "@/components/StreamStatusBadge";

export default function DashboardPage() {
  const [events, setEvents] = useState<EventRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOwnedEvents().then(setEvents).catch((err) => setError(err instanceof Error ? err.message : "Failed to load events."));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto flex max-w-5xl items-center justify-between py-8 px-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Events</h1>
            <p className="mt-2 text-slate-500">Manage your mission call parties and go live from your phone.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/create">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" /> New Event
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl py-10 px-4">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : events === null ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900">No events yet</h3>
            <p className="mx-auto mb-6 max-w-sm text-slate-500">
              Create your first event to start collecting guesses and broadcast the mission call live.
            </p>
            <Link href="/dashboard/create">
              <Button variant="outline">Create Event</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link key={event.id} href={`/dashboard/events/${event.slug}`}>
                <Card className="h-full cursor-pointer border-slate-200 bg-white transition-shadow duration-200 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="line-clamp-1 text-xl font-bold text-slate-900">{event.title}</CardTitle>
                      <StreamStatusBadge status={event.stream_status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-sm text-slate-500">
                      For: <span className="font-medium text-slate-700">{event.youth_name}</span>
                    </p>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Code: {event.slug}</p>
                    <div className="mt-4 flex items-center justify-between text-sm font-medium text-primary">
                      <span>Manage Event</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
