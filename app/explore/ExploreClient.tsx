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
  getCityVacancyBreakdown,
} from "@/lib/service";
import { getSkillsForField } from "@/lib/data/mock-skills";
import { getFieldInsights } from "@/lib/insights";
import { computeSynthesis } from "@/lib/synthesis";
import { FIELDS } from "@/lib/data/fields";
import { fmt, fmtRatio } from "@/lib/utils";
import type { Country, Field, SkillDemand } from "@/lib/types";

const C = "mx-auto max-w-5xl px-6 sm:px-12";

interface Props {
  countries: Country[];
  fields: Field[];
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
      {children}
    </p>
  );
}

function SectionQuestion({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xl font-semibold tracking-tight text-neutral-900 mb-2">
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #f0f0f0" }} />;
}

function fmtPer100(v: number): string {
  if (v >= 10) return Math.round(v).toString();
  return v.toFixed(1);
}

function fmtCagr(v: number): string {
  const sign = v >= 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}

function outlookArrow(label: "Growing" | "Stable" | "Declining"): string {
  if (label === "Growing") return "↑";
  if (label === "Declining") return "↓";
  return "→";
}

function outlookColor(label: "Growing" | "Stable" | "Declining"): string {
  if (label === "Growing") return "#059669";
  if (label === "Declining") return "#dc2626";
  return "#737373";
}

function SignalRow({
  label,
  value,
  detail,
  valueColor,
}: {
  label: string;
  value: string;
  detail?: string;
  valueColor?: string;
}) {
  return (
    <div
      className="flex items-start gap-4 py-3.5"
      style={{ borderBottom: "1px solid #f5f5f5" }}
    >
      <p className="w-32 flex-shrink-0 pt-0.5 text-[10px] font-semibold uppercase leading-relaxed tracking-widest text-neutral-400">
        {label}
      </p>
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <span className="flex-shrink-0 pt-0.5 text-sm text-neutral-300">
          →
        </span>
        <div className="min-w-0">
          <p
            className="text-sm font-semibold leading-snug text-neutral-800"
            style={valueColor ? { color: valueColor } : undefined}
          >
            {value}
          </p>
          {detail && (
            <p className="mt-0.5 text-xs leading-relaxed text-neutral-400">
              {detail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ExploreClient({ countries, fields }: Props) {
  const [country, setCountry] = useState("IN");
  const [field, setField] = useState("computer-science");
  const [year, setYear] = useState(2023);
  const [city, setCity] = useState<string>("");

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<"claude" | "template" | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ── Derived data ──────────────────────────────────────────────────────────

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

  const cityBreakdown = useMemo(
    () => getCityVacancyBreakdown(country, field, safeYear),
    [country, field, safeYear]
  );

  const topCities = useMemo(
    () =>
      [...cityBreakdown]
        .sort((a, b) => b.vacancies - a.vacancies)
        .slice(0, 3)
        .map((b) => b.city.name),
    [cityBreakdown]
  );

  const synthesis = useMemo(() => {
    if (!snapshot) return null;
    const fl = FIELDS.find((f) => f.slug === field)?.label ?? field;
    return computeSynthesis(snapshot, forecast ?? null, skills, topCities, fl);
  }, [snapshot, forecast, skills, topCities, field]);

  // Derived trend sentence for the historical section
  const trendAnswer = useMemo(() => {
    if (!forecast || trendEntries.length < 2) return null;
    const v = forecast.vacancyCAGR;
    const g = forecast.graduateCAGR;
    const diff = v - g;
    if (diff > 2)
      return `Yes — vacancy demand grew ${v.toFixed(1)}% p.a., outpacing graduate supply (${g.toFixed(1)}% p.a.). The ratio has been improving.`;
    if (diff < -2)
      return `No — graduate supply grew ${g.toFixed(1)}% p.a., faster than vacancy demand (${v.toFixed(1)}% p.a.). Competition for roles has increased.`;
    return `Broadly in line — vacancy demand (${v.toFixed(1)}% p.a.) and graduate supply (${g.toFixed(1)}% p.a.) have grown at similar rates.`;
  }, [forecast, trendEntries]);

  // Projected year range for the outlook section
  const projectedRange = useMemo(() => {
    const proj = allEntries
      .filter((e) => e.isProjected)
      .map((e) => e.year)
      .sort((a, b) => a - b);
    if (proj.length === 0) return null;
    return { first: proj[0], last: proj[proj.length - 1] };
  }, [allEntries]);

  const trendFirst = trendEntries[0];
  const trendLast = trendEntries[trendEntries.length - 1];

  // ── AI analysis ───────────────────────────────────────────────────────────

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

  // ── Select options ────────────────────────────────────────────────────────

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const fieldOptions = fields.map((f) => ({ value: f.slug, label: f.label }));
  const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }));
  const citySelectOptions = [
    { value: "", label: "All (national)" },
    ...cityOptions.map((c) => ({ value: c.code, label: c.name })),
  ];

  // ── Display labels ────────────────────────────────────────────────────────

  const fieldLabel = FIELDS.find((f) => f.slug === field)?.label ?? field;
  const countryName = countries.find((c) => c.code === country)?.name ?? country;
  const cityName = cityOptions.find((c) => c.code === city)?.name;
  const locationLabel = cityName ? `${cityName}, ${countryName}` : countryName;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: "#F0F0F0" }}>

      {/* ── Selection strip ────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-200 bg-white">
        <div className={`${C} py-5`}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Select label="Field" value={field} options={fieldOptions} onChange={setField} />
            <Select
              label="Country"
              value={country}
              options={countryOptions}
              onChange={(v) => { setCountry(v); setCity(""); }}
            />
            <Select label="Location" value={city} options={citySelectOptions} onChange={setCity} />
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

      {/* ── Sticky context strip ─────────────────────────────────────────────── */}
      {snapshot && meta && (
        <div className="sticky z-30 bg-white border-b border-neutral-200" style={{ top: 64 }}>
          <div className={`${C} py-2.5 flex items-center justify-between gap-4`}>
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <span className="text-sm font-semibold text-neutral-800 truncate">{fieldLabel}</span>
              <span className="text-neutral-300 flex-shrink-0">·</span>
              <span className="text-sm text-neutral-500 truncate hidden sm:block">{locationLabel}</span>
              <span className="text-neutral-300 flex-shrink-0 hidden sm:block">·</span>
              <span className="text-sm text-neutral-500 flex-shrink-0">{safeYear}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "#F5C518" }} />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#92600A" }}>
                {meta.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── No data ──────────────────────────────────────────────────────────── */}
      {!snapshot && (
        <div className={`${C} py-24`}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-3">No data</p>
          <p className="text-sm text-neutral-400 leading-relaxed">
            No data available for this combination. Try a different country, field, or year.
          </p>
        </div>
      )}

      {snapshot && meta && (
        <div className={`${C} py-8 sm:py-10`}>

          {/* Context heading */}
          <div className="mb-4">
            <h1 className="font-semibold tracking-tight text-neutral-900 mb-1" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
              {fieldLabel}
            </h1>
            <p className="text-base text-neutral-500">{locationLabel} · {safeYear}</p>
          </div>

          <div className="grid grid-cols-12 gap-4">

          {/* ── Cell A — Current Market ── */}
          <div className="col-span-12 lg:col-span-7 rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10">
            <SectionLabel>Current Market</SectionLabel>

            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1"
              style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
            >
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "#F5C518" }} />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#92600A" }}>
                {meta.label}
              </span>
            </div>

            <div className="mb-2">
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <span
                  className="font-semibold tabular-nums tracking-tight leading-none"
                  style={{ fontSize: "clamp(4rem, 12vw, 6.5rem)", color: "#F5C518" }}
                >
                  {fmtPer100(snapshot.vacanciesPer100Graduates)}
                </span>
                <span className="text-base text-neutral-500 pb-1.5">vacancies per 100 graduates</span>
              </div>
            </div>

            <p className="text-[15px] text-neutral-500 leading-relaxed max-w-lg mb-8">{meta.description}</p>

            <div className="mb-10 flex flex-col gap-3 max-w-sm">
              <RatioScaleBar ratio={snapshot.vacancyRatio} />
              <p className="text-xs text-neutral-400">Ratio: {fmtRatio(snapshot.vacancyRatio)} vacancies per graduate</p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-6 pt-8" style={{ borderTop: "1px solid #F3F4F6" }}>
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Graduates</p>
                <p className="text-xl font-semibold tabular-nums text-neutral-900 tracking-tight">{fmt(snapshot.entry.graduates)}</p>
                <p className="text-xs text-neutral-400">{safeYear} completions</p>
              </div>
              <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Relevant Vacancies</p>
                <p className="text-xl font-semibold tabular-nums text-neutral-900 tracking-tight">{fmt(snapshot.entry.relevantVacancies)}</p>
                <p className="text-xs text-neutral-400">job postings</p>
              </div>
              {forecast && (
                <>
                  <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Vacancy Growth</p>
                    <p className="text-xl font-semibold tabular-nums text-neutral-900 tracking-tight">{fmtCagr(forecast.vacancyCAGR)}</p>
                    <p className="text-xs text-neutral-400">per year (CAGR)</p>
                  </div>
                  <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Graduate Growth</p>
                    <p className="text-xl font-semibold tabular-nums text-neutral-900 tracking-tight">{fmtCagr(forecast.graduateCAGR)}</p>
                    <p className="text-xs text-neutral-400">per year (CAGR)</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Cell B — Historical Trend ── */}
          {trendEntries.length >= 2 && (
            <div className="col-span-12 lg:col-span-5 rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10">
              <SectionLabel>Historical Trend</SectionLabel>
              <SectionQuestion>Is vacancy demand growing faster than graduate supply?</SectionQuestion>

              {trendAnswer && (
                <p className="text-sm text-neutral-600 leading-relaxed max-w-xl mb-10">{trendAnswer}</p>
              )}
              {!trendAnswer && trendFirst && trendLast && (
                <p className="text-sm text-neutral-500 leading-relaxed mb-10">
                  {trendFirst.year}–{trendLast.year} ·{" "}
                  {trendLast.relevantVacancies > trendFirst.relevantVacancies
                    ? `Vacancies grew from ${fmt(trendFirst.relevantVacancies)} to ${fmt(trendLast.relevantVacancies)}`
                    : `Vacancies fell from ${fmt(trendFirst.relevantVacancies)} to ${fmt(trendLast.relevantVacancies)}`}
                </p>
              )}

              <RatioBarChart entries={trendEntries} />

              <div className="mt-10 pt-8" style={{ borderTop: "1px solid #F3F4F6" }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">Vacancy ratio over time</p>
                <p className="text-sm text-neutral-500 mb-5">Ratio = vacancies ÷ graduates. Above 1.0 means more vacancies than graduates.</p>
                <TrendLineChart entries={trendEntries} />
              </div>

              {forecast && (
                <div className="mt-8 flex flex-wrap gap-8 pt-6" style={{ borderTop: "1px solid #F3F4F6" }}>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">Vacancy demand (CAGR)</p>
                    <p
                      className="text-2xl font-semibold tabular-nums tracking-tight"
                      style={{ color: forecast.vacancyCAGR > forecast.graduateCAGR ? "#059669" : "#dc2626" }}
                    >
                      {fmtCagr(forecast.vacancyCAGR)} p.a.
                    </p>
                  </div>
                  <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">Graduate supply (CAGR)</p>
                    <p className="text-2xl font-semibold tabular-nums tracking-tight text-neutral-600">{fmtCagr(forecast.graduateCAGR)} p.a.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Cell C — Skills ── */}
          {skills.length > 0 && (
            <div className="col-span-12 lg:col-span-5 rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10">
              <SectionLabel>Skills</SectionLabel>
              <SectionQuestion>What skills are employers prioritising right now?</SectionQuestion>
              <p className="text-sm text-neutral-500 mb-10">
                Frequency in {fieldLabel} job postings.{" "}
                <span className="text-neutral-400">Demo data.</span>
              </p>

              <div className="grid grid-cols-1 gap-10">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">Most in demand</p>
                  <SkillsBarChart skills={skills} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">Fastest growing</p>
                  <SkillsBarChart skills={[...skills].sort((a, b) => (b.growthPct ?? 0) - (a.growthPct ?? 0))} showGrowth />
                </div>
              </div>

              <div className="mt-10 pt-8" style={{ borderTop: "1px solid #F3F4F6" }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">All tracked skills</p>
                <div className="flex flex-wrap gap-2">
                  {[...skills].sort((a, b) => b.pct - a.pct).map((s) => (
                    <span
                      key={s.skill}
                      className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600"
                      title={`${s.pct}% of postings${s.growthPct !== undefined ? ` · ${s.growthPct > 0 ? "+" : ""}${s.growthPct} ppt YoY` : ""}`}
                    >
                      {s.skill}
                      <span className="font-mono text-[9px] text-neutral-400">{s.pct}%</span>
                      {s.growthPct !== undefined && s.growthPct !== 0 && (
                        <span className={`font-mono text-[9px] ${s.growthPct > 10 ? "text-emerald-500" : s.growthPct < 0 ? "text-red-400" : "text-neutral-300"}`}>
                          {s.growthPct > 0 ? "↑" : "↓"}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <div className="mt-4"><DataStatusBadge isDemo /></div>
              </div>
            </div>
          )}

          {/* ── Cell D — Five-Year Outlook ── */}
          {hasProjected && forecast && (
            <div className="col-span-12 lg:col-span-7 rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10">
              <SectionLabel>5-Year Outlook</SectionLabel>
              <SectionQuestion>Where could this market be heading?</SectionQuestion>

              <div className="mb-8 rounded-xl px-4 py-3.5" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700 mb-1">Projection · Not observed data</p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Extrapolated from{" "}
                  {trendFirst ? trendFirst.year : "historical"}–{trendLast ? trendLast.year : "trend"}{" "}
                  data. Assumes current vacancy and graduate growth rates continue unchanged.
                  Actual outcomes depend on economic conditions, policy, and structural shifts.
                </p>
              </div>

              <div className="mb-2">
                <p
                  className="font-semibold tracking-tight leading-none mb-2"
                  style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", color: outlookColor(forecast.outlookLabel) }}
                >
                  {forecast.outlookLabel}{" "}
                  <span style={{ fontSize: "0.7em" }}>{outlookArrow(forecast.outlookLabel)}</span>
                </p>
                <p className="text-sm text-neutral-500">
                  {projectedRange ? `${projectedRange.first} → ${projectedRange.last}` : "5-year projection"}{" "}
                  · <span className="font-medium text-neutral-600">{forecast.confidence} confidence</span>
                </p>
              </div>

              <p className="text-sm text-neutral-400 mb-10">
                Vacancy demand {fmtCagr(forecast.vacancyCAGR)} p.a. · Graduate supply {fmtCagr(forecast.graduateCAGR)} p.a.
              </p>

              <OutlookChart entries={allEntries} />

              <div className="mt-3 flex items-center gap-3">
                <DataStatusBadge isDemo source="Extrapolation from historical trend" />
                <p className="text-[10px] text-neutral-400 font-mono">Projected values assume continuation of observed trend rates</p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">Key drivers</p>
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
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">Caveats</p>
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
          )}

          {/* ── Cell E — What This Means ── */}
          {insights && (
            <div className="col-span-12 lg:col-span-8 rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10">
              <SectionLabel>What This Means</SectionLabel>
              <SectionQuestion>What does this data tell you?</SectionQuestion>

              <div className="max-w-2xl mb-10">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Market summary</p>
                  {aiSource === "claude" && (
                    <span
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest"
                      style={{ color: "#92600A", background: "#FFFBEB", border: "1px solid #FDE68A" }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "#F5C518" }} />
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
                  <p className="text-[15px] text-neutral-700 leading-relaxed">{aiAnalysis ?? insights.summary}</p>
                )}
              </div>

              {synthesis && (
                <div className="max-w-2xl" style={{ borderTop: "1px solid #F3F4F6" }}>
                  <div className="flex items-center justify-between pt-6 mb-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Key signals</p>
                    <DataStatusBadge isDemo />
                  </div>

                  <SignalRow label="Key takeaway" value={synthesis.keyTakeaway.label} detail={synthesis.keyTakeaway.detail} valueColor="#92600A" />

                  {synthesis.mainOpportunity && (
                    <SignalRow label="Main opportunity" value={synthesis.mainOpportunity.label} detail={synthesis.mainOpportunity.detail} />
                  )}

                  {synthesis.mainRisk && (
                    <SignalRow label="Main risk" value={synthesis.mainRisk.label} detail={synthesis.mainRisk.detail} valueColor="#d97706" />
                  )}

                  {synthesis.skillsToWatch.length > 0 && (
                    <SignalRow label="Skills to watch" value={synthesis.skillsToWatch.join("  ·  ")} detail="Fastest-growing skills by year-on-year change in job postings." />
                  )}

                  {synthesis.bestLocations.length > 0 && !city && (
                    <SignalRow label="Best locations" value={synthesis.bestLocations.join("  ·  ")} detail="Estimated top cities by vacancy concentration for this field and country." />
                  )}

                  {synthesis.fiveYearOutlook && (
                    <SignalRow label="5-year outlook" value={synthesis.fiveYearOutlook.label} detail={synthesis.fiveYearOutlook.detail} valueColor={outlookColor(synthesis.fiveYearOutlook.label)} />
                  )}
                </div>
              )}

              <div className="mt-10 max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">Further context</p>
                <ul className="flex flex-col gap-5">
                  {insights.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-neutral-300 flex-shrink-0 select-none mt-0.5">—</span>
                      <span className="text-sm text-neutral-600 leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-10 max-w-2xl font-mono text-[10px] leading-relaxed text-neutral-300">
                Illustrative guidance only — not personal career or financial advice.
                {aiSource === "claude" ? " Summary generated by Claude from the data shown." : " Set ANTHROPIC_API_KEY for AI-generated summaries."}
              </p>
            </div>
          )}

          {/* ── Cell F — Jobs CTA ── */}
          <div className="col-span-12 lg:col-span-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">Job opportunities</p>
                <p className="text-sm text-neutral-600">Explore relevant listings for {fieldLabel} in {locationLabel}</p>
              </div>
              <Link
                href="/jobs"
                className="flex-shrink-0 inline-flex h-9 items-center gap-2 rounded-full bg-neutral-900 px-5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
              >
                Browse job listings
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 6h8M6 2l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>

          </div>

        </div>
      )}
    </div>
  );
}
