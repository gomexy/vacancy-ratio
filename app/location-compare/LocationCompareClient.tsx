"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import DataStatusBadge from "@/components/ui/DataStatusBadge";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { computeSnapshot, SIGNAL_META } from "@/lib/compute";
import { getCityVacancyBreakdown, getAvailableYears } from "@/lib/service";
import { fmt, fmtRatio, cn } from "@/lib/utils";
import SignalBadge from "@/components/results/SignalBadge";
import type { Country, Field } from "@/lib/types";

const CONTAINER = "mx-auto max-w-5xl px-6 sm:px-12";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-xs shadow-md">
      <p className="font-semibold text-neutral-700 mb-1">{label}</p>
      <div className="flex justify-between gap-6">
        <span className="text-neutral-500">Vacancies</span>
        <span className="tabular-nums font-medium">{fmt(payload[0].value)}</span>
      </div>
    </div>
  );
}

interface Props {
  countries: Country[];
  fields:    Field[];
}

export default function LocationCompareClient({ countries, fields }: Props) {
  const [country, setCountry] = useState("IN");
  const [field,   setField]   = useState("computer-science");
  const [year,    setYear]    = useState(2023);

  const years      = useMemo(() => getAvailableYears(country, field), [country, field]);
  const safeYear   = years.includes(year) ? year : (years[0] ?? 2023);

  const breakdown  = useMemo(
    () => getCityVacancyBreakdown(country, field, safeYear),
    [country, field, safeYear]
  );

  const sortedCities = useMemo(
    () => [...breakdown].sort((a, b) => b.vacancies - a.vacancies),
    [breakdown]
  );

  const snapshots = useMemo(
    () =>
      sortedCities.map(({ city, vacancies, graduates }) => {
        const ratio = vacancies / graduates;
        const pseudo = {
          country,
          field,
          year: safeYear,
          graduates,
          relevantVacancies: vacancies,
          source: "Demo",
        };
        const snap = computeSnapshot(pseudo);
        return { city, vacancies, graduates, snap };
      }),
    [sortedCities, country, field, safeYear]
  );

  const chartData = sortedCities.map(({ city, vacancies }) => ({
    city: city.name,
    vacancies,
  }));

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const fieldOptions   = fields.map((f)   => ({ value: f.slug,  label: f.label }));
  const yearOptions    = years.map((y)    => ({ value: String(y), label: String(y) }));

  return (
    <div>
      {/* Filter bar */}
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

      {breakdown.length === 0 ? (
        <div className={`${CONTAINER} py-24`}>
          <p className="text-sm text-neutral-400">
            No city-level data for this combination. Try India or another supported country.
          </p>
        </div>
      ) : (
        <>
          {/* Chart strip */}
          <div className="py-14" style={{ background: "#f5f5f5" }}>
            <div className={CONTAINER}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                    Vacancy distribution by city
                  </p>
                  <p className="text-xs text-neutral-400">
                    Estimated share of national vacancies — based on illustrative city distributions.
                  </p>
                </div>
                <DataStatusBadge isDemo source="Demo" />
              </div>

              <div
                className="bg-white rounded-xl p-6"
                style={{ boxShadow: "var(--shadow-md)" }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={chartData}
                    barSize={28}
                    barCategoryGap="30%"
                  >
                    <CartesianGrid strokeDasharray="2 4" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="city"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v: number) => fmt(v)}
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      width={42}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                    <Bar dataKey="vacancies" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={`rgba(29, 78, 216, ${(1 - i / chartData.length * 0.6).toFixed(2)})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Rankings table */}
          <div className={`${CONTAINER} py-14`}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-6">
              City rankings — {safeYear}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #ebebeb" }}>
                    <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">#</th>
                    <th className="pb-3 pr-8 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">City</th>
                    <th className="pb-3 px-4 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Vacancies</th>
                    <th className="pb-3 px-4 text-right text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Ratio*</th>
                    <th className="pb-3 pl-4 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshots.map(({ city, vacancies, snap }, i) => (
                    <tr
                      key={city.code}
                      style={{
                        borderBottom:
                          i < snapshots.length - 1 ? "1px solid #f5f5f5" : "none",
                      }}
                    >
                      <td className="py-4 pr-4 text-neutral-300 text-xs tabular-nums">{i + 1}</td>
                      <td className="py-4 pr-8 font-medium text-neutral-800">{city.name}</td>
                      <td className="py-4 px-4 text-right tabular-nums text-neutral-600">
                        {fmt(vacancies)}
                      </td>
                      <td
                        className={cn(
                          "py-4 px-4 text-right tabular-nums font-semibold",
                          SIGNAL_META[snap.signal].color
                        )}
                      >
                        {fmtRatio(snap.vacancyRatio)}
                      </td>
                      <td className="py-4 pl-4">
                        <SignalBadge signal={snap.signal} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-[10px] text-neutral-300 leading-relaxed max-w-lg font-mono">
              * Ratio = city vacancies ÷ national graduates. Graduate supply is measured at
              the national level — a city ratio is not directly comparable to a national ratio.
              Vacancy distributions are illustrative demo estimates.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
