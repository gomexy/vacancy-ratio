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
  entries: GraduationEntry[];
}

export default function TrendLineChart({ entries }: Props) {
  const data = entries.map((e) => ({
    year: e.year,
    "Vacancy Ratio": parseFloat(computeSnapshot(e).vacancyRatio.toFixed(3)),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          domain={[0, "auto"]}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v.toFixed(2)}
        />
        <Tooltip
          formatter={(v) => (typeof v === "number" ? v.toFixed(3) : v)}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <ReferenceLine y={1} stroke="#d4d4d4" strokeDasharray="4 4" label={{ value: "1:1", position: "right", fontSize: 11, fill: "#a3a3a3" }} />
        <Line
          type="monotone"
          dataKey="Vacancy Ratio"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 4, fill: "#2563eb" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
