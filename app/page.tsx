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

// Shared container width
const CONTAINER = "mx-auto max-w-5xl px-6 sm:px-12";

export default function HomePage() {
  const hero = getHeroSnapshot();
  const rows = getOverviewRows();

  return (
    <div>

      {/* ── Hero section ── white background, generous vertical space */}
      <section className="bg-white pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className={CONTAINER}>
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-6">
              Graduate Market Intelligence
            </p>

            <h1
              className="font-bold leading-[1.06] tracking-tight text-neutral-900 mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
            >
              How many job vacancies exist for each graduate in your field?
            </h1>

            <p className="text-lg text-neutral-500 leading-relaxed max-w-xl mb-10">
              VacancyRatio compares graduate supply with job openings — giving a
              clear, data-driven picture of market demand across fields and countries.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="inline-flex h-11 items-center rounded-lg bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
              >
                Explore a field
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-11 items-center rounded-lg border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Compare fields
              </Link>
            </div>
          </div>

          {/* Hero stat — sits below CTAs, grounded on a divider */}
          {hero && (
            <div className="mt-16 pt-10 border-t border-neutral-100 max-w-lg">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">
                Example — India · Computer Science · 2023
              </p>
              <div className="flex items-end gap-10">
                <div>
                  <p
                    className={cn(
                      "text-7xl font-bold tabular-nums leading-none tracking-tight",
                      SIGNAL_META[hero.signal].color
                    )}
                  >
                    {fmtRatio(hero.vacancyRatio)}
                  </p>
                  <p className="text-sm text-neutral-500 mt-2">vacancies per graduate</p>
                </div>
                <div className="pb-1 text-right">
                  <p className="text-2xl font-semibold tabular-nums text-neutral-900">
                    {fmtRatio(hero.vacanciesPer100Graduates)}
                  </p>
                  <p className="text-xs text-neutral-400">per 100 graduates</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-neutral-400 pt-4 mt-4 border-t border-neutral-100">
                <span>{fmt(hero.entry.graduates)} graduates</span>
                <span className="text-neutral-200">·</span>
                <span>{fmt(hero.entry.relevantVacancies)} vacancies</span>
                <span className="text-neutral-200">·</span>
                <SignalBadge signal={hero.signal} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Snapshot section ── light-gray background (Granola section alternation) */}
      <section className="py-16 sm:py-24" style={{ background: "#f5f5f5" }}>
        <div className={CONTAINER}>
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">India · 2023 snapshot</h2>
              <p className="mt-1 text-sm text-neutral-500">
                All fields sorted by vacancy ratio, highest first
              </p>
            </div>
            <Link
              href="/explore"
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors whitespace-nowrap"
            >
              Explore →
            </Link>
          </div>

          {/* White card surface on gray background — Granola card pattern */}
          <div
            className="bg-white rounded-xl overflow-hidden"
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Field
                    </th>
                    <th className="px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Graduates
                    </th>
                    <th className="px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Vacancies
                    </th>
                    <th className="px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Ratio
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Signal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ snap, field }, i) => (
                    <tr
                      key={snap.entry.field}
                      style={{
                        borderBottom: i < rows.length - 1 ? "1px solid #f5f5f5" : "none",
                      }}
                    >
                      <td className="px-6 py-4 font-medium text-neutral-800">
                        {field!.label}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-neutral-500">
                        {fmt(snap.entry.graduates)}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-neutral-500">
                        {fmt(snap.entry.relevantVacancies)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-4 text-right tabular-nums font-semibold",
                          SIGNAL_META[snap.signal].color
                        )}
                      >
                        {fmtRatio(snap.vacancyRatio)}
                      </td>
                      <td className="px-6 py-4">
                        <SignalBadge signal={snap.signal} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Signal legend section ── white */}
      <section className="bg-white py-16 sm:py-24">
        <div className={CONTAINER}>
          <div className="mb-10">
            <h2 className="text-xl font-bold text-neutral-900">How to read the ratio</h2>
            <p className="mt-2 text-sm text-neutral-500 max-w-lg">
              The vacancy ratio is vacancies ÷ graduates. Above 1.0 means more vacancies than
              graduates. Below 1.0 means more graduates than vacancies.
            </p>
          </div>

          <div style={{ borderTop: "1px solid #ebebeb" }}>
            {SIGNAL_ORDER.map((sig) => {
              const meta = SIGNAL_META[sig];
              return (
                <div
                  key={sig}
                  className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:gap-10"
                  style={{ borderBottom: "1px solid #f2f2f2" }}
                >
                  <div className="flex-shrink-0 w-44">
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-widest",
                        meta.color
                      )}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="flex-1 text-sm text-neutral-600">{meta.description}</p>
                  <span className="font-mono text-xs text-neutral-400 whitespace-nowrap flex-shrink-0">
                    {SIGNAL_RANGE[sig]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Link
              href="/methodology"
              className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2"
            >
              Read the full methodology →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
