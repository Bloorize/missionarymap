import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JoinWithCodeForm } from "@/components/JoinWithCodeForm";
import { ArrowRight, Globe, PartyPopper, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/80 via-transparent to-transparent z-0" />

      <div className="z-10 max-w-4xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-700 text-sm font-medium border border-blue-100 mb-4">
          <PartyPopper className="w-4 h-4" />
          <span>The Ultimate Mission Call Guessing Game</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
          MissionMap Live
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Turn your mission call reveal into a live, interactive party.
          Guests guess on their phones, pins drop on the big screen instantly.
        </p>

        <div className="flex flex-col items-center gap-6 pt-6">
          <div className="w-full flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-slate-600">Joining an event? Enter the code from the screen</p>
            <JoinWithCodeForm />
          </div>
          <p className="text-slate-400 text-sm">or</p>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="h-12 px-6">
              Host an Event <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-left">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Live World Map</h3>
            <p className="text-slate-600">Project the map on your TV. Watch as the world fills up with guesses in real-time.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Easy for Guests</h3>
            <p className="text-slate-600">No app to download. Guests scan a QR code, type "Tokyo", and submit. Simple.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600">
              <PartyPopper className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Party Mode</h3>
            <p className="text-slate-600">Built for energy. Search 450+ missions instantly. Celebrate the call.</p>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-6 text-slate-500 text-sm">
        © {new Date().getFullYear()} MissionMap Live
      </footer>
    </main>
  );
}
