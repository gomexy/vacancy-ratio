import Link from "next/link";
import { computeSnapshot, SIGNAL_META } from "@/lib/compute";
import { getEntry, getEntriesForCountryYear, getTrendEntries } from "@/lib/service";
import { computeForecast } from "@/lib/forecast";
import { fmt, fmtRatio, cn } from "@/lib/utils";
import SignalBadge from "@/components/results/SignalBadge";
import { FIELDS } from "@/lib/data/fields";
import { getSkillsForField } from "@/lib/data/mock-skills";
import type { MarketSignal } from "@/lib/types";

// ── Data helpers ──────────────────────────────────────────────────────────────

function getPreviewData() {
  // Data Science India 2023 — shows Strong Demand, makes for a compelling preview
  const entry = getEntry("IN", "data-science", 2023);
  if (!entry) return null;
  const snap     = computeSnapshot(entry);
  const trend    = getTrendEntries("IN", "data-science");
  const forecast = computeForecast(trend);
  const skills   = getSkillsForField("data-science").slice(0, 4);
  const ratiosByYear = trend.map((e) => ({
    year: e.year,
    ratio: parseFloat((e.relevantVacancies / e.graduates).toFixed(3)),
  }));
  return { snap, forecast, skills, ratiosByYear };
}

function getComparisonRows() {
  return getEntriesForCountryYear("IN", 2023)
    .map((e) => ({ snap: computeSnapshot(e), field: FIELDS.find((f) => f.slug === e.field) }))
    .filter((x) => x.field)
    .sort((a, b) => b.snap.vacancyRatio - a.snap.vacancyRatio);
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SIGNAL_ORDER: MarketSignal[] = [
  "critical-shortage", "strong-demand", "balanced", "surplus", "significant-surplus",
];

const SIGNAL_RANGE: Record<MarketSignal, string> = {
  "critical-shortage":   "> 2.00",
  "strong-demand":       "1.00 – 2.00",
  balanced:              "0.75 – 1.00",
  surplus:               "0.50 – 0.75",
  "significant-surplus": "< 0.50",
};

const C = "mx-auto max-w-5xl px-6 sm:px-12";

export const metadata = {
  title: "VacancyRatio — Career-Market Intelligence",
  description:
    "See how graduate supply compares with job demand, explore where opportunities are strongest, and understand how your field could evolve.",
};

// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const preview = getPreviewData();
  const rows    = getComparisonRows();

  const pMeta = preview ? SIGNAL_META[preview.snap.signal] : null;

  // For the Q3 display — derive from actual forecast data
  const q3Label = preview?.forecast?.outlookLabel ?? "Growing";
  const q3CAGR  = preview?.forecast?.vacancyCAGR ?? 0;
  const q3Color =
    q3Label === "Growing" ? "#059669" : q3Label === "Declining" ? "#dc2626" : "#737373";

  // For Q2 mini bars — normalise ratios against max
  const trendRatios = preview?.ratiosByYear ?? [];
  const maxRatio    = Math.max(...trendRatios.map((r) => r.ratio), 1);

  return (
    <div className="bg-white">

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col" style={{ background: "#EBEBEB", minHeight: "calc(100vh - 64px)" }}>
        <div className={`${C} flex flex-1 flex-col py-6 sm:py-8`}>
          {/* Rounded card */}
          <div
            className="flex flex-1 flex-col overflow-hidden rounded-2xl"
            style={{ background: "#F5F5F5", boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}
          >
            {/* Two-column layout */}
            <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">

              {/* Left — headline + CTAs */}
              <div className="px-8 sm:px-10 pt-10 sm:pt-14 pb-10">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">
                  Career-market intelligence
                </p>
                <h1
                  className="font-bold leading-[1.05] tracking-tight text-neutral-900 mb-4 max-w-md"
                  style={{ fontSize: "clamp(2.4rem, 5vw, 3.75rem)" }}
                >
                  Understand where your{" "}
                  <span style={{ color: "#3B6FE8" }}>career</span>{" "}
                  is heading.
                </h1>
                <p className="text-base sm:text-[17px] text-neutral-500 leading-relaxed max-w-sm mb-8">
                  See how graduate supply compares with job demand, explore where
                  opportunities are strongest, and understand how your field could evolve.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/explore"
                    className="inline-flex h-11 items-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                  >
                    Explore your field
                  </Link>
                  <Link
                    href="/compare"
                    className="inline-flex h-11 items-center rounded-full border border-neutral-300 bg-white px-6 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    Compare fields
                  </Link>
                </div>
              </div>

              {/* Right — feature cards */}
              <div className="flex flex-col justify-center gap-3 px-6 sm:px-8 pb-8 pt-0 lg:border-l lg:pt-10 lg:pb-10" style={{ borderColor: "#E2E2E2" }}>

                {/* Explore card */}
                <div className="rounded-xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E2E2" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                        Explore
                      </p>
                      <div className="flex flex-col gap-2">
                        {[
                          "Vacancy-to-graduate ratio",
                          "Historical trend view",
                          "Skills in demand",
                          "City-level market strength",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2.5">
                            <span className="flex-shrink-0 text-xs font-bold" style={{ color: "#3B6FE8" }}>✓</span>
                            <span className="text-sm text-neutral-600">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link
                      href="/explore"
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 text-sm font-semibold text-neutral-400 transition-all hover:border-neutral-400 hover:text-neutral-700"
                      aria-label="Go to Explore"
                    >
                      +
                    </Link>
                  </div>
                </div>

                {/* Outlook + Compare card */}
                <div className="rounded-xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E2E2" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                        Outlook &amp; Compare
                      </p>
                      <div className="flex flex-col gap-2">
                        {[
                          "5-year trend projection",
                          "CAGR and growth analysis",
                          "Field-level comparison",
                          "AI-assisted interpretation",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2.5">
                            <span className="flex-shrink-0 text-xs font-bold" style={{ color: "#3B6FE8" }}>✓</span>
                            <span className="text-sm text-neutral-600">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link
                      href="/outlook"
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 text-sm font-semibold text-neutral-400 transition-all hover:border-neutral-400 hover:text-neutral-700"
                      aria-label="Go to Outlook"
                    >
                      +
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* Gradient banner */}
            <div
              className="relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #A5B4FF 0%, #7B97F5 35%, #4A7BF7 70%, #3B6FE8 100%)",
                height: 152,
              }}
            >
              {/* Waveform bars */}
              <div
                className="absolute inset-y-0 left-0 flex items-center gap-1.5"
                style={{ paddingLeft: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                {[28,45,72,100,80,112,64,88,115,76,96,122,84,68,104,56,90,118,72,60,94,80,44,66,100].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 rounded-full"
                      style={{ width: 3, height: `${h}px`, background: "rgba(255,255,255,0.22)" }}
                    />
                  )
                )}
              </div>

              {/* 3D sphere */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  right: "clamp(2rem, 8vw, 6rem)",
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 32%, #DDE8FF 0%, #7B97F5 45%, #2B55D8 75%, #1A3AB0 100%)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(30,60,180,0.4)",
                }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Product preview ──────────────────────────────────────────────── */}
      {preview && pMeta && (
        <section style={{ borderTop: "1px solid #efefef", borderBottom: "1px solid #efefef" }}>
          <div className={C}>
            <div className="py-12 sm:py-16">

              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-10">
                Example · Data Science · India · 2023
              </p>

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto]">

                {/* Left — ratio hero */}
                <div className="max-w-lg">
                  {/* Signal pill */}
                  <div
                    className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1"
                    style={{ background: `${pMeta.hex}12`, border: `1px solid ${pMeta.hex}28` }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ background: pMeta.hex }}
                    />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: pMeta.hex }}
                    >
                      {pMeta.label}
                    </span>
                  </div>

                  {/* Big ratio */}
                  <div className="flex flex-wrap items-baseline gap-3 mb-3">
                    <p
                      className="font-semibold tracking-tight tabular-nums leading-none"
                      style={{
                        fontSize: "clamp(3.5rem, 10vw, 5rem)",
                        color: pMeta.hex,
                      }}
                    >
                      {fmtRatio(preview.snap.vacancyRatio)}
                    </p>
                    <div className="flex flex-col gap-0.5 pb-1">
                      <span className="text-sm font-medium text-neutral-500">vacancies</span>
                      <span className="text-sm text-neutral-400">per graduate</span>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-500 leading-relaxed mb-8 max-w-sm">
                    {pMeta.description}
                  </p>

                  {/* Supporting stats */}
                  <div
                    className="flex flex-wrap gap-x-8 gap-y-5 pt-7"
                    style={{ borderTop: "1px solid #f0f0f0" }}
                  >
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">
                        Per 100 graduates
                      </p>
                      <p className="text-2xl font-semibold tabular-nums text-neutral-900 tracking-tight">
                        {fmtRatio(preview.snap.vacanciesPer100Graduates)}
                      </p>
                    </div>
                    <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">
                        Graduates
                      </p>
                      <p className="text-2xl font-semibold tabular-nums text-neutral-900 tracking-tight">
                        {fmt(preview.snap.entry.graduates)}
                      </p>
                    </div>
                    <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">
                        Vacancies
                      </p>
                      <p className="text-2xl font-semibold tabular-nums text-neutral-900 tracking-tight">
                        {fmt(preview.snap.entry.relevantVacancies)}
                      </p>
                    </div>
                    {preview.forecast && (
                      <>
                        <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">
                            5-year outlook
                          </p>
                          <p
                            className="text-2xl font-semibold tracking-tight"
                            style={{ color: q3Color }}
                          >
                            {preview.forecast.outlookLabel}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right — skills panel */}
                <div
                  className="lg:w-60 lg:border-l lg:pl-8"
                  style={{ borderColor: "#f0f0f0" }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">
                    Top skills in demand
                  </p>
                  <div className="flex flex-col gap-3">
                    {preview.skills.map((s) => (
                      <div key={s.skill} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-700">{s.skill}</span>
                          <span className="flex items-center gap-1">
                            <span className="font-mono text-xs text-neutral-400">{s.pct}%</span>
                            {s.growthPpt > 15 && (
                              <span className="text-emerald-500 text-xs">↑</span>
                            )}
                          </span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-neutral-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${s.pct}%`,
                              background: pMeta.hex,
                              opacity: 0.5 + (s.pct / 200),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 text-[10px] text-neutral-300 font-mono leading-relaxed">
                    Demo data · Illustrative figures
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Three questions ──────────────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid #efefef" }}>
        <div className={C}>
          <div className="py-16 sm:py-20">

            <div className="mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
                What VacancyRatio answers
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Three questions. One clear picture.
              </h2>
            </div>

            <div className="grid grid-cols-1 divide-y divide-neutral-100 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">

              {/* Q1 — What's happening now */}
              <div className="py-8 sm:py-0 sm:pr-10">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-5">
                  01
                </p>
                <h3 className="text-base font-semibold text-neutral-900 mb-3">
                  What is happening now?
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                  The current vacancy-to-graduate ratio tells you immediately whether
                  demand is strong, balanced, or in surplus for any field and location.
                </p>
                {preview && pMeta && (
                  <div>
                    <p
                      className="text-4xl font-semibold tabular-nums tracking-tight leading-none mb-2"
                      style={{ color: pMeta.hex }}
                    >
                      {fmtRatio(preview.snap.vacancyRatio)}
                    </p>
                    <p className="text-xs text-neutral-400 mb-2">vacancies per graduate</p>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: pMeta.hex }}
                    >
                      {pMeta.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Q2 — How has it changed */}
              <div className="py-8 sm:py-0 sm:px-10">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-5">
                  02
                </p>
                <h3 className="text-base font-semibold text-neutral-900 mb-3">
                  How has the market changed?
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                  Track how vacancy demand and graduate supply have moved over multiple
                  years to see whether conditions are improving or tightening.
                </p>
                {trendRatios.length > 0 && (
                  <div>
                    <div className="flex items-end gap-1.5 h-12 mb-2">
                      {trendRatios.map((r, i) => {
                        const isLast = i === trendRatios.length - 1;
                        return (
                          <div key={r.year} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full rounded-sm"
                              style={{
                                height: `${(r.ratio / maxRatio) * 48}px`,
                                background: isLast
                                  ? (pMeta?.hex ?? "#2563eb")
                                  : "#e5e7eb",
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between font-mono text-[9px] text-neutral-300">
                      {trendRatios.map((r) => (
                        <span key={r.year}>{r.year}</span>
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] text-neutral-400">
                      Data Science vacancy ratio · India
                    </p>
                  </div>
                )}
              </div>

              {/* Q3 — Where is it heading */}
              <div className="py-8 sm:py-0 sm:pl-10">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-5">
                  03
                </p>
                <h3 className="text-base font-semibold text-neutral-900 mb-3">
                  Where could it be heading?
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                  A CAGR-based five-year projection shows whether demand is likely to
                  outpace supply — or the other way around.
                </p>
                <div>
                  <p
                    className="text-4xl font-semibold tracking-tight leading-none mb-2"
                    style={{ color: q3Color }}
                  >
                    {q3Label}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {preview?.forecast?.confidence ?? "Medium"} confidence ·{" "}
                    Vacancy demand +{q3CAGR.toFixed(1)}% p.a.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Field comparison snapshot ────────────────────────────────────── */}
      <section>
        <div className={C}>
          <div className="py-16 sm:py-20">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between mb-10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
                  Field comparison
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  Not all fields are equal.
                </h2>
                <p className="text-sm text-neutral-500 mt-2 max-w-lg leading-relaxed">
                  India 2023 — the same country, the same year, very different markets.
                </p>
              </div>
              <Link
                href="/compare"
                className="text-xs text-neutral-400 hover:text-neutral-800 transition-colors whitespace-nowrap mt-2 sm:mt-0"
              >
                Full comparison →
              </Link>
            </div>

            <div style={{ borderTop: "1px solid #ebebeb" }}>
              {rows.map(({ snap, field }, i) => {
                const m = SIGNAL_META[snap.signal];
                const barWidth = Math.min(snap.vacancyRatio / 2.0, 1.0) * 100;
                return (
                  <div
                    key={snap.entry.field}
                    className="flex items-center gap-5 py-4"
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                  >
                    {/* Rank */}
                    <span className="font-mono text-[10px] text-neutral-300 w-4 flex-shrink-0 text-right">
                      {i + 1}
                    </span>

                    {/* Field name */}
                    <span className="text-sm font-medium text-neutral-800 w-44 flex-shrink-0 truncate">
                      {field!.label}
                    </span>

                    {/* Bar track */}
                    <div className="flex-1 hidden sm:flex items-center">
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${barWidth}%`, background: m.hex }}
                        />
                      </div>
                    </div>

                    {/* Ratio */}
                    <span
                      className="font-semibold tabular-nums text-sm w-10 text-right flex-shrink-0"
                      style={{ color: m.hex }}
                    >
                      {fmtRatio(snap.vacancyRatio)}
                    </span>

                    {/* Signal */}
                    <span className="w-36 hidden sm:block">
                      <SignalBadge signal={snap.signal} />
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-[10px] text-neutral-300 font-mono">
              Demo data · Ratio = vacancies ÷ graduates · Above 1.0 = more vacancies than graduates
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. How to read the ratio ────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid #efefef" }}>
        <div className={C}>
          <div className="py-16 sm:py-20">
            <div className="max-w-2xl">

              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
                The metric
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-3">
                How to read the ratio
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed mb-10">
                Vacancy ratio = job vacancies ÷ graduates for a given field and year. Above 1.0
                means more vacancies than graduates. Below 1.0 means more graduates than vacancies.
              </p>

              {/* Scale bar */}
              <div className="mb-10">
                <div className="flex h-2 rounded-full overflow-hidden mb-2">
                  <div style={{ width: "25%",  background: "#fca5a5" }} />
                  <div style={{ width: "12.5%",background: "#fde68a" }} />
                  <div style={{ width: "12.5%",background: "#e5e5e5" }} />
                  <div style={{ width: "50%",  background: "#93c5fd" }} />
                </div>
                <div className="flex justify-between font-mono text-[9px] text-neutral-300">
                  <span>0</span><span>0.5</span><span>1.0</span><span>2.0+</span>
                </div>
              </div>

              {/* Signal definitions */}
              <div style={{ borderTop: "1px solid #ebebeb" }}>
                {SIGNAL_ORDER.map((sig) => {
                  const m = SIGNAL_META[sig];
                  return (
                    <div
                      key={sig}
                      className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8"
                      style={{ borderBottom: "1px solid #f5f5f5" }}
                    >
                      <div className="flex items-center gap-3 flex-shrink-0 sm:w-52">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-widest"
                          style={{ color: m.hex }}
                        >
                          {m.label}
                        </span>
                        <span className="font-mono text-[9px] text-neutral-300">
                          {SIGNAL_RANGE[sig]}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <Link
                  href="/methodology"
                  className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  Read the full methodology →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Footer CTA ───────────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid #efefef", background: "#fafafa" }}>
        <div className={C}>
          <div className="py-14 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-neutral-900 mb-1">
                Start with your field.
              </h2>
              <p className="text-sm text-neutral-500 max-w-sm">
                Pick a field and location to see the current market, historical trend,
                and five-year outlook.
              </p>
            </div>
            <Link
              href="/explore"
              className="flex-shrink-0 inline-flex h-10 items-center gap-2 rounded-md bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Explore a field
              <svg
                width="11" height="11" viewBox="0 0 12 12" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              >
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
