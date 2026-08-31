import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { computeSnapshot, SIGNAL_META } from "@/lib/compute";
import { getEntry, getEntriesForCountryYear, getTrendEntries } from "@/lib/service";
import { computeForecast } from "@/lib/forecast";
import { fmt, fmtRatio, cn } from "@/lib/utils";
import { FIELDS } from "@/lib/data/fields";
import { getSkillsForField } from "@/lib/data/mock-skills";
import type { MarketSignal } from "@/lib/types";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "800"], display: "swap" });

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
    <div style={{ background: "#F0F0F0" }}>

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="flex overflow-hidden"
        style={{ minHeight: "calc(100vh - 64px)", background: "#FFFFFF" }}
      >
        {/* ── Left: white content column ──────────────────────────────────── */}
        <div
          className="flex flex-col justify-center w-full py-16 lg:w-[54%]"
          style={{
            paddingLeft: "max(1.5rem, calc((100vw - 64rem) / 2 + 3rem))",
            paddingRight: "clamp(2rem, 4vw, 3.5rem)",
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              marginBottom: "1.5rem",
            }}
          >
            Career-market intelligence
          </p>

          {/* Headline — serif display */}
          <h1
            className={playfair.className}
            style={{
              fontSize: "clamp(3rem, 6.5vw, 5rem)",
              fontWeight: 800,
              lineHeight: 1.06,
              color: "#111827",
              marginBottom: "2.5rem",
              maxWidth: "14ch",
            }}
          >
            Understand where your{" "}
            <span style={{ color: "#F5C518" }}>career</span>{" "}
            is heading.
          </h1>

          {/* Checklist */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
              marginBottom: "2.5rem",
            }}
          >
            {[
              "Vacancy-to-graduate ratio",
              "Historical trend analysis",
              "Skills in demand",
              "Location market strength",
            ].map((item) => (
              <div
                key={item}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
              >
                <span style={{ color: "#F5C518", fontSize: 15, fontWeight: 600, flexShrink: 0, lineHeight: 1 }}>
                  ✓
                </span>
                <span style={{ fontSize: 14, color: "#9CA3AF" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Pill "more info" button */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 self-start rounded-full transition-colors hover:bg-neutral-200"
            style={{
              background: "#F3F4F6",
              border: "1px solid #E5E7EB",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              paddingLeft: "1rem",
              paddingRight: "1.25rem",
              color: "#6B7280",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#9CA3AF", lineHeight: 1 }}>+</span>
            more info
          </Link>
        </div>

        {/* ── Right: tall card, bleeds flush to viewport right edge ──────── */}
        <div
          className="hidden lg:block lg:w-[46%] relative overflow-hidden flex-shrink-0"
          style={{
            borderRadius: "2.5rem 0 0 2.5rem",
            background: "linear-gradient(155deg, #FFFEF8 0%, #FFFAE8 28%, #FFF5D0 62%, #FFFEF2 100%)",
          }}
        >
          {/* Ambient glow — sphere light bleeding into background */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "32%",
              transform: "translate(-50%, -50%)",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: "radial-gradient(circle at center, rgba(245,197,24,0.28) 0%, rgba(202,138,4,0.12) 44%, transparent 70%)",
              filter: "blur(52px)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          {/* Ribbed frosted-glass panel */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "5%",
              transform: "translateY(-50%)",
              width: "44%",
              height: "76%",
              borderRadius: 72,
              background: "repeating-linear-gradient(to right, rgba(255,255,255,0.70) 0px, rgba(255,255,255,0.70) 7px, rgba(253,224,71,0.14) 7px, rgba(253,224,71,0.14) 16px)",
              boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.60), 0 0 0 1px rgba(245,197,24,0.12)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          {/* 3D Glossy Sphere — emerges from behind the ribbed panel */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "35%",
              transform: "translateY(-50%)",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: [
                "radial-gradient(",
                "circle at 32% 28%,",
                "rgba(255,255,255,0.97) 0%,",
                "rgba(255,255,255,0.80) 4%,",
                "#FEFCE8 11%,",
                "#FDE047 26%,",
                "#F5C518 50%,",
                "#CA8A04 68%,",
                "#854D0E 86%,",
                "#422006 100%",
                ")",
              ].join(""),
              boxShadow: "0 24px 64px rgba(202,138,4,0.50), 0 0 0 1px rgba(255,255,255,0.20)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        </div>
      </section>

      {/* ── 2. Product preview ──────────────────────────────────────────────── */}
      {preview && pMeta && (
        <section>
          <div className={C}>
            <div className="py-10 sm:py-12">
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-12">

                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-10">
                  Example · Data Science · India · 2023
                </p>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto]">

                  {/* Left — ratio hero */}
                  <div className="max-w-lg">
                    <div
                      className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1"
                      style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "#F5C518" }} />
                      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#92600A" }}>
                        {pMeta.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-baseline gap-3 mb-3">
                      <p
                        className="font-semibold tracking-tight tabular-nums leading-none"
                        style={{ fontSize: "clamp(3.5rem, 10vw, 5rem)", color: "#F5C518" }}
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

                    <div className="flex flex-wrap gap-x-8 gap-y-5 pt-7" style={{ borderTop: "1px solid #F3F4F6" }}>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">Per 100 graduates</p>
                        <p className="text-2xl font-semibold tabular-nums text-neutral-900 tracking-tight">{fmtRatio(preview.snap.vacanciesPer100Graduates)}</p>
                      </div>
                      <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">Graduates</p>
                        <p className="text-2xl font-semibold tabular-nums text-neutral-900 tracking-tight">{fmt(preview.snap.entry.graduates)}</p>
                      </div>
                      <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">Vacancies</p>
                        <p className="text-2xl font-semibold tabular-nums text-neutral-900 tracking-tight">{fmt(preview.snap.entry.relevantVacancies)}</p>
                      </div>
                      {preview.forecast && (
                        <>
                          <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">5-year outlook</p>
                            <p className="text-2xl font-semibold tracking-tight" style={{ color: "#F5C518" }}>
                              {preview.forecast.outlookLabel}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right — skills panel */}
                  <div className="lg:w-60 lg:border-l lg:pl-8" style={{ borderColor: "#F3F4F6" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">Top skills in demand</p>
                    <div className="flex flex-col gap-3">
                      {preview.skills.map((s) => (
                        <div key={s.skill} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-700">{s.skill}</span>
                            <span className="flex items-center gap-1">
                              <span className="font-mono text-xs text-neutral-400">{s.pct}%</span>
                              {s.growthPpt > 15 && <span className="text-neutral-400 text-xs">↑</span>}
                            </span>
                          </div>
                          <div className="h-1 w-full rounded-full bg-neutral-100 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${s.pct}%`, background: "#F5C518", opacity: 0.4 + (s.pct / 200) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 text-[10px] text-neutral-300 font-mono leading-relaxed">Demo data · Illustrative figures</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Three questions ──────────────────────────────────────────────── */}
      <section>
        <div className={C}>
          <div className="py-10 sm:py-12">

            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
                What VacancyRatio answers
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Three questions. One clear picture.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Q1 */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-5">01</p>
                <h3 className="text-base font-semibold text-neutral-900 mb-3">What is happening now?</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                  The current vacancy-to-graduate ratio tells you immediately whether
                  demand is strong, balanced, or in surplus for any field and location.
                </p>
                {preview && pMeta && (
                  <div>
                    <p className="text-4xl font-semibold tabular-nums tracking-tight leading-none mb-2" style={{ color: "#F5C518" }}>
                      {fmtRatio(preview.snap.vacancyRatio)}
                    </p>
                    <p className="text-xs text-neutral-400 mb-2">vacancies per graduate</p>
                    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#92600A" }}>
                      {SIGNAL_META[preview.snap.signal].label}
                    </span>
                  </div>
                )}
              </div>

              {/* Q2 */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-5">02</p>
                <h3 className="text-base font-semibold text-neutral-900 mb-3">How has the market changed?</h3>
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
                              style={{ height: `${(r.ratio / maxRatio) * 48}px`, background: isLast ? "#F5C518" : "#E5E7EB" }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between font-mono text-[9px] text-neutral-300">
                      {trendRatios.map((r) => <span key={r.year}>{r.year}</span>)}
                    </div>
                    <p className="mt-2 text-[10px] text-neutral-400">Data Science vacancy ratio · India</p>
                  </div>
                )}
              </div>

              {/* Q3 */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-5">03</p>
                <h3 className="text-base font-semibold text-neutral-900 mb-3">Where could it be heading?</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                  A CAGR-based five-year projection shows whether demand is likely to
                  outpace supply — or the other way around.
                </p>
                <div>
                  <p className="text-4xl font-semibold tracking-tight leading-none mb-2" style={{ color: "#F5C518" }}>
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
          <div className="py-10 sm:py-12">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">

              <div
                className="flex flex-col gap-2 px-8 pt-8 pb-6 sm:flex-row sm:items-baseline sm:justify-between"
                style={{ borderBottom: "1px solid #F3F4F6" }}
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Field comparison</p>
                  <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Not all fields are equal.</h2>
                  <p className="text-sm text-neutral-500 mt-1 max-w-lg">India 2023 — the same country, the same year, very different markets.</p>
                </div>
                <Link href="/compare" className="text-xs text-neutral-400 hover:text-neutral-800 transition-colors whitespace-nowrap mt-2 sm:mt-0">
                  Full comparison →
                </Link>
              </div>

              <div className="px-8 pb-2">
                {rows.map(({ snap, field }, i) => {
                  const barWidth = Math.min(snap.vacancyRatio / 2.0, 1.0) * 100;
                  return (
                    <div
                      key={snap.entry.field}
                      className="flex items-center gap-5 py-4"
                      style={{ borderBottom: i < rows.length - 1 ? "1px solid #F9FAFB" : "none" }}
                    >
                      <span className="font-mono text-[10px] text-neutral-300 w-4 flex-shrink-0 text-right">{i + 1}</span>
                      <span className="text-sm font-medium text-neutral-800 w-44 flex-shrink-0 truncate">{field!.label}</span>
                      <div className="flex-1 hidden sm:flex items-center">
                        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${barWidth}%`, background: "#F5C518" }} />
                        </div>
                      </div>
                      <span className="font-semibold tabular-nums text-sm w-10 text-right flex-shrink-0" style={{ color: "#F5C518" }}>
                        {fmtRatio(snap.vacancyRatio)}
                      </span>
                      <span className="w-36 hidden sm:block">
                        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#92600A" }}>
                          {SIGNAL_META[snap.signal].label}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="px-8 pb-6 pt-2">
                <p className="text-[10px] text-neutral-300 font-mono">Demo data · Ratio = vacancies ÷ graduates · Above 1.0 = more vacancies than graduates</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 5. How to read the ratio ────────────────────────────────────────── */}
      <section>
        <div className={C}>
          <div className="py-10 sm:py-12">
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-12">
              <div className="max-w-2xl">

                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">The metric</p>
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-3">How to read the ratio</h2>
                <p className="text-sm text-neutral-500 leading-relaxed mb-10">
                  Vacancy ratio = job vacancies ÷ graduates for a given field and year. Above 1.0
                  means more vacancies than graduates. Below 1.0 means more graduates than vacancies.
                </p>

                <div className="mb-10">
                  <div className="flex h-2 rounded-full overflow-hidden mb-2">
                    <div style={{ width: "25%",  background: "#fca5a5" }} />
                    <div style={{ width: "12.5%", background: "#fde68a" }} />
                    <div style={{ width: "12.5%", background: "#e5e5e5" }} />
                    <div style={{ width: "50%",  background: "#FDE68A" }} />
                  </div>
                  <div className="flex justify-between font-mono text-[9px] text-neutral-300">
                    <span>0</span><span>0.5</span><span>1.0</span><span>2.0+</span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #F3F4F6" }}>
                  {SIGNAL_ORDER.map((sig) => {
                    const m = SIGNAL_META[sig];
                    return (
                      <div
                        key={sig}
                        className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8"
                        style={{ borderBottom: "1px solid #F9FAFB" }}
                      >
                        <div className="flex items-center gap-3 flex-shrink-0 sm:w-52">
                          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#92600A" }}>
                            {m.label}
                          </span>
                          <span className="font-mono text-[9px] text-neutral-300">{SIGNAL_RANGE[sig]}</span>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed">{m.description}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <Link href="/methodology" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
                    Read the full methodology →
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA ──────────────────────────────────────────────────────────── */}
      <section>
        <div className={C}>
          <div className="py-16 sm:py-20 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-3">
              Start with your field.
            </h2>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-8">
              Pick a field and location to see the current market, historical trend, and five-year outlook.
            </p>
            <Link
              href="/explore"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-neutral-900 px-7 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Explore a field
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
