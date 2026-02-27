import { cn } from "@/lib/utils";
import type { StreamStatus } from "@/lib/types";

const STATUS_COPY: Record<StreamStatus, string> = {
  idle: "Standby",
  starting: "Starting",
  live: "Live",
  ending: "Ending",
  ended: "Ended",
  error: "Error",
};

const STATUS_CLASSES: Record<StreamStatus, string> = {
  idle: "bg-slate-100 text-slate-700 border-slate-200",
  starting: "bg-amber-100 text-amber-800 border-amber-200",
  live: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ending: "bg-orange-100 text-orange-800 border-orange-200",
  ended: "bg-slate-200 text-slate-700 border-slate-300",
  error: "bg-red-100 text-red-700 border-red-200",
};

export function StreamStatusBadge({ status }: { status: StreamStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide", STATUS_CLASSES[status])}>
      {STATUS_COPY[status]}
    </span>
  );
}
