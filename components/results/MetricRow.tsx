import { fmt, fmtRatio } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { SIGNAL_META } from "@/lib/compute";
import type { MarketSnapshot } from "@/lib/types";
import SignalBadge from "./SignalBadge";
import RatioScaleBar from "@/components/charts/RatioScaleBar";

export default function MetricRow({ snapshot }: { snapshot: MarketSnapshot }) {
  const { entry, vacancyRatio, vacanciesPer100Graduates, signal } = snapshot;
  const meta = SIGNAL_META[signal];

  return (
    <div className="flex flex-col gap-0">
      {/* Primary + secondary metrics */}
      <div className="flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-100">
        {/* Dominant metric */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Vacancy ratio · {entry.year}
          </p>
          <p
            className={cn(
              "text-7xl font-semibold tracking-tight tabular-nums leading-none sm:text-8xl",
              meta.color
            )}
          >
            {fmtRatio(vacancyRatio)}
          </p>
          <div className="pt-1">
            <RatioScaleBar ratio={vacancyRatio} />
          </div>
        </div>

        {/* Secondary metrics */}
        <div className="flex flex-col gap-4 sm:items-end">
          <div className="sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
              Per 100 graduates
            </p>
            <p className="text-3xl font-semibold tabular-nums text-neutral-900 tracking-tight">
              {fmtRatio(vacanciesPer100Graduates)}
            </p>
            <p className="text-sm text-neutral-400 mt-0.5">vacancies</p>
          </div>

          <div className="flex gap-6 text-sm text-neutral-500 pt-4 border-t border-neutral-100 sm:justify-end">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                Graduates
              </span>
              <span className="font-medium text-neutral-800 tabular-nums">
                {fmt(entry.graduates)}
              </span>
            </div>
            <div className="w-px bg-neutral-100 self-stretch" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                Vacancies
              </span>
              <span className="font-medium text-neutral-800 tabular-nums">
                {fmt(entry.relevantVacancies)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Signal badge + source */}
      <div className="pt-5 pb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SignalBadge signal={signal} size="md" />
        <p className="text-[10px] text-neutral-300 font-mono">
          Demo · {entry.source}
        </p>
      </div>
    </div>
  );
}
