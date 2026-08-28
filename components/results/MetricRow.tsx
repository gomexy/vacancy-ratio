import { fmt, fmtRatio } from "@/lib/utils";
import type { MarketSnapshot } from "@/lib/types";
import SignalBadge from "./SignalBadge";
import Card from "@/components/ui/Card";

interface MetricTileProps {
  label: string;
  value: string;
  sub?: string;
}

function Tile({ label, value, sub }: MetricTileProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </span>
      <span className="text-3xl font-semibold tracking-tight text-neutral-900">
        {value}
      </span>
      {sub && <span className="text-xs text-neutral-400">{sub}</span>}
    </div>
  );
}

export default function MetricRow({ snapshot }: { snapshot: MarketSnapshot }) {
  const { entry, vacancyRatio, vacanciesPer100Graduates, signal } = snapshot;
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <Tile
            label="Graduates"
            value={fmt(entry.graduates)}
            sub={`${entry.year}`}
          />
        </Card>
        <Card>
          <Tile
            label="Vacancies"
            value={fmt(entry.relevantVacancies)}
            sub={`${entry.year}`}
          />
        </Card>
        <Card>
          <Tile
            label="Vacancy Ratio"
            value={fmtRatio(vacancyRatio)}
            sub="vacancies per graduate"
          />
        </Card>
        <Card>
          <Tile
            label="Per 100 Graduates"
            value={fmtRatio(vacanciesPer100Graduates)}
            sub="vacancies"
          />
        </Card>
      </div>

      <Card className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-neutral-700">
            Market Interpretation
          </p>
          <SignalBadge signal={signal} />
        </div>
        <p className="text-sm leading-relaxed text-neutral-500">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          In {entry.year}, there were approximately{" "}
          <strong className="text-neutral-800">
            {fmtRatio(vacanciesPer100Graduates)} vacancies for every 100{" "}
            {entry.field.replace(/-/g, " ")} graduates
          </strong>{" "}
          in this market. {snapshot.signal === "critical-shortage" || snapshot.signal === "strong-demand"
            ? "Employers are competing for talent — new graduates enter a highly favourable market."
            : snapshot.signal === "balanced"
            ? "Supply and demand are closely aligned. Entry is competitive but manageable."
            : "Graduates outnumber available roles. Differentiation, specialisation, or adjacent pathways improve prospects."}
        </p>
        <p className="text-xs text-neutral-400">Source: {entry.source}</p>
      </Card>
    </div>
  );
}
