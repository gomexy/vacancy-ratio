"use client";
import {
  CartesianGrid,
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
  entries: GraduationEntry[];
  title?: string;
  subtitle?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const v: number = payload[0]?.value;
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-xs shadow-md">
      <p className="mb-1 font-semibold text-neutral-700">{label}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="text-neutral-500">Vacancy ratio</span>
        <span className="font-medium tabular-nums text-neutral-900">
          {typeof v === "number" ? v.toFixed(3) : v}
        </span>
      </div>
      <p className="mt-1.5 text-neutral-400">
        = {typeof v === "number" ? (v * 100).toFixed(1) : "—"} per 100 graduates
      </p>
    </div>
  );
}

export default function TrendLineChart({ entries, title, subtitle }: Props) {
  const sorted = [...entries].sort((a, b) => a.year - b.year);
  const data = sorted.map((e) => ({
    year: e.year,
    ratio: parseFloat(computeSnapshot(e).vacancyRatio.toFixed(4)),
  }));

  const years = sorted.map((e) => e.year);
  const defaultTitle =
    years.length >= 2
      ? `Vacancy ratio trend, ${Math.min(...years)}–${Math.max(...years)}`
      : "Vacancy ratio trend";

  const first = data[0]?.ratio ?? 0;
  const last = data[data.length - 1]?.ratio ?? 0;
  const direction = last > first ? "up" : last < first ? "down" : "flat";
  const defaultSubtitle =
    data.length >= 2 && direction !== "flat"
      ? `Ratio moved ${direction === "up" ? "up" : "down"} from ${first.toFixed(2)} to ${last.toFixed(2)}`
      : undefined;

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-neutral-800">{title ?? defaultTitle}</p>
      {(subtitle ?? defaultSubtitle) && (
        <p className="text-xs text-neutral-400 mb-2">{subtitle ?? defaultSubtitle}</p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ right: 24 }}>
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
            domain={[0, "auto"]}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v.toFixed(2)}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e5e5e5" }} />
          <ReferenceLine
            y={1}
            stroke="#e5e5e5"
            strokeDasharray="4 4"
            label={{
              value: "1:1 balanced",
              position: "right",
              fontSize: 10,
              fill: "#d4d4d4",
            }}
          />
          <Line
            type="monotone"
            dataKey="ratio"
            stroke="#F5C518"
            strokeWidth={1.5}
            dot={{ r: 3, fill: "#F5C518", strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
