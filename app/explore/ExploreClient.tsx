"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Select from "@/components/ui/Select";
import MetricRow from "@/components/results/MetricRow";
import RatioBarChart from "@/components/charts/RatioBarChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import OutlookChart from "@/components/charts/OutlookChart";
import SkillsBarChart from "@/components/charts/SkillsBarChart";
import DataStatusBadge from "@/components/ui/DataStatusBadge";
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
import { fmt } from "@/lib/utils";
import type { Country, Field, SkillDemand } from "@/lib/types";

const CONTAINER = "mx-auto max-w-5xl px-6 sm:px-12";

interface Props {
  countries: Country[];
  fields:    Field[];
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-1 mb-8">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] font-semibold text-neutral-300 select-none">
          {number}
        </span>
        <h2 className="text-base font-semibold text-neutral-800 tracking-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="ml-7 text-sm text-neutral-400 leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ExploreClient({ countries, fields }: Props) {
  const [country, setCountry] = useState("IN");
  const [field,   setField]   = useState("computer-science");
  const [year,    setYear]    = useState(2023);
  const [city,    setCity]    = useState<string>(""); // "" = national

  // AI analysis state
  const [aiAnalysis,  setAiAnalysis]  = useState<string | null>(null);
  const [aiSource,    setAiSource]    = useState<"claude" | "template" | null>(null);
  const [aiLoading,   setAiLoading]   = useState(false);

  // ── Derived data ────────────────────────────────────────────────────────────

  const years      = useMemo(() => getAvailableYears(country, field), [country, field]);
  const safeYear   = years.includes(year) ? year : (years[0] ?? 2023);

  const cityOptions = useMemo(() => getAvailableCitiesForCountry(country), [country]);

  const entry = useMemo(() => {
    if (city) return getEntryForCity(country, field, safeYear, city);
    return getEntry(country, field, safeYear);
  }, [country, field, safeYear, city]);

  const snapshot = useMemo(() => (entry ? computeSnapshot(entry) : null), [entry]);

  const trendEntries  = useMemo(() => getTrendEntries(country, field), [country, field]);
  const allEntries    = useMemo(() => getAllEntries(country, field),    [country, field]);
  const hasProjected  = useMemo(() => allEntries.some((e) => e.isProjected), [allEntries]);

  const forecast = useMemo(() => computeForecast(trendEntries), [trendEntries]);

  const skills: SkillDemand[] = useMemo(
    () =>
      getSkillsForField(field).map((s) => ({
        skill:     s.skill,
        pct:       s.pct,
        count:     Math.round(s.pct * 10),
        growthPct: s.growthPpt,
      })),
    [field]
  );

  const trendSubtitle = useMemo(() => {
    if (trendEntries.length < 2) return undefined;
    const first = trendEntries[0];
    const last  = trendEntries[trendEntries.length - 1];
    const diff  = last.relevantVacancies - first.relevantVacancies;
    const dir   = diff > 0 ? "grew" : "fell";
    return `Vacancies ${dir} from ${fmt(first.relevantVacancies)} (${first.year}) to ${fmt(last.relevantVacancies)} (${last.year})`;
  }, [trendEntries]);

  const insights = useMemo(() => {
    if (!snapshot) return null;
    const fieldLabel = FIELDS.find((f) => f.slug === field)?.label ?? field;
    return getFieldInsights(
      field,
      snapshot.signal,
      snapshot.vacanciesPer100Graduates,
      fieldLabel
    );
  }, [snapshot, field]);

  const meta = snapshot ? SIGNAL_META[snapshot.signal] : null;

  // ── AI analysis fetch ───────────────────────────────────────────────────────

  const fetchAiAnalysis = useCallback(async () => {
    if (!snapshot) return;
    setAiLoading(true);
    setAiAnalysis(null);

    const fieldLabel  = FIELDS.find((f) => f.slug === field)?.label ?? field;
    const countryName = countries.find((c) => c.code === country)?.name ?? country;
    const cityName    = cityOptions.find((c) => c.code === city)?.name;

    try {
      const res = await fetch("/api/ai-analysis", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          fieldLabel,
          countryName,
          cityName,
          year:           safeYear,
          vacancyRatio:   snapshot.vacancyRatio,
          vacanciesPer100: snapshot.vacanciesPer100Graduates,
          graduates:      snapshot.entry.graduates,
          vacancies:      snapshot.entry.relevantVacancies,
          signal:         snapshot.signal,
          signalLabel:    SIGNAL_META[snapshot.signal].label,
          vacancyCAGR:    forecast?.vacancyCAGR,
          graduateCAGR:   forecast?.graduateCAGR,
          outlookLabel:   forecast?.outlookLabel,
          outlookConfidence: forecast?.confidence,
          topSkills:      skills.slice(0, 5).map((s) => s.skill),
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

  // Fetch AI analysis whenever snapshot changes
  useEffect(() => {
    if (snapshot) {
      fetchAiAnalysis();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, field, safeYear, city]);

  // ── Select options ──────────────────────────────────────────────────────────

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const fieldOptions   = fields.map((f)   => ({ value: f.slug,  label: f.label }));
  const yearOptions    = years.map((y)    => ({ value: String(y), label: String(y) }));
  const citySelectOptions = [
    { value: "",    label: "All (national)" },
    ...cityOptions.map((c) => ({ value: c.code, label: c.name })),
  ];

  // ── Section number helper ───────────────────────────────────────────────────

  let sectionN = 0;
  const nextSection = () => String(++sectionN).padStart(2, "0");

  sectionN = 0; // reset for render

  return (
    <div>
      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb" }}>
        <div className={CONTAINER}>
          <div
            className="my-6 rounded-xl px-6 py-5"
            style={{ background: "#f7f7f7", boxShadow: "var(--shadow-sm)" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
              Select parameters
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select label="Country" value={country} options={countryOptions}
                onChange={(v) => { setCountry(v); setCity(""); }} />
              <Select label="Field"   value={field}   options={fieldOptions}
                onChange={(v) => { setField(v); }} />
              <Select label="Location" value={city}   options={citySelectOptions}
                onChange={setCity} />
              <Select
                label="Year"
                value={String(safeYear)}
                options={yearOptions}
                onChange={(v) => setYear(Number(v))}
                disabled={years.length === 0}
              />
            </div>
            {city && (
              <p className="mt-3 text-[10px] text-neutral-400 font-mono">
                Showing city-level vacancy estimate · Graduate supply is measured nationally
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── No data state ───────────────────────────────────────────────────── */}
      {!snapshot && (
        <div className={`${CONTAINER} py-24`}>
          <div className="max-w-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-3">
              No data
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              No data available for this combination. Try a different country,
              field, or year.
            </p>
          </div>
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {snapshot && (() => { sectionN = 0; return true; })() && (
        <>
          {/* ── Section 01 · Current Market ─────────────────────────────── */}
          <div className="bg-white">
            <div className={`${CONTAINER} pt-12 pb-4`}>
              <SectionHeader number={nextSection()} title="Current Market" />
              <MetricRow snapshot={snapshot} />
            </div>
          </div>

          {/* ── Section 02 · Historical Trend ───────────────────────────── */}
          <div className="py-14" style={{ background: "#f5f5f5" }}>
            <div className={CONTAINER}>
              <SectionHeader
                number={nextSection()}
                title="Historical Trend"
                subtitle={`${trendEntries[0]?.year ?? ""}–${trendEntries[trendEntries.length - 1]?.year ?? ""} · Graduate supply vs. vacancy demand over time`}
              />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-md)" }}>
                  <RatioBarChart entries={trendEntries} subtitle={trendSubtitle} />
                </div>
                <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-md)" }}>
                  <TrendLineChart entries={trendEntries} />
                  <p className="mt-3 text-[10px] text-neutral-300 font-mono">
                    Dashed line at 1.0 = one vacancy per graduate
                  </p>
                </div>
              </div>

              {/* Forecast summary strip */}
              {forecast && (
                <div className="mt-6 rounded-xl border border-neutral-200 bg-white px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-10"
                  style={{ boxShadow: "var(--shadow-sm)" }}>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Vacancy growth (CAGR)
                    </p>
                    <p className="text-xl font-semibold tabular-nums text-neutral-900">
                      {forecast.vacancyCAGR.toFixed(1)}% p.a.
                    </p>
                  </div>
                  <div className="w-px bg-neutral-100 self-stretch hidden sm:block" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Graduate growth (CAGR)
                    </p>
                    <p className="text-xl font-semibold tabular-nums text-neutral-900">
                      {forecast.graduateCAGR.toFixed(1)}% p.a.
                    </p>
                  </div>
                  <div className="w-px bg-neutral-100 self-stretch hidden sm:block" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      5-year outlook
                    </p>
                    <p className={`text-xl font-semibold ${
                      forecast.outlookLabel === "Growing" ? "text-emerald-600"
                      : forecast.outlookLabel === "Declining" ? "text-red-500"
                      : "text-neutral-500"
                    }`}>
                      {forecast.outlookLabel}
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 align-middle">
                        · {forecast.confidence} confidence
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Section 03 · Five-Year Outlook ──────────────────────────── */}
          {hasProjected && (
            <div className="bg-white py-14">
              <div className={CONTAINER}>
                <SectionHeader
                  number={nextSection()}
                  title="Five-Year Outlook"
                  subtitle="Illustrative projection extending the historical trend to 2029. Clearly labelled as projected — not observed data."
                />
                <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-md)" }}>
                  <OutlookChart entries={allEntries} />
                  <div className="mt-4 flex items-start gap-2 pt-4 border-t border-neutral-50">
                    <DataStatusBadge isDemo source="Extrapolation from 2021–2024 trend" />
                    <p className="text-[11px] text-neutral-400 leading-relaxed max-w-xl">
                      Projected values assume continuation of the observed vacancy and graduate
                      growth rates. Actual outcomes depend on policy, economic conditions, and
                      structural shifts not captured in this model.
                    </p>
                  </div>
                </div>

                {/* Drivers + caveats */}
                {forecast && (
                  <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                        Key drivers
                      </p>
                      <ul className="flex flex-col gap-3">
                        {forecast.drivers.map((d, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-neutral-600">
                            <span className="text-neutral-300 flex-shrink-0">—</span>
                            <span className="leading-relaxed">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                        Caveats
                      </p>
                      <ul className="flex flex-col gap-3">
                        {forecast.caveats.map((c, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-neutral-500">
                            <span className="text-neutral-300 flex-shrink-0">—</span>
                            <span className="leading-relaxed">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Section 04 · Skills Intelligence ────────────────────────── */}
          {skills.length > 0 && (
            <div className="py-14" style={{ background: "#f5f5f5" }}>
              <div className={CONTAINER}>
                <SectionHeader
                  number={nextSection()}
                  title="Skills Employers Are Asking For"
                  subtitle="Based on illustrative job posting analysis for this field. Connect a live provider for real skill-frequency data."
                />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Top skills */}
                  <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-md)" }}>
                    <p className="text-sm font-medium text-neutral-800 mb-1">Top skills in demand</p>
                    <p className="text-xs text-neutral-400 mb-4">
                      % of job postings mentioning each skill
                    </p>
                    <SkillsBarChart skills={skills} />
                    <DataStatusBadge isDemo className="mt-4" />
                  </div>

                  {/* Fastest-growing skills */}
                  <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-md)" }}>
                    <p className="text-sm font-medium text-neutral-800 mb-1">Fastest-growing skills</p>
                    <p className="text-xs text-neutral-400 mb-4">
                      Year-on-year change in posting frequency (percentage points)
                    </p>
                    <SkillsBarChart
                      skills={[...skills].sort(
                        (a, b) => (b.growthPct ?? 0) - (a.growthPct ?? 0)
                      )}
                      showGrowth
                    />
                    <DataStatusBadge isDemo className="mt-4" />
                  </div>
                </div>

                {/* Skills list for quick scanning */}
                <div className="mt-6 bg-white rounded-xl px-6 py-5" style={{ boxShadow: "var(--shadow-sm)" }}>
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
                          title={`${s.pct}% of postings${s.growthPct !== undefined ? ` · ${s.growthPct > 0 ? "+" : ""}${s.growthPct} ppt YoY` : ""}`}
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
                </div>
              </div>
            </div>
          )}

          {/* ── Section 05 · What This Means ────────────────────────────── */}
          {insights && (
            <div
              className="py-14"
              style={{ background: skills.length > 0 ? "white" : "#f5f5f5" }}
            >
              <div className={CONTAINER}>
                <SectionHeader
                  number={nextSection()}
                  title="What This Means"
                />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                  {/* AI Analysis */}
                  <div
                    className="lg:col-span-3 bg-white rounded-xl p-6 flex flex-col gap-4"
                    style={{ boxShadow: "var(--shadow-md)" }}
                  >
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                        Market Summary
                      </p>
                      {aiSource === "claude" && (
                        <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-100">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                          AI
                        </span>
                      )}
                    </div>

                    {aiLoading ? (
                      <div className="flex flex-col gap-2.5 animate-pulse">
                        <div className="h-3 bg-neutral-100 rounded w-full" />
                        <div className="h-3 bg-neutral-100 rounded w-5/6" />
                        <div className="h-3 bg-neutral-100 rounded w-4/6" />
                      </div>
                    ) : aiAnalysis ? (
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {aiAnalysis}
                      </p>
                    ) : (
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {insights.summary}
                      </p>
                    )}

                    {/* Signal chip */}
                    <div
                      className="mt-auto inline-flex w-fit items-center rounded px-2 py-0.5"
                      style={{ background: `${meta!.hex}12`, color: meta!.hex }}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-widest">
                        {meta!.label}
                      </span>
                    </div>
                  </div>

                  {/* Actionable bullets */}
                  <div
                    className="lg:col-span-2 bg-white rounded-xl p-6"
                    style={{ boxShadow: "var(--shadow-md)" }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">
                      Considerations
                    </p>
                    <ul className="flex flex-col gap-4">
                      {insights.bullets.map((b, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-neutral-200 flex-shrink-0 select-none mt-0.5">—</span>
                          <span className="text-sm text-neutral-600 leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-6 text-[10px] text-neutral-300 leading-relaxed max-w-2xl">
                  Insights are generated from observed market signals and field-level analysis.
                  They are illustrative guidance, not personal career or financial advice.
                  {aiSource === "claude"
                    ? " Market summary generated by Claude based on the data shown above."
                    : " Set ANTHROPIC_API_KEY to enable AI-generated market summaries."}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
