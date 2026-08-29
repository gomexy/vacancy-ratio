"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
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
          <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
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

export default function OutlookTimeline({ entries }: Props) {
  const sorted = [...entries].sort((a, b) => a.year - b.year);

  const historical = sorted.filter((e) => !e.isProjected);
  const projected = sorted.filter((e) => e.isProjected);

  const lastHistorical = historical[historical.length - 1];
  const firstProjected = projected[0];
  const lastProjectedYear = projected[projected.length - 1]?.year;

  const lastHistRatio = lastHistorical
    ? parseFloat(computeSnapshot(lastHistorical).vacancyRatio.toFixed(4))
    : null;

  // Build unified year list
  const allYears = [...new Set(sorted.map((e) => e.year))];

  type Point = {
    year: number;
    historical: number | null;
    projected: number | null;
  };

  const data: Point[] = allYears.map((yr) => {
    const histEntry = historical.find((e) => e.year === yr);
    const projEntry = projected.find((e) => e.year === yr);

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

    return { year: yr, historical: histRatio, projected: projRatio };
  });

  const lastHistYear = lastHistorical?.year;

  return (
    <div className="flex flex-col gap-2">
      {/* Period labels above chart */}
      {lastHistYear && firstProjected && (
        <div className="flex justify-between text-[9px] font-semibold uppercase tracking-widest text-neutral-400 px-1">
          <span>Observed</span>
          <span>Projected (Demo)</span>
        </div>
      )}

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ right: 24, left: 0 }}>
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="#f0f0f0"
            vertical={false}
          />

          {/* Amber tinted background for projected region */}
          {firstProjected && lastProjectedYear && (
            <ReferenceArea
              x1={firstProjected.year}
              x2={lastProjectedYear}
              fill="#fffbeb"
              fillOpacity={0.6}
            />
          )}

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

          {/* 1:1 reference line */}
          <ReferenceLine
            y={1}
            stroke="#e5e5e5"
            strokeDasharray="4 4"
            label={{ value: "1:1", position: "right", fontSize: 9, fill: "#d4d4d4" }}
          />

          {/* Forecast boundary line */}
          {lastHistYear && (
            <ReferenceLine
              x={lastHistYear}
              stroke="#d4d4d4"
              strokeDasharray="3 3"
              label={{
                value: "Forecast",
                position: "insideTopRight",
                fontSize: 9,
                fill: "#a3a3a3",
              }}
            />
          )}

          {/* Historical — solid blue, filled dots */}
          <Line
            type="monotone"
            dataKey="historical"
            name="Observed"
            stroke="#1d4ed8"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#1d4ed8", strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            connectNulls={false}
          />

          {/* Projected — dashed amber, hollow-style dots */}
          <Line
            type="monotone"
            dataKey="projected"
            name="Projected"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 3, fill: "#ffffff", stroke: "#f59e0b", strokeWidth: 1.5 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend below chart */}
      <div className="flex items-center gap-5 justify-center text-xs text-neutral-500 mt-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 rounded" style={{ background: "#1d4ed8" }} />
          Observed
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="20" height="2" className="overflow-visible">
            <line
              x1="0"
              y1="1"
              x2="20"
              y2="1"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="5 3"
            />
          </svg>
          Projected (illustrative)
        </span>
      </div>
    </div>
  );
}
