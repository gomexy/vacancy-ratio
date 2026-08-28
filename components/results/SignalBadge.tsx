import { SIGNAL_META } from "@/lib/compute";
import { cn } from "@/lib/utils";
import type { MarketSignal } from "@/lib/types";

export default function SignalBadge({ signal }: { signal: MarketSignal }) {
  const meta = SIGNAL_META[signal];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        meta.color,
        meta.bg
      )}
    >
      {meta.label}
    </span>
  );
}
