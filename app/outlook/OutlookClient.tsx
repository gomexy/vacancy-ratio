"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Select from "@/components/ui/Select";
import DataStatusBadge from "@/components/ui/DataStatusBadge";
import OutlookTimeline from "@/components/charts/OutlookTimeline";
import { computeSnapshot } from "@/lib/compute";
import {
  computeForecast,
  computeOutlookFactors,
  computeChangeScenarios,
} from "@/lib/forecast";
import {
  getAvailableYears,
  getTrendEntries,
  getAllEntries,
  getAvailableCitiesForCountry,
} from "@/lib/service";
import { FIELDS } from "@/lib/data/fields";
import { fmt } from "@/lib/utils";
import type { Country, Field } from "@/lib/types";

const C = "mx-auto max-w-3xl px-6 sm:px-12";

interface Props {
  countries: Country[];
  fields: Field[];
}

// ── Small helpers ──────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xl font-semibold tracking-tight text-neutral-900 mb-2">
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #f0f0f0" }} />;
}

function fmtCAGR(v: number): string {
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

function directionColor(
  direction: "positive" | "negative" | "neutral"
): string {
  if (direction === "positive") return "#059669";
  if (direction === "negative") return "#dc2626";
  return "#737373";
}

function directionArrow(
  direction: "positive" | "negative" | "neutral"
): string {
  if (direction === "positive") return "↑";
  if (direction === "negative") return "↓";
  return "→";
}

function scenarioTypeColor(
  type: "upside" | "downside" | "structural"
): string {
  if (type === "upside") return "#059669";
  if (type === "downside") return "#dc2626";
  return "#737373";
}

function scenarioTypeBorderColor(
  type: "upside" | "downside" | "structural"
): string {
  if (type === "upside") return "#bbf7d0";
  if (type === "downside") return "#fecaca";
  return "#e5e5e5";
}

function scenarioTypeLabel(
  type: "upside" | "downside" | "structural"
): string {
  if (type === "upside") return "↑ Upside";
  if (type === "downside") return "↓ Downside";
  return "Structural";
}

// ─────────────────────────────────────────────────────────────────────────────

export default function OutlookClient({ countries, fields }: Props) {
  const [country, setCountry] = useState("IN");
  const [field, setField] = useState("computer-science");
  const [year, setYear] = useState(2023);
  const [city, setCity] = useState<string>("");

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<"claude" | "template" | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ── Derived data ────────────────────────────────────────────────────────────

  const years = useMemo(() => getAvailableYears(country, field), [country, field]);
  const safeYear = years.includes(year) ? year : (years[0] ?? 2023);
  const cityOptions = useMemo(
    () => getAvailableCitiesForCountry(country),
    [country]
  );

  const trendEntries = useMemo(
    () => getTrendEntries(country, field),
    [country, field]
  );
  const allEntries = useMemo(
    () => getAllEntries(country, field),
    [country, field]
  );

  const forecast = useMemo(
    () => computeForecast(trendEntries),
    [trendEntries]
  );

  const outlookFactors = useMemo(
    () =>
      forecast ? computeOutlookFactors(forecast, trendEntries) : [],
    [forecast, trendEntries]
  );

  const changeScenarios = useMemo(
    () =>
      forecast
        ? computeChangeScenarios(field, forecast.outlookLabel)
        : [],
    [forecast, field]
  );

  const trendFirst = trendEntries[0];
  const trendLast = trendEntries[trendEntries.length - 1];

  const projections = useMemo(
    () => allEntries.filter((e) => e.isProjected),
    [allEntries]
  );

  const lastProjectedYear = useMemo(() => {
    if (forecast && forecast.projections.length > 0) {
      return forecast.projections[forecast.projections.length - 1].year;
    }
    return projections.length > 0
      ? Math.max(...projections.map((e) => e.year))
      : null;
  }, [forecast, projections]);

  // ── Display labels ──────────────────────────────────────────────────────────

  const fieldLabel = FIELDS.find((f) => f.slug === field)?.label ?? field;
  const countryName = countries.find((c) => c.code === country)?.name ?? country;
  const cityName = cityOptions.find((c) => c.code === city)?.name;
  const locationLabel = cityName ? `${cityName}, ${countryName}` : countryName;

  // ── Select options ──────────────────────────────────────────────────────────

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const fieldOptions = fields.map((f) => ({ value: f.slug, label: f.label }));
  const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }));
  const citySelectOptions = [
    { value: "", label: "All (national)" },
    ...cityOptions.map((c) => ({ value: c.code, label: c.name })),
  ];

  // ── AI integration ──────────────────────────────────────────────────────────

  const fetchAiOutlook = useCallback(async () => {
    if (!forecast || !trendFirst || !trendLast) return;

    setAiLoading(true);
    setAiAnalysis(null);

    const startRatio = computeSnapshot(trendLast).vacancyRatio;
    const endProjection =
      forecast.projections[forecast.projections.length - 1];

    try {
      const res = await fetch("/api/ai-outlook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldLabel,
          locationLabel,
          outlookLabel: forecast.outlookLabel,
          confidence: forecast.confidence,
          vacancyCAGR: forecast.vacancyCAGR,
          graduateCAGR: forecast.graduateCAGR,
          startRatio,
          endRatio: endProjection?.ratio ?? startRatio,
          endYear: endProjection?.year ?? trendLast.year + 5,
          dataYears: trendEntries.length,
          firstYear: trendFirst.year,
          lastYear: trendLast.year,
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
  }, [forecast, fieldLabel, locationLabel, trendEntries.length, trendFirst, trendLast]);

  useEffect(() => {
    if (forecast) fetchAiOutlook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, field, safeYear, city]);

  // ── Confidence explanation ──────────────────────────────────────────────────

  function confidenceExplanation(
    confidence: "High" | "Medium" | "Low"
  ): string {
    if (confidence === "High") return "Based on 5+ consistent data points";
    if (confidence === "Medium")
      return "Based on 4 years of demo data — directional only";
    return "Insufficient data for reliable extrapolation";
  }

  // ── Build table rows (historical + projected) ───────────────────────────────

  const tableRows = useMemo(() => {
    const rows: Array<{
      year: number;
      per100: number;
      isProjected: boolean;
    }> = [];

    for (const entry of trendEntries) {
      const snap = computeSnapshot(entry);
      rows.push({
        year: entry.year,
        per100: snap.vacancyRatio * 100,
        isProjected: false,
      });
    }

    if (forecast) {
      for (const p of forecast.projections) {
        rows.push({
          year: p.year,
          per100: p.ratio * 100,
          isProjected: true,
        });
      }
    }

    return rows;
  }, [trendEntries, forecast]);

  // ── Chart entries: trendEntries + forecast projections as synthetic entries ─

  const timelineEntries = useMemo(() => {
    if (!forecast || !trendLast) return trendEntries;
    const projectedEntries = forecast.projections.map((p) => ({
      country,
      field,
      year: p.year,
      // Back-compute graduates from ratio: proj.ratio = vacancies / graduates
      // We need a consistent set of entries. Use the last historical entry as base
      // and scale vacancies by the CAGR to reproduce the ratio.
      graduates: trendLast.graduates * Math.pow(1 + forecast.graduateCAGR / 100, p.year - trendLast.year),
      relevantVacancies: trendLast.relevantVacancies * Math.pow(1 + forecast.vacancyCAGR / 100, p.year - trendLast.year),
      source: "Projection",
      isProjected: true,
    }));
    return [...trendEntries, ...projectedEntries];
  }, [trendEntries, forecast, trendLast, country, field]);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white">

      {/* ── Filter strip ──────────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-100 bg-white">
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
              onChange={(v) => {
                setCountry(v);
                setCity("");
              }}
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

      {/* ── Sticky context strip ──────────────────────────────────────────────── */}
      {forecast && (
        <div
          className="sticky z-30 bg-white border-b border-neutral-100"
          style={{ top: 64 }}
        >
          <div className={`${C} py-2.5 flex items-center justify-between gap-4`}>
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <span className="text-sm font-semibold text-neutral-800 truncate">
                {fieldLabel}
              </span>
              <span className="text-neutral-300 flex-shrink-0">·</span>
              <span className="text-sm text-neutral-500 truncate hidden sm:block">
                {locationLabel}
              </span>
              <span className="text-neutral-300 flex-shrink-0 hidden sm:block">·</span>
              <span className="text-sm text-neutral-500 flex-shrink-0">{safeYear}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ background: outlookColor(forecast.outlookLabel) }}
              />
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: outlookColor(forecast.outlookLabel) }}
              >
                {forecast.outlookLabel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── No forecast data ──────────────────────────────────────────────────── */}
      {!forecast && (
        <div className={`${C} py-24`}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-3">
            Insufficient data
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed">
            At least 2 years of historical data are required to generate a 5-year
            outlook. Try a different country, field, or combination.
          </p>
        </div>
      )}

      {forecast && trendFirst && trendLast && (
        <>
          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION 1 — Overview                                              */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className={`${C} pt-12 pb-10`}>
            <SectionLabel>5-Year Outlook</SectionLabel>
            <h1
              className="font-semibold tracking-tight text-neutral-900 mb-1"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}
            >
              {fieldLabel} in {locationLabel}
            </h1>
            <p className="text-sm text-neutral-500 mb-8">
              Trend extrapolation from observed data — not a live forecast
            </p>

            {/* Demo disclaimer banner */}
            <div
              className="mb-8 rounded-lg px-4 py-4"
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700 mb-1">
                Illustrative projection — not a verified forecast
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Extrapolated from {trendFirst.year}–{trendLast.year} data using CAGR trend modelling.
                Actual outcomes depend on economic conditions, policy changes, and structural shifts.
              </p>
            </div>

            {/* Headline outcome */}
            <div className="mb-2">
              <p
                className="font-semibold tracking-tight leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 4rem)",
                  color: outlookColor(forecast.outlookLabel),
                }}
              >
                {forecast.outlookLabel.toUpperCase()}{" "}
                <span style={{ fontSize: "0.7em" }}>
                  {outlookArrow(forecast.outlookLabel)}
                </span>
              </p>
            </div>

            {/* Confidence badge + explanation */}
            <div className="flex items-start gap-3 mb-8">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0"
                style={{
                  background:
                    forecast.confidence === "High"
                      ? "#f0fdf4"
                      : forecast.confidence === "Medium"
                      ? "#fffbeb"
                      : "#fef2f2",
                  border:
                    forecast.confidence === "High"
                      ? "1px solid #bbf7d0"
                      : forecast.confidence === "Medium"
                      ? "1px solid #fde68a"
                      : "1px solid #fecaca",
                  color:
                    forecast.confidence === "High"
                      ? "#166534"
                      : forecast.confidence === "Medium"
                      ? "#92400e"
                      : "#991b1b",
                }}
              >
                Confidence: {forecast.confidence}
              </span>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {confidenceExplanation(forecast.confidence)}
              </p>
            </div>

            {/* CAGR row */}
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">
                  Vacancy demand
                </p>
                <p
                  className="text-2xl font-semibold tabular-nums tracking-tight"
                  style={{
                    color:
                      forecast.vacancyCAGR > forecast.graduateCAGR
                        ? "#059669"
                        : forecast.vacancyCAGR < 0
                        ? "#dc2626"
                        : "#737373",
                  }}
                >
                  {fmtCAGR(forecast.vacancyCAGR)} p.a.
                </p>
              </div>
              <div className="hidden sm:block w-px bg-neutral-100 self-stretch" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">
                  Graduate supply
                </p>
                <p className="text-2xl font-semibold tabular-nums tracking-tight text-neutral-600">
                  {fmtCAGR(forecast.graduateCAGR)} p.a.
                </p>
              </div>
            </div>
          </div>

          <Divider />

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION 2 — Timeline                                              */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className={`${C} py-12`}>
            <SectionLabel>Timeline</SectionLabel>
            <SectionHeading>Observed to Projected</SectionHeading>
            <p className="text-sm text-neutral-500 mb-8">
              {trendFirst.year}–{trendLast.year} historical data, extrapolated
              to {lastProjectedYear ?? trendLast.year + 5}
            </p>

            {/* Chart */}
            <OutlookTimeline entries={timelineEntries} />

            <div className="mt-3 flex items-center gap-3">
              <DataStatusBadge isDemo source="Extrapolation from historical trend" />
              <p className="text-[10px] text-neutral-400 font-mono">
                Projected values assume continuation of observed trend rates
              </p>
            </div>

            {/* Year-by-year table */}
            <div className="mt-10 overflow-x-auto">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                Year-by-year data
              </p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 py-2 pr-6">
                      Year
                    </th>
                    <th className="text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 py-2 pr-6">
                      Vacancies per 100 graduates
                    </th>
                    <th className="text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 py-2">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr
                      key={row.year}
                      style={{
                        borderBottom: "1px solid #f9f9f9",
                        background: row.isProjected ? "#fffdf0" : "transparent",
                      }}
                    >
                      <td className="py-2.5 pr-6 tabular-nums text-neutral-800 font-medium">
                        {row.year}
                      </td>
                      <td className="py-2.5 pr-6 tabular-nums text-right text-neutral-700">
                        {row.per100 >= 10
                          ? Math.round(row.per100)
                          : row.per100.toFixed(1)}
                      </td>
                      <td className="py-2.5 text-right">
                        {row.isProjected ? (
                          <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                            Projected
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold uppercase tracking-widest text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            Historical
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <DataStatusBadge isDemo />
            </div>
          </div>

          <Divider />

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION 3 — Why this outlook?                                     */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {outlookFactors.length > 0 && (
            <div className={`${C} py-12`}>
              <SectionLabel>Why?</SectionLabel>
              <SectionHeading>What is driving this projection?</SectionHeading>
              <p className="text-sm text-neutral-500 mb-8">
                These are the observed inputs that shape the modelled outlook.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {outlookFactors.map((factor) => (
                  <div
                    key={factor.id}
                    className="rounded-lg p-4"
                    style={{
                      border: "1px solid #f0f0f0",
                      background: "#fafafa",
                    }}
                  >
                    {/* Direction icon + label */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-base font-semibold flex-shrink-0"
                        style={{ color: directionColor(factor.direction) }}
                        aria-hidden
                      >
                        {directionArrow(factor.direction)}
                      </span>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                        {factor.label}
                      </p>
                    </div>

                    {/* Value */}
                    <p
                      className="text-2xl font-semibold tabular-nums tracking-tight mb-2"
                      style={{ color: directionColor(factor.direction) }}
                    >
                      {factor.value}
                    </p>

                    {/* Headline */}
                    <p className="text-sm font-semibold text-neutral-800 mb-1.5">
                      {factor.headline}
                    </p>

                    {/* Detail */}
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {factor.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Divider />

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION 4 — What could change this?                               */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {changeScenarios.length > 0 && (
            <div className={`${C} py-12`}>
              <SectionLabel>Uncertainty</SectionLabel>
              <SectionHeading>What could change this outlook?</SectionHeading>
              <p className="text-sm text-neutral-500 mb-8">
                These scenarios are not predictions — they illustrate the factors
                that could push outcomes above or below the baseline projection.
              </p>

              <div className="flex flex-col gap-4">
                {changeScenarios.map((scenario, i) => (
                  <div
                    key={i}
                    className="pl-4 py-4 pr-4 rounded-r-md"
                    style={{
                      borderLeft: `3px solid ${scenarioTypeBorderColor(scenario.type)}`,
                      background: "#fafafa",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: scenarioTypeColor(scenario.type) }}
                      >
                        {scenarioTypeLabel(scenario.type)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-800 mb-1">
                      {scenario.label}
                    </p>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {scenario.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Divider />

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION 5 — How this outlook was built                            */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className={`${C} py-12`}>
            <SectionLabel>Methodology</SectionLabel>
            <SectionHeading>How this outlook was built</SectionHeading>

            {/* Pipeline visualization */}
            <div className="mt-6 mb-10">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-0">
                {/* Step 1 */}
                <div
                  className="flex-1 rounded-md p-4"
                  style={{ border: "1px solid #f0f0f0", background: "#fafafa" }}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Step 1
                  </p>
                  <p className="text-sm font-semibold text-neutral-800 mb-0.5">
                    Observed data
                  </p>
                  <p className="text-xs text-neutral-500">
                    {trendFirst.year}–{trendLast.year}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    n = {trendEntries.length} years
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center px-2 text-neutral-300 text-lg md:self-center">
                  →
                </div>

                {/* Step 2 */}
                <div
                  className="flex-1 rounded-md p-4"
                  style={{ border: "1px solid #f0f0f0", background: "#fafafa" }}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Step 2
                  </p>
                  <p className="text-sm font-semibold text-neutral-800 mb-0.5">
                    CAGR model
                  </p>
                  <p className="text-xs text-neutral-500">
                    Vacancy + graduate
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    CAGR extrapolation
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center px-2 text-neutral-300 text-lg md:self-center">
                  →
                </div>

                {/* Step 3 */}
                <div
                  className="flex-1 rounded-md p-4"
                  style={{ border: "1px solid #f0f0f0", background: "#fafafa" }}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Step 3
                  </p>
                  <p className="text-sm font-semibold text-neutral-800 mb-0.5">
                    Interpretation
                  </p>
                  <p className="text-xs text-neutral-500">
                    Claude (when API key set)
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Template fallback
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center px-2 text-neutral-300 text-lg md:self-center">
                  →
                </div>

                {/* Step 4 */}
                <div
                  className="flex-1 rounded-md p-4"
                  style={{ border: "1px solid #f0f0f0", background: "#fafafa" }}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Step 4
                  </p>
                  <p className="text-sm font-semibold text-neutral-800 mb-0.5">
                    Human insight
                  </p>
                  <p className="text-xs text-neutral-500">
                    This page
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Structured context
                  </p>
                </div>
              </div>
            </div>

            {/* AI interpretation section */}
            <div
              className="rounded-lg p-5 mb-10"
              style={{ border: "1px solid #f0f0f0" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Interpretation
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
                  {aiAnalysis ?? "Generating interpretation…"}
                </p>
              )}

              {aiSource === "template" && !aiLoading && (
                <p className="mt-3 text-[10px] text-neutral-400 font-mono">
                  Set ANTHROPIC_API_KEY for AI-generated interpretation.
                </p>
              )}
            </div>

            {/* Confidence detail table */}
            <div className="mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                Confidence levels
              </p>
              <div style={{ border: "1px solid #f0f0f0", borderRadius: 6, overflow: "hidden" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                      <th className="text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 py-2.5 px-4 w-28">
                        Confidence
                      </th>
                      <th className="text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 py-2.5 px-4">
                        What it means
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #f9f9f9" }}>
                      <td className="py-2.5 px-4 text-sm font-medium text-neutral-700">High</td>
                      <td className="py-2.5 px-4 text-sm text-neutral-500">
                        5+ validated data points with external source confirmation
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f9f9f9" }}>
                      <td className="py-2.5 px-4 text-sm font-medium text-neutral-700">Medium</td>
                      <td className="py-2.5 px-4 text-sm text-neutral-500">
                        4 years of demo data — directional, not investment-grade
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-sm font-medium text-neutral-700">Low</td>
                      <td className="py-2.5 px-4 text-sm text-neutral-500">
                        Insufficient historical data for reliable trend extraction
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <p className="text-[10px] text-neutral-300 leading-relaxed font-mono mb-3">
              Projections assume current CAGR rates continue. Demo data has not been externally validated. Not financial or career advice.
            </p>
            <DataStatusBadge isDemo />
          </div>

          <Divider />

          {/* Bottom spacing */}
          <div className="pb-16" />
        </>
      )}
    </div>
  );
}
