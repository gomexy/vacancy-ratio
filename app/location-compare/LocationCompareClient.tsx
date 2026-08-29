"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import DataStatusBadge from "@/components/ui/DataStatusBadge";
import {
  getCityVacancyBreakdown,
  getAvailableYears,
  getCitySalaryRange,
} from "@/lib/service";
import { fmt, cn } from "@/lib/utils";
import { getSkillsForField } from "@/lib/data/mock-skills";
import type { Country, Field } from "@/lib/types";

const CONTAINER = "mx-auto max-w-3xl px-6 sm:px-12";

type StrengthTier = "strong" | "moderate" | "emerging";

function getStrengthTier(vacancies: number, maxVacancies: number): StrengthTier {
  const ratio = vacancies / maxVacancies;
  if (ratio > 0.66) return "strong";
  if (ratio > 0.40) return "moderate";
  return "emerging";
}

const TIER_META: Record<
  StrengthTier,
  { label: string; colorClass: string; hex: string; barHex: string }
> = {
  strong:   { label: "Strong",   colorClass: "text-blue-600",    hex: "#2563eb", barHex: "#2563eb" },
  moderate: { label: "Moderate", colorClass: "text-neutral-500", hex: "#9ca3af", barHex: "#9ca3af" },
  emerging: { label: "Emerging", colorClass: "text-amber-600",   hex: "#f59e0b", barHex: "#fbbf24" },
};

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

interface Props {
  countries: Country[];
  fields: Field[];
}

export default function LocationCompareClient({ countries, fields }: Props) {
  const [country, setCountry] = useState("IN");
  const [field, setField] = useState("computer-science");
  const [year, setYear] = useState(2023);

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

  const cityCards = useMemo(() => {
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

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const fieldOptions = fields.map((f) => ({ value: f.slug, label: f.label }));
  const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }));

  const fieldLabel = fields.find((f) => f.slug === field)?.label ?? field;
  const countryLabel = countries.find((c) => c.code === country)?.name ?? country;

  return (
    <div>
      {/* Filter strip */}
      <div
        className="bg-white"
        style={{ borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb" }}
      >
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
          <p className="text-sm text-neutral-400">
            No city-level data for this combination. Try India or another supported
            country.
          </p>
        </div>
      ) : (
        <div className={`${CONTAINER} py-12`}>
          {/* Heading row */}
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                Location ranking — {safeYear}
              </p>
              <h2 className="text-xl font-semibold text-neutral-900">
                {fieldLabel} in {countryLabel}
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Where is the strongest market for this career?
              </p>
            </div>
            <DataStatusBadge isDemo source="Demo" />
          </div>

          {/* Disclaimer */}
          <div className="mt-5 mb-8 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
            <p className="text-xs text-neutral-500 leading-relaxed">
              <span className="font-semibold">What does &ldquo;strongest&rdquo; mean?</span>{" "}
              Rankings reflect relative labour-market demand — estimated vacancy
              concentration by city — not individual hiring probability or career outcome.
              Strongest market ≠ guaranteed employment.
            </p>
          </div>

          {/* Ranked cards */}
          <div className="space-y-4">
            {cityCards.map(({ city, vacancies, tier, salary, per100, why, rank }) => {
              const meta = TIER_META[tier];
              const barPct = Math.max(6, (vacancies / maxVacancies) * 100);

              return (
                <div
                  key={city.code}
                  className="overflow-hidden rounded-xl border border-neutral-100 bg-white"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                >
                  <div className="flex">
                    {/* Left accent */}
                    <div
                      className="w-1 flex-shrink-0"
                      style={{ background: meta.hex }}
                    />

                    <div className="flex-1 px-5 py-4">
                      {/* Rank + city + strength */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-baseline gap-3">
                          <span className="w-5 font-mono text-[11px] font-bold tabular-nums text-neutral-300">
                            {String(rank).padStart(2, "0")}
                          </span>
                          <span className="text-base font-semibold text-neutral-900">
                            {city.name}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "text-xs font-semibold tracking-wide",
                            meta.colorClass
                          )}
                        >
                          {meta.label}
                        </span>
                      </div>

                      {/* Vacancy bar */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${barPct}%`, background: meta.barHex }}
                          />
                        </div>
                        <span className="whitespace-nowrap text-xs tabular-nums font-medium text-neutral-500">
                          {fmt(vacancies)} vacancies
                        </span>
                      </div>

                      {/* Metrics */}
                      <div className="mb-3 flex flex-wrap gap-x-6 gap-y-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-0.5">
                            Per 100 graduates
                          </p>
                          <p className="text-sm font-medium tabular-nums text-neutral-700">
                            {per100}
                          </p>
                        </div>
                        {salary && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-0.5">
                              Salary range
                            </p>
                            <p className="text-sm font-medium text-neutral-700">
                              {formatSalary(salary.min, salary.max, salary.currency)}
                            </p>
                          </div>
                        )}
                        {topSkills.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-0.5">
                              Top skills
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {topSkills.map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full border border-neutral-100 bg-neutral-50 px-2 py-0.5 text-[10px] text-neutral-500"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Why this location */}
                      <div className="mt-3 border-t border-neutral-50 pt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-1">
                          Why this location?
                        </p>
                        <p className="text-xs leading-relaxed text-neutral-500">
                          {why}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer caveat */}
          <p className="mt-8 max-w-lg font-mono text-[10px] leading-relaxed text-neutral-300">
            Per-100-graduates figures use national graduate counts — city figures are not
            directly comparable to national ratios. Vacancy distributions and salary ranges
            are illustrative demo estimates. Skills shown are field-level, not city-specific.
          </p>
        </div>
      )}
    </div>
  );
}
