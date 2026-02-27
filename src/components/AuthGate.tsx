"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthGate({ children, redirectTo }: { children: React.ReactNode; redirectTo: string }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-white backdrop-blur-md">
          <h2 className="text-xl font-bold">Sign in to watch live</h2>
          <p className="mt-2 text-sm text-slate-300">
            The map stays public, but the livestream is only available to signed-in viewers.
          </p>
          <div className="mt-4 flex gap-3">
            <Button asChild>
              <Link href={`/sign-in?redirect_url=${encodeURIComponent(redirectTo)}`}>Sign in</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
              <Link href={`/sign-up?redirect_url=${encodeURIComponent(redirectTo)}`}>Create account</Link>
            </Button>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
