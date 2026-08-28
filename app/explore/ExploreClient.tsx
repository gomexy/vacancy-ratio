"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import MetricRow from "@/components/results/MetricRow";
import RatioBarChart from "@/components/charts/RatioBarChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import Card from "@/components/ui/Card";
import { computeSnapshot } from "@/lib/compute";
import {
  getAvailableYears,
  getEntry,
  getTrendEntries,
} from "@/lib/service";
import type { Country, Field } from "@/lib/types";

interface Props {
  countries: Country[];
  fields: Field[];
}

export default function ExploreClient({ countries, fields }: Props) {
  const [country, setCountry] = useState("IN");
  const [field, setField]   = useState("computer-science");
  const [year, setYear]     = useState(2023);

  const years = useMemo(
    () => getAvailableYears(country, field),
    [country, field]
  );

  // Keep year in range when filters change
  const safeYear = years.includes(year) ? year : (years[0] ?? 2023);

  const entry = useMemo(
    () => getEntry(country, field, safeYear),
    [country, field, safeYear]
  );

  const snapshot = useMemo(
    () => (entry ? computeSnapshot(entry) : null),
    [entry]
  );

  const trendEntries = useMemo(
    () => getTrendEntries(country, field),
    [country, field]
  );

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const fieldOptions   = fields.map((f)   => ({ value: f.slug, label: f.label }));
  const yearOptions    = years.map((y)    => ({ value: String(y), label: String(y) }));

  return (
    <div className="flex flex-col gap-10">
      {/* Filters */}
      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Select parameters
        </h2>
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
      </section>

      {/* Results */}
      {snapshot ? (
        <>
          <MetricRow snapshot={snapshot} />

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-neutral-700">
                Graduates vs Vacancies by Year
              </h3>
              <RatioBarChart entries={trendEntries} />
            </Card>
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-neutral-700">
                Vacancy Ratio Trend
              </h3>
              <TrendLineChart entries={trendEntries} />
              <p className="mt-2 text-xs text-neutral-400">
                Dashed line at 1.0 = one vacancy per graduate (balanced)
              </p>
            </Card>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-400">
          No data available for this combination. Try a different country, field, or year.
        </div>
      )}
    </div>
  );
}
