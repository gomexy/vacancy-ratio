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

const C = "mx-auto max-w-5xl px-6 sm:px-12";

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

function Badge({
  icon,
  bg,
  color,
}: {
  icon: string;
  bg: string;
  color: string;
}) {
  return (
    <span
      className={`flex-shrink-0 flex items-center justify-center rounded-lg ${bg} ${color}`}
      style={{ width: 36, height: 36 }}
    >
      <i className={`ti ti-${icon}`} style={{ fontSize: 18 }} />
    </span>
  );
}

function CardTitle({
  icon,
  bg,
  color,
  children,
}: {
  icon: string;
  bg: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <Badge icon={icon} bg={bg} color={color} />
      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
        {children}
      </p>
    </div>
  );
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
    <div style={{ background: "#F0F0F0" }}>

      {/* ── Filter strip ──────────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-200 bg-white">
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
          className="sticky z-30 bg-white border-b border-neutral-200"
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
        <div className={`${C} py-6 flex flex-col gap-4`}>

          {/* ── Row 1: Hero + Timeline ─────────────────────────────────────────── */}
          <div className="grid grid-cols-12 gap-4">

            {/* Card 1 — Overview */}
            <div className="col-span-12 lg:col-span-5 rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-5">
              <CardTitle icon="trending-up" bg="bg-blue-50" color="text-blue-600">
                5-Year Outlook
              </CardTitle>

              <div>
                <h1
                  className="font-semibold tracking-tight text-neutral-900"
                  style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}
                >
                  {fieldLabel} in {locationLabel}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  Trend extrapolation from observed data — not a live forecast
                </p>
              </div>

              {/* Demo disclaimer */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2">
                <i
                  className="ti ti-info-circle flex-shrink-0"
                  style={{ fontSize: 14, color: "#d97706", marginTop: 2 }}
                />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700 mb-0.5">
                    Illustrative projection
                  </p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Extrapolated from {trendFirst.year}–{trendLast.year} data using CAGR trend
                    modelling. Actual outcomes depend on economic conditions, policy changes, and
                    structural shifts.
                  </p>
                </div>
              </div>

              {/* Outlook badge */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                  Outlook
                </p>
                <p
                  className="font-semibold tracking-tight leading-none"
                  style={{
                    fontSize: "clamp(2rem, 6vw, 3rem)",
                    color: outlookColor(forecast.outlookLabel),
                  }}
                >
                  {forecast.outlookLabel.toUpperCase()}{" "}
                  <span style={{ fontSize: "0.7em" }}>{outlookArrow(forecast.outlookLabel)}</span>
                </p>
              </div>

              {/* Confidence row */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 flex items-center gap-3">
                <i
                  className="ti ti-shield-check flex-shrink-0"
                  style={{
                    fontSize: 20,
                    color:
                      forecast.confidence === "High"
                        ? "#059669"
                        : forecast.confidence === "Medium"
                        ? "#d97706"
                        : "#dc2626",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                    Confidence
                  </p>
                  <p className="text-sm font-semibold text-neutral-800">{forecast.confidence}</p>
                </div>
                <p className="text-xs text-neutral-500 text-right leading-relaxed max-w-[140px]">
                  {confidenceExplanation(forecast.confidence)}
                </p>
              </div>

              {/* CAGR stat chips */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Vacancy demand
                  </p>
                  <p
                    className="text-xl font-semibold tabular-nums tracking-tight"
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
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Graduate supply
                  </p>
                  <p className="text-xl font-semibold tabular-nums tracking-tight text-neutral-600">
                    {fmtCAGR(forecast.graduateCAGR)} p.a.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 — Timeline */}
            <div className="col-span-12 lg:col-span-7 rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-5">
              <CardTitle icon="chart-line" bg="bg-violet-50" color="text-violet-600">
                Timeline
              </CardTitle>

              <div>
                <p className="text-sm font-semibold text-neutral-800">Observed to Projected</p>
                <p className="text-sm text-neutral-500">
                  {trendFirst.year}–{trendLast.year} historical data, extrapolated to{" "}
                  {lastProjectedYear ?? trendLast.year + 5}
                </p>
              </div>

              {/* Chart */}
              <OutlookTimeline entries={timelineEntries} />

              <div className="flex items-center gap-3">
                <DataStatusBadge isDemo source="Extrapolation from historical trend" />
                <p className="text-[10px] text-neutral-400 font-mono">
                  Projected values assume continuation of observed trend rates
                </p>
              </div>

              {/* Year-by-year table */}
              <div className="rounded-xl border border-neutral-200 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-neutral-200 bg-neutral-50">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                    Year-by-year data
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                        <th className="text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 py-2 px-4">
                          Year
                        </th>
                        <th className="text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 py-2 px-4">
                          Vacancies per 100 graduates
                        </th>
                        <th className="text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 py-2 px-4">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row) => (
                        <tr
                          key={row.year}
                          style={{
                            borderBottom: "1px solid #F9FAFB",
                            background: row.isProjected ? "#FFFBEB" : "transparent",
                          }}
                        >
                          <td className="py-2.5 px-4 tabular-nums text-neutral-800 font-medium">
                            {row.year}
                          </td>
                          <td className="py-2.5 px-4 tabular-nums text-right text-neutral-700">
                            {row.per100 >= 10
                              ? Math.round(row.per100)
                              : row.per100.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            {row.isProjected ? (
                              <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                Projected
                              </span>
                            ) : (
                              <span
                                className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded"
                                style={{
                                  color: "#92600A",
                                  background: "#FFFBEB",
                                  border: "1px solid #FDE68A",
                                }}
                              >
                                Historical
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <DataStatusBadge isDemo />
            </div>

          </div>

          {/* ── Row 2: Drivers + Scenarios ─────────────────────────────────────── */}
          {(outlookFactors.length > 0 || changeScenarios.length > 0) && (
            <div className="grid grid-cols-12 gap-4">

              {/* Card 3 — Why this outlook? */}
              {outlookFactors.length > 0 && (
                <div
                  className={`col-span-12${changeScenarios.length > 0 ? " lg:col-span-6" : ""} rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-5`}
                >
                  <CardTitle icon="bulb" bg="bg-amber-50" color="text-amber-600">
                    Why this outlook?
                  </CardTitle>
                  <p className="text-sm text-neutral-500">
                    Observed inputs that shape the modelled outlook.
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {outlookFactors.map((factor) => (
                      <div
                        key={factor.id}
                        className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-semibold flex-shrink-0"
                            style={{ color: directionColor(factor.direction) }}
                          >
                            {directionArrow(factor.direction)}
                          </span>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                            {factor.label}
                          </p>
                        </div>
                        <p
                          className="text-xl font-semibold tabular-nums tracking-tight"
                          style={{ color: directionColor(factor.direction) }}
                        >
                          {factor.value}
                        </p>
                        <p className="text-sm font-semibold text-neutral-800">{factor.headline}</p>
                        <p className="text-xs text-neutral-500 leading-relaxed">{factor.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card 4 — What could change? */}
              {changeScenarios.length > 0 && (
                <div
                  className={`col-span-12${outlookFactors.length > 0 ? " lg:col-span-6" : ""} rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-5`}
                >
                  <CardTitle icon="alert-triangle" bg="bg-neutral-100" color="text-neutral-500">
                    What could change?
                  </CardTitle>
                  <p className="text-sm text-neutral-500">
                    Not predictions — factors that could push outcomes above or below the baseline.
                  </p>

                  <div className="flex flex-col gap-3">
                    {changeScenarios.map((scenario, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-neutral-50 p-4"
                        style={{
                          border: "1px solid #e5e5e5",
                          borderLeftColor: scenarioTypeBorderColor(scenario.type),
                          borderLeftWidth: 3,
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
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {scenario.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ── Card 5 — Methodology ──────────────────────────────────────────── */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-5">
            <CardTitle icon="git-branch" bg="bg-blue-50" color="text-blue-600">
              Methodology
            </CardTitle>
            <p className="text-sm text-neutral-500">How this outlook was built</p>

            <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-0">

              <div className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full bg-neutral-200 text-neutral-600 font-semibold"
                    style={{ width: 20, height: 20, fontSize: 11 }}
                  >
                    1
                  </span>
                  <p className="text-sm font-semibold text-neutral-800">Observed data</p>
                </div>
                <p className="text-xs text-neutral-500">{trendFirst.year}–{trendLast.year}</p>
                <p className="text-xs text-neutral-400 mt-0.5">n = {trendEntries.length} years</p>
              </div>

              <div className="flex items-center justify-center px-2 text-neutral-300 text-lg md:self-center">→</div>

              <div className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full bg-neutral-200 text-neutral-600 font-semibold"
                    style={{ width: 20, height: 20, fontSize: 11 }}
                  >
                    2
                  </span>
                  <p className="text-sm font-semibold text-neutral-800">CAGR model</p>
                </div>
                <p className="text-xs text-neutral-500">Vacancy + graduate</p>
                <p className="text-xs text-neutral-400 mt-0.5">CAGR extrapolation</p>
              </div>

              <div className="flex items-center justify-center px-2 text-neutral-300 text-lg md:self-center">→</div>

              <div className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full bg-neutral-200 text-neutral-600 font-semibold"
                    style={{ width: 20, height: 20, fontSize: 11 }}
                  >
                    3
                  </span>
                  <p className="text-sm font-semibold text-neutral-800">Interpretation</p>
                </div>
                <p className="text-xs text-neutral-500">Claude (when API key set)</p>
                <p className="text-xs text-neutral-400 mt-0.5">Template fallback</p>
              </div>

              <div className="flex items-center justify-center px-2 text-neutral-300 text-lg md:self-center">→</div>

              <div className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full bg-neutral-200 text-neutral-600 font-semibold"
                    style={{ width: 20, height: 20, fontSize: 11 }}
                  >
                    4
                  </span>
                  <p className="text-sm font-semibold text-neutral-800">Human insight</p>
                </div>
                <p className="text-xs text-neutral-500">This page</p>
                <p className="text-xs text-neutral-400 mt-0.5">Structured context</p>
              </div>

            </div>
          </div>

          {/* ── Card 6 — AI Interpretation ────────────────────────────────────── */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle icon="robot" bg="bg-violet-50" color="text-violet-600">
                Interpretation
              </CardTitle>
              {aiSource === "claude" && !aiLoading && (
                <span
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-[9px] font-semibold uppercase tracking-widest"
                  style={{ color: "#92600A", background: "#FFFBEB", border: "1px solid #FDE68A" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "#F5C518" }} />
                  AI
                </span>
              )}
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
              {aiLoading ? (
                <div className="flex flex-col gap-3 animate-pulse">
                  <div className="h-4 bg-neutral-200 rounded w-full" />
                  <div className="h-4 bg-neutral-200 rounded w-5/6" />
                  <div className="h-4 bg-neutral-200 rounded w-4/6" />
                </div>
              ) : (
                <p className="text-[15px] text-neutral-700 leading-relaxed">
                  {aiAnalysis ?? "Generating interpretation…"}
                </p>
              )}
            </div>

            {aiSource === "template" && !aiLoading && (
              <p className="text-[10px] text-neutral-400 font-mono">
                Set ANTHROPIC_API_KEY for AI-generated interpretation.
              </p>
            )}
          </div>

          {/* ── Card 7 — Confidence Levels ────────────────────────────────────── */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-4">
            <CardTitle icon="shield-check" bg="bg-green-50" color="text-green-600">
              Confidence Levels
            </CardTitle>

            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-start gap-3">
                <span className="text-xs font-semibold text-green-700 flex-shrink-0 min-w-[52px] pt-0.5">
                  High
                </span>
                <div className="w-px self-stretch bg-green-200 flex-shrink-0" />
                <p className="text-sm text-neutral-700 leading-relaxed">
                  5+ validated data points with external source confirmation
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
                <span className="text-xs font-semibold text-amber-700 flex-shrink-0 min-w-[52px] pt-0.5">
                  Medium
                </span>
                <div className="w-px self-stretch bg-amber-200 flex-shrink-0" />
                <p className="text-sm text-neutral-700 leading-relaxed">
                  4 years of demo data — directional, not investment-grade
                </p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">
                <span className="text-xs font-semibold text-red-700 flex-shrink-0 min-w-[52px] pt-0.5">
                  Low
                </span>
                <div className="w-px self-stretch bg-red-200 flex-shrink-0" />
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Insufficient historical data for reliable trend extraction
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <p className="text-[10px] text-neutral-300 leading-relaxed font-mono mb-2">
                Projections assume current CAGR rates continue. Demo data has not been externally
                validated. Not financial or career advice.
              </p>
              <DataStatusBadge isDemo />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
