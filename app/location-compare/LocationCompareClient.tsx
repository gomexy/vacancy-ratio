"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import DataStatusBadge from "@/components/ui/DataStatusBadge";
import {
  getCityVacancyBreakdown,
  getAvailableYears,
  getCitySalaryRange,
} from "@/lib/service";
import { fmt } from "@/lib/utils";
import { getSkillsForField } from "@/lib/data/mock-skills";
import type { Country, Field } from "@/lib/types";
import type { CityOption } from "@/lib/data/cities";

const CONTAINER = "mx-auto max-w-3xl px-6 sm:px-12";

// ── Types ──────────────────────────────────────────────────────────────────────

type StrengthTier = "strong" | "moderate" | "emerging";

interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

interface CityCard {
  city: CityOption;
  vacancies: number;
  tier: StrengthTier;
  salary: SalaryRange | null;
  per100: string;
  why: string;
  rank: number;
}

// ── Tier config ────────────────────────────────────────────────────────────────

function getStrengthTier(vacancies: number, maxVacancies: number): StrengthTier {
  const ratio = vacancies / maxVacancies;
  if (ratio > 0.66) return "strong";
  if (ratio > 0.40) return "moderate";
  return "emerging";
}

const TIER_META: Record<StrengthTier, { label: string; hex: string; barHex: string }> = {
  strong:   { label: "Strong",   hex: "#92600A", barHex: "#F5C518" },
  moderate: { label: "Moderate", hex: "#9ca3af", barHex: "#9ca3af" },
  emerging: { label: "Emerging", hex: "#f59e0b", barHex: "#fbbf24" },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatSalary(min: number, max: number, currency: string): string {
  if (currency === "INR") {
    const f = (v: number) => `₹${Math.round(v / 100_000)}L`;
    return `${f(min)} – ${f(max)}`;
  }
  const f = (v: number) => `$${Math.round(v / 1_000)}K`;
  return `${f(min)} – ${f(max)}`;
}

function getWhyText(
  rank: number,
  tier: StrengthTier,
  hasSalary: boolean,
  salaryAboveMedian: boolean
): string {
  if (rank === 1) {
    return "Highest vacancy concentration in this field among compared cities. This hub attracts the largest share of employer demand nationally.";
  }
  if (tier === "strong") {
    return hasSalary && salaryAboveMedian
      ? "High employer demand and strong hiring volume. Salary ranges are above the median for this comparison."
      : "High employer demand and significant concentration of relevant roles.";
  }
  if (tier === "moderate") {
    return "Moderate employer presence in this field. Less saturation than top-ranked cities may improve relative access for new entrants.";
  }
  return "Lower vacancy density compared to top-ranked cities. May suit candidates open to emerging markets or with location-specific ties.";
}

function getDecisionInsights(cityCards: CityCard[], fieldLabel: string): string[] {
  if (cityCards.length === 0) return [];
  const top = cityCards[0];
  const second = cityCards[1];
  const emerging = cityCards.filter((c) => c.tier === "emerging");

  const insights: string[] = [];

  insights.push(
    `${top.city.name} leads for ${fieldLabel} vacancy concentration — more openings means more access, but also more competition. The strongest candidates in this field tend to cluster here.`
  );

  if (second) {
    if (second.tier === "strong") {
      insights.push(
        `${second.city.name} follows closely with strong demand. It may offer a marginally less saturated alternative while still providing significant hiring activity in this field.`
      );
    } else {
      insights.push(
        `${second.city.name} enters moderate demand territory. For candidates open to markets beyond the top hub, this can represent a better ratio of opportunity to applicant volume.`
      );
    }
  }

  if (emerging.length > 0) {
    const names = emerging.slice(0, 3).map((c) => c.city.name).join(", ");
    insights.push(
      `${names} ${emerging.length === 1 ? "registers" : "register"} lower vacancy density. These cities may suit candidates with regional ties or those earlier in their career — fewer postings, but potentially fewer applicants competing for each role.`
    );
  }

  insights.push(
    "A strong market for a field does not guarantee a role. Individual outcomes depend on experience level, skills alignment, network, and the specific employers active in each city. Use these rankings as directional signals, not precise predictions."
  );

  return insights;
}

// ── Small UI components ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
      {children}
    </p>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 200ms ease",
        flexShrink: 0,
      }}
    >
      <polyline points="2,4 7,10 12,4" />
    </svg>
  );
}

