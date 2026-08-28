"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import MetricRow from "@/components/results/MetricRow";
import RatioBarChart from "@/components/charts/RatioBarChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import { computeSnapshot } from "@/lib/compute";
import { getAvailableYears, getEntry, getTrendEntries } from "@/lib/service";
import { fmt } from "@/lib/utils";
import type { Country, Field } from "@/lib/types";

interface Props {
  countries: Country[];
  fields: Field[];
}

export default function ExploreClient({ countries, fields }: Props) {
  const [country, setCountry] = useState("IN");
  const [field, setField]     = useState("computer-science");
  const [year, setYear]       = useState(2023);

  const years = useMemo(() => getAvailableYears(country, field), [country, field]);
  const safeYear = years.includes(year) ? year : (years[0] ?? 2023);

  const entry    = useMemo(() => getEntry(country, field, safeYear), [country, field, safeYear]);
  const snapshot = useMemo(() => (entry ? computeSnapshot(entry) : null), [entry]);
  const trendEntries = useMemo(() => getTrendEntries(country, field), [country, field]);

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const fieldOptions   = fields.map((f) => ({ value: f.slug, label: f.label }));
  const yearOptions    = years.map((y) => ({ value: String(y), label: String(y) }));

  // Trend context for chart subtitles
  const trendSubtitle = useMemo(() => {
    if (trendEntries.length < 2) return undefined;
    const sorted = [...trendEntries].sort((a, b) => a.year - b.year);
    const first  = sorted[0];
    const last   = sorted[sorted.length - 1];
    const diff   = last.relevantVacancies - first.relevantVacancies;
    const dir    = diff > 0 ? "grew" : "fell";
    return `Vacancies ${dir} from ${fmt(first.relevantVacancies)} (${first.year}) to ${fmt(last.relevantVacancies)} (${last.year})`;
  }, [trendEntries]);

  return (
    <div className="flex flex-col gap-0">
      {/* Inline filter bar */}
      <div className="py-6 border-b border-neutral-200">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          <Select
            label="Country"
            value={country}
            options={countryOptions}
            onChange={(v) => { setCountry(v); }}
          />
          <Select
            label="Field"
            value={field}
            options={fieldOptions}
            onChange={(v) => { setField(v); }}
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

      {/* Results */}
      {snapshot ? (
        <>
          <MetricRow snapshot={snapshot} />

          {/* Charts */}
          <div className="grid grid-cols-1 gap-12 pt-4 border-t border-neutral-200 lg:grid-cols-2">
            <div className="pt-8">
              <RatioBarChart
                entries={trendEntries}
                subtitle={trendSubtitle}
              />
            </div>
            <div className="pt-8 border-t border-neutral-100 lg:border-t-0 lg:border-l lg:border-neutral-100 lg:pl-12">
              <TrendLineChart entries={trendEntries} />
              <p className="mt-3 text-xs text-neutral-400">
                Dashed line at 1.0 = one vacancy per graduate (balanced market)
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm text-neutral-400">
            No data available for this combination. Try a different country, field, or year.
          </p>
        </div>
      )}
    </div>
  );
}
