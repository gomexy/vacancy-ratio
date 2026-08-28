"use client";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { computeSnapshot } from "@/lib/compute";
import type { GraduationEntry } from "@/lib/types";

interface Props {
  entries: GraduationEntry[]; // mixed: historical + projected
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const item = payload.find(
    (p: { value: number | null }) => p.value !== null && p.value !== undefined
  );
  if (!item) return null;

  const v: number = item.value;
  const isProj = item.dataKey === "projected";

  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-xs shadow-md">
      <div className="flex items-center justify-between gap-4 mb-1">
        <p className="font-semibold text-neutral-700">{label}</p>
        {isProj && (
          <span className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400">
            Projected
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="text-neutral-500">Vacancy ratio</span>
        <span className="font-medium tabular-nums text-neutral-900">
          {typeof v === "number" ? v.toFixed(3) : v}
        </span>
      </div>
      <p className="mt-1 text-neutral-400">
        = {typeof v === "number" ? (v * 100).toFixed(1) : "—"} per 100 graduates
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomLegend({ payload }: any) {
  if (!payload?.length) return null;
  return (
    <div className="flex gap-5 text-xs text-neutral-500 mt-2 justify-center">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-5 bg-[#1d4ed8] rounded" />
        Historical
      </span>
      <span className="flex items-center gap-1.5">
        <svg width="20" height="2" className="overflow-visible">
          <line
            x1="0" y1="1" x2="20" y2="1"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        </svg>
        <span>Projected (demo)</span>
      </span>
    </div>
  );
}

export default function OutlookChart({ entries }: Props) {
  const sorted = [...entries].sort((a, b) => a.year - b.year);

  // Build two-series data: historical (solid) and projected (dashed).
  // At the boundary year (last historical = first projected), both series
  // share the same value to create a seamless line join.
  const historical = sorted.filter((e) => !e.isProjected);
  const projected  = sorted.filter((e) => e.isProjected);

  const lastHistorical = historical[historical.length - 1];
  const lastHistRatio  = lastHistorical
    ? parseFloat(computeSnapshot(lastHistorical).vacancyRatio.toFixed(4))
    : null;

  // Build unified year list
  const allYears = [...new Set(sorted.map((e) => e.year))];

  type Point = { year: number; historical: number | null; projected: number | null };
  const data: Point[] = allYears.map((year) => {
    const histEntry = historical.find((e) => e.year === year);
    const projEntry = projected.find((e) => e.year === year);

    const histRatio = histEntry
      ? parseFloat(computeSnapshot(histEntry).vacancyRatio.toFixed(4))
      : null;

    let projRatio: number | null = null;
    if (projEntry) {
      projRatio = parseFloat(computeSnapshot(projEntry).vacancyRatio.toFixed(4));
    }
    // Bridge: last historical year also starts the projected line
    if (!projEntry && histEntry && histEntry === lastHistorical && projected.length > 0) {
      projRatio = lastHistRatio;
    }

    return { year, historical: histRatio, projected: projRatio };
  });

  const years = allYears;

  const defaultTitle =
    years.length >= 2
      ? `Vacancy ratio, ${Math.min(...years)}–${Math.max(...years)}`
      : "Vacancy ratio outlook";

  const firstHistRatio = data[0]?.historical ?? 0;
  const trendDir =
    lastHistRatio && firstHistRatio
      ? lastHistRatio > firstHistRatio
        ? "up"
        : lastHistRatio < firstHistRatio
        ? "down"
        : "flat"
      : "flat";

  const subtitle =
    trendDir !== "flat" && firstHistRatio && lastHistRatio
      ? `Historical ratio ${trendDir === "up" ? "improved" : "declined"} from ${firstHistRatio.toFixed(2)} to ${lastHistRatio.toFixed(2)} — projection extends the trend to ${Math.max(...years)}`
      : undefined;

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-neutral-800">{defaultTitle}</p>
      {subtitle && <p className="text-xs text-neutral-400 mb-1">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ right: 24 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, "auto"]}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v.toFixed(2)}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e5e5e5" }} />
          <Legend content={<CustomLegend />} />
          <ReferenceLine
            y={1}
            stroke="#e5e5e5"
            strokeDasharray="4 4"
            label={{ value: "1:1", position: "right", fontSize: 9, fill: "#d4d4d4" }}
          />
          {/* Historical — solid */}
          <Line
            type="monotone"
            dataKey="historical"
            name="Historical"
            stroke="#1d4ed8"
            strokeWidth={2}
            dot={{ r: 3, fill: "#1d4ed8", strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            connectNulls={false}
          />
          {/* Projected — dashed, lighter */}
          <Line
            type="monotone"
            dataKey="projected"
            name="Projected"
            stroke="#93c5fd"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 3, fill: "#93c5fd", strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