function SkillPills({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <span
          key={skill}
          className="rounded-full border border-neutral-100 bg-neutral-50 px-2 py-0.5 text-[10px] text-neutral-500"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

// ── Expanded detail body (shared between #1 and rest) ─────────────────────────

function ExpandedDetails({
  card,
  topSkills,
  showPer100,
}: {
  card: CityCard;
  topSkills: string[];
  showPer100?: boolean;
}) {
  return (
    <div className="pt-4 border-t border-neutral-50">
      <div className="flex flex-wrap gap-x-8 gap-y-4 mb-4">
        {showPer100 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-0.5">
              Per 100 graduates
            </p>
            <p className="text-sm font-medium text-neutral-700">{card.per100}</p>
          </div>
        )}
        {card.salary && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-0.5">
              Salary range
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {formatSalary(card.salary.min, card.salary.max, card.salary.currency)}
            </p>
          </div>
        )}
        {topSkills.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-1">
              Top skills
            </p>
            <SkillPills skills={topSkills} />
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-1">
          Why this location?
        </p>
        <p className="text-xs leading-relaxed text-neutral-500">{card.why}</p>
      </div>
    </div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  countries: Country[];
  fields: Field[];
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function LocationCompareClient({ countries, fields }: Props) {
  const [country, setCountry] = useState("IN");
  const [field, setField] = useState("computer-science");
  const [year, setYear] = useState(2023);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const years = useMemo(() => getAvailableYears(country, field), [country, field]);
  const safeYear = years.includes(year) ? year : (years[0] ?? 2023);

  const breakdown = useMemo(
    () => getCityVacancyBreakdown(country, field, safeYear),
    [country, field, safeYear]
  );

  const sortedCities = useMemo(
    () => [...breakdown].sort((a, b) => b.vacancies - a.vacancies),
    [breakdown]
  );

  const topSkills = useMemo(
    () => getSkillsForField(field).slice(0, 4).map((s) => s.skill),
    [field]
  );

  const maxVacancies = sortedCities[0]?.vacancies ?? 1;

  const cityCards = useMemo<CityCard[]>(() => {
    const salaries = sortedCities.map(({ city }) =>
      getCitySalaryRange(country, field, city.code)
    );
    const mids = salaries.map((s) => (s ? (s.min + s.max) / 2 : null));
    const validMids = mids.filter((v): v is number => v !== null).sort((a, b) => a - b);
    const medianSalary =
      validMids.length > 0 ? validMids[Math.floor(validMids.length / 2)] : null;

    return sortedCities.map(({ city, vacancies, graduates }, i) => {
      const tier = getStrengthTier(vacancies, maxVacancies);
      const salary = salaries[i];
      const mid = mids[i];
      const aboveMedian = medianSalary !== null && mid !== null && mid > medianSalary;
      const per100 =
        graduates > 0 ? ((vacancies / graduates) * 100).toFixed(1) : "—";
      const why = getWhyText(i + 1, tier, salary !== null, aboveMedian);
      return { city, vacancies, tier, salary, per100, why, rank: i + 1 };
    });
  }, [sortedCities, country, field, maxVacancies]);

  const totalVacancies = useMemo(
    () => cityCards.reduce((s, c) => s + c.vacancies, 0),
    [cityCards]
  );

  const bestPer100 = useMemo(() => {
    return cityCards.reduce<CityCard | null>((best, c) => {
      const val = parseFloat(c.per100);
      if (isNaN(val)) return best;
      if (!best || val > parseFloat(best.per100)) return c;
      return best;
    }, null);
  }, [cityCards]);

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const fieldOptions = fields.map((f) => ({ value: f.slug, label: f.label }));
  const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }));

  const fieldLabel = fields.find((f) => f.slug === field)?.label ?? field;
  const countryLabel = countries.find((c) => c.code === country)?.name ?? country;

  function toggleExpanded(code: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  const topCard = cityCards[0] ?? null;
  const restCards = cityCards.slice(1);
  const decisionInsights = useMemo(
    () => getDecisionInsights(cityCards, fieldLabel),
    [cityCards, fieldLabel]
  );

  return (
    <div style={{ background: "#F0F0F0" }}>

      {/* ── Filter strip ────────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-200 bg-white">
        <div className={CONTAINER}>
          <div className="py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Select
                label="Country"
                value={country}
                options={countryOptions}
                onChange={setCountry}
              />
              <Select
                label="Field"
                value={field}
                options={fieldOptions}
                onChange={setField}
              />
              <Select
                label="Year"
                value={String(safeYear)}
                options={yearOptions}
                onChange={(v) => setYear(Number(v))}
                disabled={years.length === 0}
              />
            </div>
          </div>
        </div>
      </div>

      {breakdown.length === 0 ? (
        <div className={`${CONTAINER} py-24`}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-3">
            No data
          </p>
          <p className="text-sm text-neutral-400">
            No city-level data for this combination. Try India or another supported country.
          </p>
        </div>
      ) : (
        <div className={`${CONTAINER} py-10 sm:py-14`}>

          {/* ── Editorial heading ─────────────────────────────────────────────── */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-start justify-between gap-4 mb-3">
              <SectionLabel>Location Intelligence</SectionLabel>
              <DataStatusBadge isDemo source="Demo" />
            </div>
            <h1
              className="font-semibold text-neutral-900 mb-2"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {fieldLabel} in {countryLabel}
            </h1>
            <p className="text-base text-neutral-500">
              Where is the strongest market for this career?&ensp;·&ensp;{safeYear}
            </p>
          </div>

          {/* ── Market at a glance ───────────────────────────────────────────── */}
          {topCard && (
            <div className="mb-6 rounded-xl border border-neutral-200 bg-white overflow-hidden">
              <div className="px-5 pt-4 pb-1 sm:px-6">
                <SectionLabel>Market at a glance</SectionLabel>
              </div>
              <div className="grid grid-cols-1 divide-y divide-neutral-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x sm:divide-neutral-100">
                <div className="px-5 pt-3 pb-5 sm:px-6">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-1">
                    Strongest market
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">{topCard.city.name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{fmt(topCard.vacancies)} vacancies</p>
                </div>
                <div className="px-5 pt-3 pb-5 sm:px-6">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-1">
                    Best per-100-graduates ratio
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">
                    {bestPer100 ? bestPer100.city.name : topCard.city.name}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {bestPer100 ? bestPer100.per100 : topCard.per100} per 100 graduates
                  </p>
                </div>
                <div className="px-5 pt-3 pb-5 sm:px-6">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-1">
                    Cities tracked
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">{cityCards.length} cities</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{fmt(totalVacancies)} total vacancies</p>
                </div>
              </div>
            </div>
          )}

          {/* ── How to read this ─────────────────────────────────────────────── */}
          <div className="mb-8 flex gap-2.5 items-start">
            <svg
              className="mt-0.5 flex-shrink-0 text-neutral-300"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden
            >
              <circle cx="6.5" cy="6.5" r="5.5" />
              <line x1="6.5" y1="5.5" x2="6.5" y2="9.5" />
              <circle cx="6.5" cy="3.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            <p className="text-xs text-neutral-400 leading-relaxed">
              <span className="font-semibold text-neutral-500">
                Strongest market ≠ guaranteed employment.
              </span>{" "}
              Rankings reflect relative labour-market demand — estimated vacancy
              concentration by city. A higher rank means more postings relative to
              other cities in this comparison, not a higher individual probability of
              being hired.
            </p>
          </div>

          {/* ── Featured #1 city ─────────────────────────────────────────────── */}
          {topCard && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                Best market right now
              </p>
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                {/* Yellow accent top bar */}
                <div style={{ height: 2, background: "#F5C518" }} />

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  {/* Rank + city + tier */}
                  <div className="flex items-baseline justify-between gap-3 mb-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] font-bold tabular-nums text-neutral-300">
                        01
                      </span>
                      <span
                        className="font-semibold tracking-tight text-neutral-900"
                        style={{ fontSize: "clamp(1.1rem, 3vw, 1.35rem)" }}
                      >
                        {topCard.city.name}
                      </span>
                    </div>
                    <span
                      className="text-xs font-semibold tracking-wide flex-shrink-0"
                      style={{ color: TIER_META[topCard.tier].hex }}
                    >
                      {TIER_META[topCard.tier].label}
                    </span>
                  </div>

                  {/* Vacancy bar + count */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: "100%", background: TIER_META[topCard.tier].barHex }}
                      />
                    </div>
                    <span className="whitespace-nowrap text-xs tabular-nums font-medium text-neutral-500">
                      {fmt(topCard.vacancies)} vacancies
                    </span>
                  </div>

                  {/* Hero metric */}
                  <div className="flex items-baseline gap-2 mb-5">
                    <span
                      className="font-semibold tabular-nums tracking-tight leading-none"
                      style={{ fontSize: "clamp(2rem, 7vw, 3rem)", color: "#F5C518" }}
                    >
                      {topCard.per100}
                    </span>
                    <span className="text-sm text-neutral-400">vacancies per 100 graduates</span>
                  </div>

                  {/* Always-visible details for #1 */}
                  <ExpandedDetails card={topCard} topSkills={topSkills} />
                </div>
              </div>
            </div>
          )}

          {/* ── Rankings list (#2 onward) ─────────────────────────────────────── */}
          {restCards.length > 0 && (
            <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 bg-white">
              {restCards.map((card, idx) => {
                const meta = TIER_META[card.tier];
                const barPct = Math.max(6, (card.vacancies / maxVacancies) * 100);
                const isExp = expanded.has(card.city.code);
                const isLast = idx === restCards.length - 1;

                return (
                  <div
                    key={card.city.code}
                    style={!isLast ? { borderBottom: "1px solid #f5f5f5" } : undefined}
                  >
                    {/* Summary row — always visible, fully clickable */}
                    <button
                      type="button"
                      onClick={() => toggleExpanded(card.city.code)}
                      className="w-full text-left px-5 py-4 sm:px-6 hover:bg-neutral-50/60 transition-colors"
                      aria-expanded={isExp}
                      aria-label={`${card.city.name} — ${isExp ? "collapse" : "expand"} details`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Rank + city info */}
                        <div className="flex gap-3 min-w-0 flex-1">
                          <span className="font-mono text-[11px] font-bold tabular-nums text-neutral-300 w-5 flex-shrink-0 pt-0.5">
                            {String(card.rank).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="text-sm font-semibold text-neutral-900">
                                {card.city.name}
                              </span>
                              <span
                                className="text-[10px] font-semibold tracking-wide"
                                style={{ color: meta.hex }}
                              >
                                {meta.label}
                              </span>
                            </div>
                            {/* Bar + vacancy count */}
                            <div className="flex items-center gap-2.5">
                              <div className="h-1 flex-1 max-w-[120px] sm:max-w-[200px] overflow-hidden rounded-full bg-neutral-100">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${barPct}%`, background: meta.barHex }}
                                />
                              </div>
                              <span className="text-[11px] tabular-nums text-neutral-400">
                                {fmt(card.vacancies)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Per-100 + chevron */}
                        <div className="flex items-center gap-3 flex-shrink-0 pt-0.5">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-300">
                              Per 100
                            </p>
                            <p className="text-sm font-semibold tabular-nums text-neutral-700">
                              {card.per100}
                            </p>
                          </div>
                          <span className="text-neutral-300">
                            <Chevron open={isExp} />
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isExp && (
                      <div className="px-5 pb-5 sm:px-6">
                        <ExpandedDetails
                          card={card}
                          topSkills={topSkills}
                          showPer100
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Decision insights ─────────────────────────────────────────────── */}
          {decisionInsights.length > 0 && (
            <div className="mb-10 rounded-xl border border-neutral-200 bg-white px-5 py-5 sm:px-6 sm:py-6">
              <SectionLabel>What this means for you</SectionLabel>
              <h2
                className="font-semibold text-neutral-900 mb-6"
                style={{
                  fontSize: "clamp(1rem, 3vw, 1.2rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                }}
              >
                Reading the {fieldLabel} market in {countryLabel}
              </h2>
              <ul className="flex flex-col gap-5">
                {decisionInsights.map((text, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-neutral-300 flex-shrink-0 select-none mt-0.5">—</span>
                    <p className="text-sm text-neutral-600 leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Footer note ───────────────────────────────────────────────────── */}
          <p className="font-mono text-[10px] leading-relaxed text-neutral-300 max-w-lg">
            Per-100-graduates figures use national graduate counts — city figures are not
            directly comparable to national ratios. Vacancy distributions and salary ranges
            are illustrative demo estimates. Skills shown are field-level, not city-specific.
          </p>
        </div>
      )}
    </div>
  );
}
