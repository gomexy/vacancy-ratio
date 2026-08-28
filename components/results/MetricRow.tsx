import { fmt, fmtRatio } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { SIGNAL_META } from "@/lib/compute";
import type { MarketSnapshot } from "@/lib/types";
import SignalBadge from "./SignalBadge";
import { FIELDS } from "@/lib/data/fields";

function interpretationText(snapshot: MarketSnapshot): string {
  const { entry, vacanciesPer100Graduates, signal } = snapshot;
  const fieldLabel =
    FIELDS.find((f) => f.slug === entry.field)?.label ?? entry.field;

  const base = `In ${entry.year}, there were ${fmtRatio(vacanciesPer100Graduates)} vacancies for every 100 ${fieldLabel} graduates — a total of ${fmt(entry.relevantVacancies)} openings for ${fmt(entry.graduates)} graduates.`;

  const tail =
    signal === "critical-shortage" || signal === "strong-demand"
      ? " Employers are competing for talent. New graduates enter a highly favourable market."
      : signal === "balanced"
      ? " Supply and demand are closely aligned. Entry is competitive but conditions remain fair."
      : " Graduates outnumber available roles. Specialisation, postgraduate study, or adjacent fields may strengthen individual prospects.";

  return base + tail;
}

export default function MetricRow({ snapshot }: { snapshot: MarketSnapshot }) {
  const { entry, vacancyRatio, vacanciesPer100Graduates, signal } = snapshot;
  const meta = SIGNAL_META[signal];

  return (
    <div className="flex flex-col gap-0">
      {/* Primary stat row */}
      <div className="flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200">
        {/* Dominant metric */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Vacancy Ratio
          </p>
          <p
            className={cn(
              "text-7xl font-semibold tracking-tight tabular-nums leading-none sm:text-8xl",
              meta.color
            )}
          >
            {fmtRatio(vacancyRatio)}
          </p>
          <p className="text-sm text-neutral-500">vacancies per graduate</p>
        </div>

        {/* Secondary metrics */}
        <div className="flex flex-col gap-3 sm:items-end">
          <div className="sm:text-right">
            <p className="text-3xl font-semibold tabular-nums text-neutral-900 tracking-tight">
              {fmtRatio(vacanciesPer100Graduates)}
            </p>
            <p className="text-sm text-neutral-500">vacancies per 100 graduates</p>
          </div>

          <div className="flex gap-6 text-sm text-neutral-500 pt-3 border-t border-neutral-100 sm:justify-end">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                Graduates
              </span>
              <span className="font-medium text-neutral-800 tabular-nums">
                {fmt(entry.graduates)}
              </span>
            </div>
            <div className="w-px bg-neutral-200 self-stretch" />
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

      {/* Interpretation */}
      <div className="py-8 flex flex-col gap-3">
        <SignalBadge signal={signal} size="md" />
        <p className="text-base text-neutral-600 leading-relaxed max-w-2xl">
          {interpretationText(snapshot)}
        </p>
        <p className="text-xs text-neutral-400 pt-1">
          Demo data — intended source: {entry.source}
        </p>
      </div>
    </div>
  );
}
