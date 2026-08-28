"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import CompareBarChart from "@/components/charts/CompareBarChart";
import Card from "@/components/ui/Card";
import SignalBadge from "@/components/results/SignalBadge";
import { computeSnapshot, SIGNAL_META } from "@/lib/compute";
import { getEntriesForFieldYear } from "@/lib/service";
import { fmt, fmtRatio } from "@/lib/utils";
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
    () => entries.map((e) => ({ snap: computeSnapshot(e), field: fields.find((f) => f.slug === e.field) })),
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
  const yearOptions    = years.map((y) => ({ value: String(y), label: String(y) }));

  return (
    <div className="flex flex-col gap-8">
      {/* Filters */}
      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Select parameters
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-5">
          <Select label="Country" value={country} options={countryOptions} onChange={setCountry} />
          <Select
            label="Year"
            value={String(year)}
            options={yearOptions}
            onChange={(v) => setYear(Number(v))}
          />
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Fields (select to compare)
          </p>
          <div className="flex flex-wrap gap-2">
            {fields.map((f) => {
              const active = selectedFields.includes(f.slug);
              return (
                <button
                  key={f.slug}
                  onClick={() => toggleField(f.slug)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {entries.length > 0 ? (
        <>
          {/* Chart */}
          <Card>
            <h3 className="mb-4 text-sm font-semibold text-neutral-700">
              Vacancy Ratio by Field
            </h3>
            <CompareBarChart entries={entries} />
            <p className="mt-3 text-xs text-neutral-400">
              Ratio = vacancies ÷ graduates. Above 1.0 = more vacancies than graduates.
            </p>
          </Card>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Field
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Graduates
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Vacancies
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Ratio
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Per 100 Grads
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Signal
                  </th>
                </tr>
              </thead>
              <tbody>
                {snapshots
                  .sort((a, b) => b.snap.vacancyRatio - a.snap.vacancyRatio)
                  .map(({ snap, field }) => (
                    <tr
                      key={snap.entry.field}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                    >
                      <td className="px-5 py-3 font-medium text-neutral-800">
                        {field?.label ?? snap.entry.field}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-neutral-600">
                        {fmt(snap.entry.graduates)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-neutral-600">
                        {fmt(snap.entry.relevantVacancies)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold text-neutral-900">
                        {fmtRatio(snap.vacancyRatio)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-neutral-600">
                        {fmtRatio(snap.vacanciesPer100Graduates)}
                      </td>
                      <td className="px-5 py-3">
                        <SignalBadge signal={snap.signal} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-400">
          No data for this combination. Try a different country or year.
        </div>
      )}
    </div>
  );
}
