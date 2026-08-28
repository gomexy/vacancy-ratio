import Link from "next/link";
import { computeSnapshot } from "@/lib/compute";
import { getEntry, getEntriesForCountryYear } from "@/lib/service";
import { fmt, fmtRatio } from "@/lib/utils";
import SignalBadge from "@/components/results/SignalBadge";
import { FIELDS } from "@/lib/data/fields";
import { SIGNAL_META } from "@/lib/compute";
import type { MarketSignal } from "@/lib/types";

// Hero snapshot: India CS 2023
function getHeroSnapshot() {
  const entry = getEntry("IN", "computer-science", 2023);
  if (!entry) return null;
  return computeSnapshot(entry);
}

// Overview cards for India 2023
function getOverviewCards() {
  const entries = getEntriesForCountryYear("IN", 2023);
  return entries
    .map((e) => ({ snap: computeSnapshot(e), field: FIELDS.find((f) => f.slug === e.field) }))
    .filter((x) => x.field)
    .sort((a, b) => b.snap.vacancyRatio - a.snap.vacancyRatio)
    .slice(0, 4);
}

const SIGNAL_ORDER: MarketSignal[] = [
  "critical-shortage",
  "strong-demand",
  "balanced",
  "surplus",
  "significant-surplus",
];

export default function HomePage() {
  const hero = getHeroSnapshot();
  const cards = getOverviewCards();

  return (
    <div className="flex flex-col gap-24">
      {/* Hero */}
      <section className="flex flex-col gap-8 pt-8">
        <div className="flex flex-col gap-4 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Graduate Market Intelligence
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            How many job vacancies exist for each graduate in your field?
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed">
            VacancyRatio compares the number of people graduating into a career
            with the number of relevant job openings — giving you a clear,
            data-driven picture of market demand.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Explore a field
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
          >
            Compare fields
          </Link>
        </div>

        {/* Hero stat */}
        {hero && (
          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Example — India · Computer Science · 2023
            </p>
            <div className="flex flex-col gap-1 mb-3">
              <span className="text-5xl font-semibold tracking-tight text-neutral-900">
                {fmtRatio(hero.vacanciesPer100Graduates)}
              </span>
              <span className="text-sm text-neutral-500">
                vacancies per 100 graduates
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-500 border-t border-neutral-100 pt-3 mt-3">
              <span>{fmt(hero.entry.graduates)} graduates</span>
              <span className="text-neutral-300">·</span>
              <span>{fmt(hero.entry.relevantVacancies)} vacancies</span>
              <span className="text-neutral-300">·</span>
              <SignalBadge signal={hero.signal} />
            </div>
          </div>
        )}
      </section>

      {/* Snapshot grid */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            India market snapshot · 2023
          </h2>
          <Link href="/explore" className="text-sm text-blue-600 hover:underline">
            Explore all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ snap, field }) => (
            <div
              key={snap.entry.field}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-neutral-800">
                  {field!.label}
                </span>
                <SignalBadge signal={snap.signal} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-semibold text-neutral-900">
                  {fmtRatio(snap.vacancyRatio)}
                </span>
                <span className="text-xs text-neutral-400">ratio</span>
              </div>
              <div className="flex gap-3 text-xs text-neutral-400 border-t border-neutral-100 pt-3">
                <span>{fmt(snap.entry.graduates)} grads</span>
                <span>·</span>
                <span>{fmt(snap.entry.relevantVacancies)} vacancies</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Signal legend */}
      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          How to read the ratio
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNAL_ORDER.map((sig) => {
            const meta = SIGNAL_META[sig];
            return (
              <div
                key={sig}
                className={`rounded-xl border p-4 flex flex-col gap-2 ${meta.bg}`}
              >
                <span className={`text-xs font-semibold uppercase tracking-wider ${meta.color}`}>
                  {meta.label}
                </span>
                <p className="text-sm text-neutral-600">{meta.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
