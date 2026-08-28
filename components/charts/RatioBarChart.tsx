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
}

const fmtAxis = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : `${n}`;

export default function RatioBarChart({ entries }: Props) {
  const data = entries.map((e) => ({
    year: e.year,
    Graduates: e.graduates,
    Vacancies: e.relevantVacancies,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value) => (typeof value === "number" ? value.toLocaleString() : value)}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Graduates" fill="#a3a3a3" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Vacancies" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
