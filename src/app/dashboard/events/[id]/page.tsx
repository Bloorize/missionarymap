"use client";

import { useState, useEffect } from "react";
import { getEvent } from "@/lib/events";
import { getGuesses } from "@/lib/guesses";
import { QRCodeCard } from "@/components/QRCodeCard";
import { Button } from "@/components/ui/button";
import { Monitor, Users, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EventAdminPage() {
  const params = useParams();
  const slug = params.id as string;

  const [event, setEvent] = useState<Awaited<ReturnType<typeof getEvent>> | null | undefined>(undefined);
  const [guesses, setGuesses] = useState<Awaited<ReturnType<typeof getGuesses>>>([]);

  useEffect(() => {
    getEvent(slug).then(setEvent);
  }, [slug]);

  useEffect(() => {
    if (!event) return;
    const load = () => getGuesses(slug).then(setGuesses);
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [event, slug]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const joinUrl = `${origin}/join/${slug}`;
  const liveUrl = `/live/${slug}`;

  if (event === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-10 text-center text-slate-600">
        Event not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700 mb-6 inline-flex items-center transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-slate-500">
              Managing call for <span className="font-semibold">{event.youth_name}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={liveUrl} target="_blank">
              <Button size="lg" className="shadow-md">
                <Monitor className="mr-2 h-5 w-5" /> Launch TV View
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-slate-500" /> Guest Access
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Guests can scan this code or use the link to submit their guesses.
              </p>
              <div className="flex justify-center">
                <QRCodeCard url={joinUrl} slug={event.slug} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Guesses</h3>
              <div className="text-5xl font-bold text-slate-900">{guesses.length}</div>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Run the Party</h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start">1. Open <strong>TV View</strong> on the big screen.</li>
                <li className="flex items-start">2. Guests scan the QR code to join.</li>
                <li className="flex items-start">3. Watch pins drop as they submit!</li>
              </ul>
              <Button variant="outline" className="w-full mt-6 border-blue-200 text-blue-700 hover:bg-blue-50" disabled>
                Reveal Mission (Coming Soon)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
