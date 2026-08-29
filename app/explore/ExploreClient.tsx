"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Select from "@/components/ui/Select";
import RatioBarChart from "@/components/charts/RatioBarChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import OutlookChart from "@/components/charts/OutlookChart";
import SkillsBarChart from "@/components/charts/SkillsBarChart";
import DataStatusBadge from "@/components/ui/DataStatusBadge";
import RatioScaleBar from "@/components/charts/RatioScaleBar";
import { computeSnapshot, SIGNAL_META } from "@/lib/compute";
import { computeForecast } from "@/lib/forecast";
import {
  getAvailableYears,
  getEntry,
  getEntryForCity,
  getTrendEntries,
  getAllEntries,
  getAvailableCitiesForCountry,
} from "@/lib/service";
import { getSkillsForField } from "@/lib/data/mock-skills";
import { getFieldInsights } from "@/lib/insights";
import { FIELDS } from "@/lib/data/fields";
import { fmt, fmtRatio } from "@/lib/utils";
import type { Country, Field, SkillDemand } from "@/lib/types";

const C = "mx-auto max-w-5xl px-6 sm:px-12";

interface Props {
  countries: Country[];
  fields: Field[];
}

export default function ExploreClient({ countries, fields }: Props) {
  const [country, setCountry] = useState("IN");
  const [field, setField] = useState("computer-science");
  const [year, setYear] = useState(2023);
  const [city, setCity] = useState<string>("");

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<"claude" | "template" | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ── Derived data ──────────────────────────────────────────────────────────────

  const years = useMemo(() => getAvailableYears(country, field), [country, field]);
  const safeYear = years.includes(year) ? year : (years[0] ?? 2023);
  const cityOptions = useMemo(() => getAvailableCitiesForCountry(country), [country]);

  const entry = useMemo(() => {
    if (city) return getEntryForCity(country, field, safeYear, city);
    return getEntry(country, field, safeYear);
  }, [country, field, safeYear, city]);

  const snapshot = useMemo(() => (entry ? computeSnapshot(entry) : null), [entry]);

  const trendEntries = useMemo(() => getTrendEntries(country, field), [country, field]);
  const allEntries = useMemo(() => getAllEntries(country, field), [country, field]);
  const hasProjected = useMemo(() => allEntries.some((e) => e.isProjected), [allEntries]);

  const forecast = useMemo(() => computeForecast(trendEntries), [trendEntries]);

  const skills: SkillDemand[] = useMemo(
    () =>
      getSkillsForField(field).map((s) => ({
        skill: s.skill,
        pct: s.pct,
        count: Math.round(s.pct * 10),
        growthPct: s.growthPpt,
      })),
    [field]
  );

  const insights = useMemo(() => {
    if (!snapshot) return null;
    const fl = FIELDS.find((f) => f.slug === field)?.label ?? field;
    return getFieldInsights(field, snapshot.signal, snapshot.vacanciesPer100Graduates, fl);
  }, [snapshot, field]);

  const meta = snapshot ? SIGNAL_META[snapshot.signal] : null;

  // ── AI analysis ───────────────────────────────────────────────────────────────

  const fetchAiAnalysis = useCallback(async () => {
    if (!snapshot) return;
    setAiLoading(true);
    setAiAnalysis(null);

    const fieldLabel = FIELDS.find((f) => f.slug === field)?.label ?? field;
    const countryName = countries.find((c) => c.code === country)?.name ?? country;
    const cityName = cityOptions.find((c) => c.code === city)?.name;

    try {
      const res = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldLabel, countryName, cityName,
          year: safeYear,
          vacancyRatio: snapshot.vacancyRatio,
          vacanciesPer100: snapshot.vacanciesPer100Graduates,
          graduates: snapshot.entry.graduates,
          vacancies: snapshot.entry.relevantVacancies,
          signal: snapshot.signal,
          signalLabel: SIGNAL_META[snapshot.signal].label,
          vacancyCAGR: forecast?.vacancyCAGR,
          graduateCAGR: forecast?.graduateCAGR,
          outlookLabel: forecast?.outlookLabel,
          outlookConfidence: forecast?.confidence,
          topSkills: skills.slice(0, 5).map((s) => s.skill),
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.analysis ?? null);
      setAiSource(data.source ?? "template");
    } catch {
      setAiAnalysis(null);
    } finally {
      setAiLoading(false);
    }
  }, [snapshot, field, country, city, safeYear, forecast, skills, countries, cityOptions]);

  useEffect(() => {
    if (snapshot) fetchAiAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, field, safeYear, city]);

  // ── Select options ────────────────────────────────────────────────────────────

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const fieldOptions = fields.map((f) => ({ value: f.slug, label: f.label }));
  const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }));
  const citySelectOptions = [
    { value: "", label: "All (national)" },
    ...cityOptions.map((c) => ({ value: c.code, label: c.name })),
  ];

  // ── Labels for display ────────────────────────────────────────────────────────

  const fieldLabel = FIELDS.find((f) => f.slug === field)?.label ?? field;
  const countryName = countries.find((c) => c.code === country)?.name ?? country;
  const cityName = cityOptions.find((c) => c.code === city)?.name;
  const locationLabel = cityName ? `${cityName}, ${countryName}` : countryName;

  const trendFirst = trendEntries[0];
  const trendLast = trendEntries[trendEntries.length - 1];

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white">

      {/* ── Steps 1 + 2: Field & Location ─────────────────────────────────────── */}
      <div className="border-b border-neutral-100">
        <div className={`${C} py-5`}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Select
              label="Field"
              value={field}
              options={fieldOptions}
              onChange={setField}
            />
            <Select
              label="Country"
              value={country}
              options={countryOptions}
              onChange={(v) => { setCountry(v); setCity(""); }}
            />
            <Select
              label="Location"
              value={city}
              options={citySelectOptions}
              onChange={setCity}
            />
            <Select
              label="Year"
              value={String(safeYear)}
              options={yearOptions}
              onChange={(v) => setYear(Number(v))}
              disabled={years.length === 0}
            />
          </div>
          {city && (
            <p className="mt-2 text-[10px] text-neutral-400 font-mono">
              City-level vacancy estimate · Graduate supply is measured nationally
            </p>
          )}
        </div>
      </div>

      {/* ── No data ───────────────────────────────────────────────────────────── */}
      {!snapshot && (
        <div className={`${C} py-24`}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-3">
            No data
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed">
            No data available for this combination. Try a different country, field, or year.
          </p>
        </div>
      )}

      {snapshot && meta && (
        <>
          {/* ── Step 3: Current Market ──────────────────────────────────────────── */}
          <div className={`${C} pt-14 pb-12`}>

            {/* Context breadcrumb */}
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-10">
              {fieldLabel} · {locationLabel} · {safeYear}
            </p>

            {/* Signal pill */}
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1"
              style={{
                background: `${meta.hex}12`,
                border: `1px solid ${meta.hex}28`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ background: meta.hex }}
              />
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: meta.hex }}
              >
                {meta.label}
              </span>
            </div>

            {/* Ratio hero */}
            <div className="flex flex-wrap items-baseline gap-3 mb-3">
              <p
                className="font-semibold tracking-tight tabular-nums leading-none"
                style={{
                  fontSize: "clamp(4rem, 12vw, 6.5rem)",
                  color: meta.hex,
                }}
              >
                {fmtRatio(snapshot.vacancyRatio)}
              </p>
              <div className="flex flex-col gap-0.5 pb-1">
                <p className="text-sm font-medium text-neutral-500">vacancies</p>
                <p className="text-sm text-neutral-400">per graduate</p>
              </div>
            </div>

            {/* Signal description */}
            <p className="text-[15px] text-neutral-500 leading-relaxed max-w-lg mb-8">
              {meta.description}
            </p>

            {/* Scale bar */}
            <div className="mb-10 max-w-sm">
              <RatioScaleBar ratio={snapshot.vacancyRatio} />
            </div>

            {/* Supporting metrics */}
            <div
              className="flex flex-wrap gap-x-8 gap-y-6 pt-8"
              style={{ borderTop: "1px solid #f0f0f0" }}
            >
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Per 100 graduates
                </p>
                <p className="text-2xl font-semibold tabular-nums text-neutral-900 tracking-tight">
                  {fmtRatio(snapshot.vacanciesPer100Graduates)}
                </p>
                <p className="text-xs text-neutral-400">vacancies</p>
              </div>

              <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />

              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Graduates
                </p>
                <p className="text-2xl font-semibold tabular-nums text-neutral-900 tracking-tight">
                  {fmt(snapshot.entry.graduates)}
                </p>
                <p className="text-xs text-neutral-400">{safeYear} completions</p>
              </div>

              <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />

              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Vacancies
                </p>
                <p className="text-2xl font-semibold tabular-nums text-neutral-900 tracking-tight">
                  {fmt(snapshot.entry.relevantVacancies)}
                </p>
                <p className="text-xs text-neutral-400">relevant postings</p>
              </div>

              {forecast && (
                <>
                  <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      5-year outlook
                    </p>
                    <p
                      className="text-2xl font-semibold tracking-tight"
                      style={{
                        color:
                          forecast.outlookLabel === "Growing" ? "#059669"
                          : forecast.outlookLabel === "Declining" ? "#dc2626"
                          : "#6b7280",
                      }}
                    >
                      {forecast.outlookLabel}
                    </p>
                    <p className="text-xs text-neutral-400">{forecast.confidence} confidence</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Step 4: How the market has changed ─────────────────────────────── */}
          {trendEntries.length >= 2 && (
            <div style={{ borderTop: "1px solid #f0f0f0" }}>
              <div className={`${C} py-14`}>

                <div className="mb-8">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Historical trend
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                    How the market has changed
                  </h2>
                  {trendFirst && trendLast && (
                    <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                      {trendFirst.year}–{trendLast.year} ·{" "}
                      {trendLast.relevantVacancies > trendFirst.relevantVacancies
                        ? `Vacancies grew from ${fmt(trendFirst.relevantVacancies)} to ${fmt(trendLast.relevantVacancies)}`
                        : `Vacancies fell from ${fmt(trendFirst.relevantVacancies)} to ${fmt(trendLast.relevantVacancies)}`}
                    </p>
                  )}
                </div>

                {/* Primary chart: ratio by year */}
                <RatioBarChart entries={trendEntries} />

                {/* Secondary chart: supply vs demand */}
                <div className="mt-10 pt-8" style={{ borderTop: "1px solid #f5f5f5" }}>
                  <p className="text-xs text-neutral-400 mb-5">
                    Vacancy demand vs. graduate supply
                  </p>
                  <TrendLineChart entries={trendEntries} />
                  <p className="mt-3 text-[10px] text-neutral-300 font-mono">
                    Dashed line at 1.0 = one vacancy per graduate
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Five-Year Outlook ─────────────────────────────────────── */}
          {hasProjected && forecast && (
            <div style={{ borderTop: "1px solid #f0f0f0" }}>
              <div className={`${C} py-14`}>

                <div className="mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Five-year outlook
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                    Where could the market be heading?
                  </h2>
                </div>

                {/* Outlook headline */}
                <div className="mb-8">
                  <p
                    className="text-4xl font-semibold tracking-tight mb-1.5"
                    style={{
                      color:
                        forecast.outlookLabel === "Growing" ? "#059669"
                        : forecast.outlookLabel === "Declining" ? "#dc2626"
                        : "#737373",
                    }}
                  >
                    {forecast.outlookLabel}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {forecast.confidence} confidence ·{" "}
                    Vacancy demand {forecast.vacancyCAGR >= 0 ? "+" : ""}
                    {forecast.vacancyCAGR.toFixed(1)}% p.a. ·{" "}
                    Graduate supply {forecast.graduateCAGR >= 0 ? "+" : ""}
                    {forecast.graduateCAGR.toFixed(1)}% p.a.
                  </p>
                </div>

                {/* Outlook chart */}
                <OutlookChart entries={allEntries} />

                <div className="mt-3 flex items-center gap-3">
                  <DataStatusBadge isDemo source="Extrapolation from historical trend" />
                  <p className="text-[10px] text-neutral-400 font-mono">
                    Projected values assume continuation of observed trend rates
                  </p>
                </div>

                {/* Drivers + caveats — flat lists, no cards */}
                <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                      Key drivers
                    </p>
                    <ul className="flex flex-col gap-4">
                      {forecast.drivers.map((d, i) => (
                        <li key={i} className="flex gap-3 text-sm text-neutral-600">
                          <span className="text-neutral-300 flex-shrink-0 select-none">—</span>
                          <span className="leading-relaxed">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                      Caveats
                    </p>
                    <ul className="flex flex-col gap-4">
                      {forecast.caveats.map((c, i) => (
                        <li key={i} className="flex gap-3 text-sm text-neutral-500">
                          <span className="text-neutral-300 flex-shrink-0 select-none">—</span>
                          <span className="leading-relaxed">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 6: Skills ────────────────────────────────────────────────── */}
          {skills.length > 0 && (
            <div style={{ borderTop: "1px solid #f0f0f0" }}>
              <div className={`${C} py-14`}>

                <div className="mb-8">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Skills intelligence
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                    What skills are employers asking for?
                  </h2>
                  <p className="text-sm text-neutral-500 mt-2">
                    Frequency in {fieldLabel} job postings.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">
                      Most in demand
                    </p>
                    <SkillsBarChart skills={skills} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">
                      Fastest growing
                    </p>
                    <SkillsBarChart
                      skills={[...skills].sort(
                        (a, b) => (b.growthPct ?? 0) - (a.growthPct ?? 0)
                      )}
                      showGrowth
                    />
                  </div>
                </div>

                {/* All skills tags */}
                <div className="mt-10 pt-8" style={{ borderTop: "1px solid #f5f5f5" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                    All tracked skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...skills]
                      .sort((a, b) => b.pct - a.pct)
                      .map((s) => (
                        <span
                          key={s.skill}
                          className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600"
                          title={`${s.pct}% of postings${
                            s.growthPct !== undefined
                              ? ` · ${s.growthPct > 0 ? "+" : ""}${s.growthPct} ppt YoY`
                              : ""
                          }`}
                        >
                          {s.skill}
                          <span className="font-mono text-[9px] text-neutral-400">
                            {s.pct}%
                          </span>
                          {s.growthPct !== undefined && s.growthPct !== 0 && (
                            <span
                              className={`font-mono text-[9px] ${
                                s.growthPct > 10
                                  ? "text-emerald-500"
                                  : s.growthPct < 0
                                  ? "text-red-400"
                                  : "text-neutral-300"
                              }`}
                            >
                              {s.growthPct > 0 ? "↑" : "↓"}
                            </span>
                          )}
                        </span>
                      ))}
                  </div>
                  <div className="mt-4">
                    <DataStatusBadge isDemo />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 7: What This Means ───────────────────────────────────────── */}
          {insights && (
            <div style={{ borderTop: "1px solid #f0f0f0" }}>
              <div className={`${C} py-14`}>

                <div className="mb-8">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Market interpretation
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                    What this means
                  </h2>
                </div>

                <div className="max-w-2xl flex flex-col gap-10">
                  {/* Summary */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                        Market summary
                      </p>
                      {aiSource === "claude" && (
                        <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-100">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                          AI
                        </span>
                      )}
                    </div>
                    {aiLoading ? (
                      <div className="flex flex-col gap-3 animate-pulse">
                        <div className="h-4 bg-neutral-100 rounded w-full" />
                        <div className="h-4 bg-neutral-100 rounded w-5/6" />
                        <div className="h-4 bg-neutral-100 rounded w-4/6" />
                      </div>
                    ) : (
                      <p className="text-[15px] text-neutral-700 leading-relaxed">
                        {aiAnalysis ?? insights.summary}
                      </p>
                    )}
                  </div>

                  {/* Considerations */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">
                      Considerations
                    </p>
                    <ul className="flex flex-col gap-5">
                      {insights.bullets.map((b, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-neutral-300 flex-shrink-0 select-none mt-0.5">
                            —
                          </span>
                          <span className="text-sm text-neutral-600 leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-10 text-[10px] text-neutral-300 leading-relaxed max-w-2xl font-mono">
                  Insights from observed market signals. Illustrative guidance only — not personal
                  career or financial advice.
                  {aiSource === "claude"
                    ? " Summary generated by Claude from the data shown."
                    : " Set ANTHROPIC_API_KEY for AI-generated summaries."}
                </p>
              </div>
            </div>
          )}

          {/* ── Step 8: Job Opportunities ─────────────────────────────────────── */}
          <div style={{ borderTop: "1px solid #f0f0f0" }}>
            <div className={`${C} py-12`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Job opportunities
                  </p>
                  <p className="text-sm text-neutral-600">
                    Explore relevant job listings for {fieldLabel} in {locationLabel}
                  </p>
                </div>
                <Link
                  href="/jobs"
                  className="flex-shrink-0 inline-flex h-9 items-center gap-2 rounded-md bg-neutral-900 px-5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
                >
                  Browse job listings
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
