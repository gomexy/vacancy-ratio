"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import CompareBarChart from "@/components/charts/CompareBarChart";
import { computeSnapshot, SIGNAL_META } from "@/lib/compute";
import { getEntriesForFieldYear } from "@/lib/service";
import { fmt, fmtRatio, cn } from "@/lib/utils";
import type { Country, Field } from "@/lib/types";

const CONTAINER = "mx-auto max-w-5xl px-6 sm:px-12";

interface Props {
  countries: Country[];
  fields:    Field[];
  years:     number[];
}

export default function CompareClient({ countries, fields, years }: Props) {
  const [country, setCountry]         = useState("IN");
  const [year, setYear]               = useState(2023);
  const [selectedFields, setSelected] = useState<string[]>(
    fields.slice(0, 5).map((f) => f.slug)
  );

  const entries = useMemo(
    () => getEntriesForFieldYear(selectedFields, country, year),
    [selectedFields, country, year]
  );

  const snapshots = useMemo(
    () =>
      entries
        .map((e) => ({ snap: computeSnapshot(e), field: fields.find((f) => f.slug === e.field) }))
        .sort((a, b) => b.snap.vacancyRatio - a.snap.vacancyRatio),
    [entries, fields]
  );

  function toggleField(slug: string) {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.length > 1 ? prev.filter((s) => s !== slug) : prev
        : [...prev, slug]
    );
  }

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const yearOptions    = years.map((y)    => ({ value: String(y), label: String(y) }));

  return (
    <div style={{ background: "#F0F0F0" }}>
      {/* ── Filter bar ── */}
      <div className="border-b border-neutral-200 bg-white">
        <div className={CONTAINER}>
          <div className="py-5 flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-sm">
              <Select label="Country" value={country}     options={countryOptions} onChange={setCountry} />
              <Select label="Year"    value={String(year)} options={yearOptions}    onChange={(v) => setYear(Number(v))} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
                Fields — select to compare
              </p>
              <div className="flex flex-wrap gap-2">
                {fields.map((f) => {
                  const active = selectedFields.includes(f.slug);
                  return (
                    <button
                      key={f.slug}
                      onClick={() => toggleField(f.slug)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                        active
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                      )}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className={`${CONTAINER} py-8 flex flex-col gap-6`}>
          {/* Chart card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
              Field comparison
            </p>
            <p className="text-sm font-semibold text-neutral-800 mb-1">
              Vacancy ratio by field
            </p>
            <p className="text-xs text-neutral-400 mb-6">
              Higher ratio = more vacancies relative to graduates.
            </p>
            <CompareBarChart entries={entries} />
            <p className="mt-4 text-xs text-neutral-400">
              Ratio = vacancies ÷ graduates · Above 1.0 = more vacancies than graduates.
            </p>
          </div>

          {/* Table card */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="px-8 pt-7 pb-5" style={{ borderBottom: "1px solid #F3F4F6" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                Detailed breakdown
              </p>
              <p className="text-sm font-semibold text-neutral-800">
                All selected fields ranked by vacancy ratio
              </p>
            </div>
            <div className="px-8 py-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <th className="py-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">#</th>
                    <th className="py-3 pr-6 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Field</th>
                    <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Graduates</th>
                    <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Vacancies</th>
                    <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Ratio</th>
                    <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 hidden sm:table-cell">Per 100</th>
                    <th className="py-3 pl-4 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshots.map(({ snap, field }, i) => (
                    <tr
                      key={snap.entry.field}
                      style={{ borderBottom: i < snapshots.length - 1 ? "1px solid #F9FAFB" : "none" }}
                    >
                      <td className="py-4 pr-4 text-neutral-300 tabular-nums text-xs">{i + 1}</td>
                      <td className="py-4 pr-6 font-medium text-neutral-800">{field?.label ?? snap.entry.field}</td>
                      <td className="py-4 px-4 text-right tabular-nums text-neutral-500">{fmt(snap.entry.graduates)}</td>
                      <td className="py-4 px-4 text-right tabular-nums text-neutral-500">{fmt(snap.entry.relevantVacancies)}</td>
                      <td className="py-4 px-4 text-right tabular-nums font-semibold" style={{ color: "#F5C518" }}>
                        {fmtRatio(snap.vacancyRatio)}
                      </td>
                      <td className="py-4 px-4 text-right tabular-nums text-neutral-500 hidden sm:table-cell">
                        {fmtRatio(snap.vacanciesPer100Graduates)}
                      </td>
                      <td className="py-4 pl-4">
                        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#92600A" }}>
                          {SIGNAL_META[snap.signal].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-8 pb-6">
              <p className="text-[10px] text-neutral-300 font-mono">
                Demo data · Ratio = vacancies ÷ graduates · Above 1.0 = more vacancies than graduates
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${CONTAINER} py-24 text-center`}>
          <p className="text-sm text-neutral-400">
            No data for this combination. Try a different country or year.
          </p>
        </div>
      )}

    </div>
  );
}
