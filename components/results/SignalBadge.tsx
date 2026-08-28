import { SIGNAL_META } from "@/lib/compute";
import { cn } from "@/lib/utils";
import type { MarketSignal } from "@/lib/types";

interface Props {
  signal: MarketSignal;
  size?: "sm" | "md";
}

export default function SignalBadge({ signal, size = "sm" }: Props) {
  const meta = SIGNAL_META[signal];
  return (
    <span
      className={cn(
        "font-semibold uppercase tracking-widest",
        size === "sm" ? "text-[10px]" : "text-xs",
        meta.color
      )}
    >
      {meta.label}
    </span>
  );
}
