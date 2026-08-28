import Link from "next/link";
import { computeSnapshot, SIGNAL_META } from "@/lib/compute";
import { getEntry, getEntriesForCountryYear } from "@/lib/service";
import { fmt, fmtRatio, cn } from "@/lib/utils";
import SignalBadge from "@/components/results/SignalBadge";
import { FIELDS } from "@/lib/data/fields";
import type { MarketSignal } from "@/lib/types";

function getHeroSnapshot() {
  const entry = getEntry("IN", "computer-science", 2023);
  return entry ? computeSnapshot(entry) : null;
}

function getOverviewRows() {
  const entries = getEntriesForCountryYear("IN", 2023);
  return entries
    .map((e) => ({ snap: computeSnapshot(e), field: FIELDS.find((f) => f.slug === e.field) }))
    .filter((x) => x.field)
    .sort((a, b) => b.snap.vacancyRatio - a.snap.vacancyRatio);
}

const SIGNAL_ORDER: MarketSignal[] = [
  "critical-shortage",
  "strong-demand",
  "balanced",
  "surplus",
  "significant-surplus",
];

const SIGNAL_RANGE: Record<MarketSignal, string> = {
  "critical-shortage":   "> 2.00",
  "strong-demand":       "1.00 – 2.00",
  balanced:              "0.75 – 1.00",
  surplus:               "0.50 – 0.75",
  "significant-surplus": "< 0.50",
};

export const metadata = {
  title: "VacancyRatio — Graduate vs Vacancy Intelligence",
};

export default function HomePage() {
  const hero = getHeroSnapshot();
  const rows = getOverviewRows();

  return (
    <div className="flex flex-col gap-28">
      {/* Hero */}
      <section className="flex flex-col gap-10 pt-6">
        <div className="flex flex-col gap-5 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Graduate Market Intelligence
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 leading-tight sm:text-5xl">
            How many job vacancies exist for each graduate in your field?
          </h1>
          <p className="text-base text-neutral-500 leading-relaxed">
            VacancyRatio compares the number of people graduating into a career
            with the number of relevant job openings — giving a clear,
            data-driven picture of market demand.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/explore"
            className="inline-flex h-9 items-center rounded-md bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Explore a field
          </Link>
          <Link
            href="/compare"
            className="inline-flex h-9 items-center rounded-md border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Compare fields
          </Link>
        </div>

        {/* Hero stat — flat, no card */}
        {hero && (
          <div className="border-t border-neutral-200 pt-8 max-w-lg">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-6">
              Example — India · Computer Science · 2023
            </p>
            <div className="flex flex-col gap-1 mb-4">
              <p className={cn("text-6xl font-semibold tracking-tight tabular-nums leading-none", SIGNAL_META[hero.signal].color)}>
                {fmtRatio(hero.vacancyRatio)}
              </p>
              <p className="text-sm text-neutral-500 mt-2">vacancies per graduate</p>
              <p className="text-sm text-neutral-400">{fmtRatio(hero.vacanciesPer100Graduates)} vacancies per 100 graduates</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-400 pt-4 border-t border-neutral-100">
              <span>{fmt(hero.entry.graduates)} graduates</span>
              <span className="text-neutral-200">·</span>
              <span>{fmt(hero.entry.relevantVacancies)} vacancies</span>
              <span className="text-neutral-200">·</span>
              <SignalBadge signal={hero.signal} />
            </div>
          </div>
        )}
      </section>

      {/* India snapshot table */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              India · 2023 snapshot
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Sorted by vacancy ratio, highest first
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Explore →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pr-4">
                  Field
                </th>
                <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 px-4">
                  Graduates
                </th>
                <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 px-4">
                  Vacancies
                </th>
                <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 px-4">
                  Ratio
                </th>
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pl-4">
                  Signal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map(({ snap, field }) => (
                <tr key={snap.entry.field} className="group">
                  <td className="py-3.5 pr-4 font-medium text-neutral-800">
                    {field!.label}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-neutral-500">
                    {fmt(snap.entry.graduates)}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-neutral-500">
                    {fmt(snap.entry.relevantVacancies)}
                  </td>
                  <td className={cn("py-3.5 px-4 text-right tabular-nums font-semibold", SIGNAL_META[snap.signal].color)}>
                    {fmtRatio(snap.vacancyRatio)}
                  </td>
                  <td className="py-3.5 pl-4">
                    <SignalBadge signal={snap.signal} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reading the ratio */}
      <section className="flex flex-col gap-8">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            How to read the ratio
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            The vacancy ratio is vacancies ÷ graduates. A ratio above 1 means more vacancies
            than graduates; below 1 means more graduates than vacancies.
          </p>
        </div>

        <div className="border-t border-neutral-200">
          {SIGNAL_ORDER.map((sig) => {
            const meta = SIGNAL_META[sig];
            return (
              <div
                key={sig}
                className="flex flex-col gap-1 border-b border-neutral-100 py-5 sm:flex-row sm:gap-8"
              >
                <div className="flex w-full max-w-[220px] items-start gap-3 flex-shrink-0">
                  <span className={cn("text-[10px] font-semibold uppercase tracking-widest mt-0.5", meta.color)}>
                    {meta.label}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <p className="text-sm text-neutral-600">{meta.description}</p>
                  <span className="font-mono text-xs text-neutral-400 whitespace-nowrap flex-shrink-0">
                    {SIGNAL_RANGE[sig]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <Link
            href="/methodology"
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2"
          >
            Read the full methodology →
          </Link>
        </div>
      </section>
    </div>
  );
}
