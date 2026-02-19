"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getEvent } from "@/lib/events";
import { WorldMap } from "@/components/WorldMap";
import { RibbonBanner } from "@/components/RibbonBanner";
import { Loader2 } from "lucide-react";

export default function LiveMapPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<Awaited<ReturnType<typeof getEvent>> | null | undefined>(undefined);
  const [joinOrigin, setJoinOrigin] = useState("");

  useEffect(() => {
    getEvent(slug).then(setEvent);
  }, [slug]);

  useEffect(() => {
    setJoinOrigin(typeof window !== "undefined" ? window.location.origin : "");
  }, []);

  if (event === undefined) {
    return (
      <div className="h-screen w-screen bg-[#0a0e1a] flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-10 h-10 opacity-50" />
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="h-screen w-screen bg-[#0a0e1a] flex items-center justify-center text-white text-2xl font-bold">
        Event not found
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0a0e1a] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <WorldMap slug={slug} />
      </div>

      <div className="absolute top-0 left-0 w-full p-8 z-10 flex flex-col bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <RibbonBanner className="mb-4" />
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              {event.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-300 mt-2 font-medium drop-shadow-sm">
              Where is {event.youth_name} going?
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Join at</p>
            <p className="text-2xl font-mono font-bold text-white tracking-widest">
              {joinOrigin || "—"}
            </p>
            <div className="mt-1 px-2 py-0.5 bg-blue-600 rounded text-xs font-bold text-white inline-block">
              Code: {event.slug}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
