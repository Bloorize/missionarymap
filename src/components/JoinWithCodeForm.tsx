"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";

export function JoinWithCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) {
      router.push(`/join/${trimmed}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <Input
        type="text"
        placeholder="Enter event code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        className="h-14 text-lg font-mono tracking-widest text-center uppercase"
        maxLength={10}
      />
      <Button type="submit" size="lg" className="h-14 px-8 shrink-0" disabled={!code.trim()}>
        <LogIn className="mr-2 h-5 w-5" /> Join
      </Button>
    </form>
  );
}
