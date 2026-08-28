"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import CompareBarChart from "@/components/charts/CompareBarChart";
import SignalBadge from "@/components/results/SignalBadge";
import { computeSnapshot, SIGNAL_META } from "@/lib/compute";
import { getEntriesForFieldYear } from "@/lib/service";
import { fmt, fmtRatio, cn } from "@/lib/utils";
import type { Country, Field } from "@/lib/types";

interface Props {
  countries: Country[];
  fields: Field[];
  years: number[];
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
        .map((e) => ({
          snap:  computeSnapshot(e),
          field: fields.find((f) => f.slug === e.field),
        }))
        .sort((a, b) => b.snap.vacancyRatio - a.snap.vacancyRatio),
    [entries, fields]
  );

  function toggleField(slug: string) {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.length > 1
          ? prev.filter((s) => s !== slug)
          : prev
        : [...prev, slug]
    );
  }

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const yearOptions    = years.map((y) => ({ value: String(y), label: String(y) }));

  return (
    <div className="flex flex-col gap-0">
      {/* Filter bar */}
      <div className="py-6 border-b border-neutral-200">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 max-w-sm">
            <Select
              label="Country"
              value={country}
              options={countryOptions}
              onChange={setCountry}
            />
            <Select
              label="Year"
              value={String(year)}
              options={yearOptions}
              onChange={(v) => setYear(Number(v))}
            />
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
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-neutral-900 bg-neutral-900 text-white"
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

      {entries.length > 0 ? (
        <div className="flex flex-col gap-0 pt-10">
          {/* Chart */}
          <div className="pb-10 border-b border-neutral-200">
            <p className="text-sm font-medium text-neutral-800 mb-1">
              Vacancy ratio by field
            </p>
            <p className="text-xs text-neutral-400 mb-6">
              Higher ratio = more vacancies relative to graduates. Colour indicates market signal.
            </p>
            <CompareBarChart entries={entries} />
          </div>

          {/* Table */}
          <div className="pt-10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pr-4">
                    #
                  </th>
                  <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pr-6">
                    Field
                  </th>
                  <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 px-4">
                    Graduates
                  </th>
                  <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 px-4">
                    Vacancies
                  </th>
                  <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 px-4">
                    Ratio
                  </th>
                  <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400 px-4 hidden sm:table-cell">
                    Per 100 Grads
                  </th>
                  <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pl-4">
                    Signal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {snapshots.map(({ snap, field }, i) => (
                  <tr key={snap.entry.field} className="group">
                    <td className="py-4 pr-4 text-neutral-300 tabular-nums text-xs">
                      {i + 1}
                    </td>
                    <td className="py-4 pr-6 font-medium text-neutral-800">
                      {field?.label ?? snap.entry.field}
                    </td>
                    <td className="py-4 px-4 text-right tabular-nums text-neutral-500">
                      {fmt(snap.entry.graduates)}
                    </td>
                    <td className="py-4 px-4 text-right tabular-nums text-neutral-500">
                      {fmt(snap.entry.relevantVacancies)}
                    </td>
                    <td className={cn(
                      "py-4 px-4 text-right tabular-nums font-semibold",
                      SIGNAL_META[snap.signal].color
                    )}>
                      {fmtRatio(snap.vacancyRatio)}
                    </td>
                    <td className="py-4 px-4 text-right tabular-nums text-neutral-500 hidden sm:table-cell">
                      {fmtRatio(snap.vacanciesPer100Graduates)}
                    </td>
                    <td className="py-4 pl-4">
                      <SignalBadge signal={snap.signal} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm text-neutral-400">
            No data for this combination. Try a different country or year.
          </p>
        </div>
      )}
    </div>
  );
}
