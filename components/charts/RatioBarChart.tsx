"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GraduationEntry } from "@/lib/types";

interface Props {
  entries: GraduationEntry[];
  title?: string;
  subtitle?: string;
}

const fmtAxis = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}K`
    : `${n}`;

const fmtFull = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}K`
    : n.toLocaleString();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-xs shadow-md">
      <p className="mb-2 font-semibold text-neutral-700">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <div key={p.name} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-neutral-500">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: p.color }}
            />
            {p.name}
          </span>
          <span className="font-medium tabular-nums text-neutral-900">
            {typeof p.value === "number" ? fmtFull(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RatioBarChart({ entries, title, subtitle }: Props) {
  const data = entries.map((e) => ({
    year: e.year,
    Graduates: e.graduates,
    Vacancies: e.relevantVacancies,
  }));

  const years = entries.map((e) => e.year);
  const defaultTitle =
    years.length >= 2
      ? `Graduates vs. vacancies, ${Math.min(...years)}–${Math.max(...years)}`
      : "Graduates vs. vacancies";

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-neutral-800">{title ?? defaultTitle}</p>
      {subtitle && <p className="text-xs text-neutral-400 mb-2">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={3} barCategoryGap="35%">
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtAxis}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#9ca3af", paddingTop: 8 }}
            iconType="square"
            iconSize={8}
          />
          <Bar dataKey="Graduates" fill="#d4d4d4" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Vacancies" fill="#F5C518" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
