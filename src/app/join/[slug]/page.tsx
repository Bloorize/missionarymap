"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPublicEvent } from "@/lib/events";
import { submitGuess } from "@/lib/guesses";
import { MissionCombobox } from "@/components/MissionCombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, CheckCircle2, MapPin, ExternalLink, Lock } from "lucide-react";
import { ALL_MISSIONS } from "@/data/missions";
import type { PublicEvent } from "@/lib/types";

export default function JoinEventPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<PublicEvent | null | undefined>(undefined);
  const [guestName, setGuestName] = useState("");
  const [missionID, setMissionID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [liveMapUrl, setLiveMapUrl] = useState("");
  const [signInUrl, setSignInUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLiveMapUrl(`${window.location.origin}/live/${slug}`);
      setSignInUrl(`/sign-in?redirect_url=${encodeURIComponent(`/live/${slug}`)}`);
    }
  }, [slug]);

  useEffect(() => {
    getPublicEvent(slug).then(setEvent).catch(() => setEvent(null));
  }, [slug]);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(`submitted_${slug}`)) {
      setHasSubmitted(true);
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !missionID) return;

    setIsSubmitting(true);
    try {
      const mission = ALL_MISSIONS.find((m) => m.id === missionID);
      if (!mission) throw new Error("Invalid mission");

      await submitGuess(slug, guestName, mission.id, mission.name, mission.lat, mission.lng);
      localStorage.setItem(`submitted_${slug}`, "true");
      setHasSubmitted(true);
    } catch (error) {
      console.error("Failed to guess:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = event === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Event Not Found</h2>
            <p className="text-slate-500">This event code doesn&apos;t exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasSubmitted) {
    const handleSubmitAnother = () => {
      localStorage.removeItem(`submitted_${slug}`);
      setHasSubmitted(false);
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in-50 duration-500">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 ring-4 ring-green-50">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">You&apos;re on the map!</h1>
          <p className="text-lg text-slate-600">Look at the screen to see your pin drop.</p>
          {liveMapUrl ? (
            <div className="flex flex-col gap-3">
              <Link
                href={liveMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <MapPin className="h-5 w-5" />
                View the live map
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                href={signInUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-100"
              >
                <Lock className="h-4 w-4" />
                Sign in to watch the livestream
              </Link>
            </div>
          ) : null}
          <div className="pt-8">
            <p className="mb-4 text-sm text-slate-500">Waiting for the reveal...</p>
            <button type="button" onClick={handleSubmitAnother} className="text-sm text-blue-600 underline hover:text-blue-700">
              Submit a different guess
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
          <CardDescription>
            Where is <span className="font-semibold">{event.youth_name}</span> going?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Your Name
              </label>
              <Input
                id="name"
                placeholder="Ex. 'Uncle Bob'"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="mission">
                Your Guess
              </label>
              <div className="relative">
                <MissionCombobox value={missionID} onChange={setMissionID} />
              </div>
              <p className="mt-1 flex items-center text-xs text-slate-500">
                <MapPin className="mr-1 h-3 w-3" /> Search 450+ missions (e.g. &quot;Tokyo&quot;)
              </p>
            </div>

            <Button type="submit" size="lg" className="h-14 w-full text-lg" disabled={isSubmitting || !missionID || !guestName}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Guess"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
