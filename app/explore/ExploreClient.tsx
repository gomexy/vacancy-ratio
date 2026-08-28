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

const CONTAINER = "mx-auto max-w-5xl px-6 sm:px-12";

interface Props {
  countries: Country[];
  fields:    Field[];
}

export default function ExploreClient({ countries, fields }: Props) {
  const [country, setCountry] = useState("IN");
  const [field, setField]     = useState("computer-science");
  const [year, setYear]       = useState(2023);

  const years      = useMemo(() => getAvailableYears(country, field), [country, field]);
  const safeYear   = years.includes(year) ? year : (years[0] ?? 2023);
  const entry      = useMemo(() => getEntry(country, field, safeYear), [country, field, safeYear]);
  const snapshot   = useMemo(() => (entry ? computeSnapshot(entry) : null), [entry]);
  const trendEntries = useMemo(() => getTrendEntries(country, field), [country, field]);

  const trendSubtitle = useMemo(() => {
    if (trendEntries.length < 2) return undefined;
    const sorted = [...trendEntries].sort((a, b) => a.year - b.year);
    const first = sorted[0];
    const last  = sorted[sorted.length - 1];
    const diff  = last.relevantVacancies - first.relevantVacancies;
    const dir   = diff > 0 ? "grew" : "fell";
    return `Vacancies ${dir} from ${fmt(first.relevantVacancies)} (${first.year}) to ${fmt(last.relevantVacancies)} (${last.year})`;
  }, [trendEntries]);

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const fieldOptions   = fields.map((f)   => ({ value: f.slug,  label: f.label }));
  const yearOptions    = years.map((y)    => ({ value: String(y), label: String(y) }));

  return (
    <div>
      {/* ── Filter bar ── elevated white card on white page */}
      <div style={{ borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb" }}>
        <div className={CONTAINER}>
          <div
            className="my-6 rounded-xl px-6 py-5"
            style={{ background: "#f7f7f7", boxShadow: "var(--shadow-sm)" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
              Select parameters
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Select label="Country" value={country}         options={countryOptions} onChange={setCountry} />
              <Select label="Field"   value={field}           options={fieldOptions}   onChange={setField} />
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

      {/* ── Results ── */}
      {snapshot ? (
        <>
          {/* Metric block — white, generous padding */}
          <div className={`${CONTAINER} pt-10 pb-2`}>
            <MetricRow snapshot={snapshot} />
          </div>

          {/* Chart strip — light gray background to lift charts */}
          <div className="mt-6 py-10" style={{ background: "#f5f5f5" }}>
            <div className={CONTAINER}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Chart card */}
                <div
                  className="bg-white rounded-xl p-6"
                  style={{ boxShadow: "var(--shadow-md)" }}
                >
                  <RatioBarChart entries={trendEntries} subtitle={trendSubtitle} />
                </div>
                <div
                  className="bg-white rounded-xl p-6"
                  style={{ boxShadow: "var(--shadow-md)" }}
                >
                  <TrendLineChart entries={trendEntries} />
                  <p className="mt-3 text-xs text-neutral-400">
                    Dashed line at 1.0 = one vacancy per graduate (balanced market)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={`${CONTAINER} py-24 text-center`}>
          <p className="text-sm text-neutral-400">
            No data available for this combination. Try a different country, field, or year.
          </p>
        </div>
      )}
    </div>
  );
}
