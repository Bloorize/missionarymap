"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getEvent } from "@/lib/events";
import { submitGuess } from "@/lib/guesses";
import { MissionCombobox } from "@/components/MissionCombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle2, MapPin } from "lucide-react";
import { ALL_MISSIONS } from "@/data/missions";

export default function JoinEventPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<Awaited<ReturnType<typeof getEvent>> | null | undefined>(undefined);
  const [guestName, setGuestName] = useState("");
  const [missionID, setMissionID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    getEvent(slug).then(setEvent);
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
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-50">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">You&apos;re on the map!</h1>
          <p className="text-slate-600 text-lg">Look at the screen to see your pin drop.</p>
          <div className="pt-8">
            <p className="text-sm text-slate-500 mb-4">Waiting for the reveal...</p>
            <button
              type="button"
              onClick={handleSubmitAnother}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
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
              <p className="text-xs text-slate-500 flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" /> Search 450+ missions (e.g. &quot;Tokyo&quot;)
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-lg h-14"
              disabled={isSubmitting || !missionID || !guestName}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Guess"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
