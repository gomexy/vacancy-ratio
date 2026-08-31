"use client";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SkillDemand } from "@/lib/types";

interface Props {
  skills: SkillDemand[];
  showGrowth?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d: SkillDemand = payload[0]?.payload;
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-xs shadow-md min-w-40">
      <p className="font-semibold text-neutral-800 mb-1.5">{label}</p>
      <div className="flex justify-between gap-6">
        <span className="text-neutral-500">In job postings</span>
        <span className="tabular-nums font-medium">{d.pct}%</span>
      </div>
      {d.growthPct !== undefined && (
        <div className="flex justify-between gap-6 mt-1">
          <span className="text-neutral-500">YoY change</span>
          <span
            className={
              d.growthPct > 0
                ? "tabular-nums font-medium text-emerald-600"
                : "tabular-nums font-medium text-red-500"
            }
          >
            {d.growthPct > 0 ? "+" : ""}
            {d.growthPct} ppt
          </span>
        </div>
      )}
    </div>
  );
}

export default function SkillsBarChart({ skills, showGrowth }: Props) {
  const data = skills.slice(0, 10).map((s) => ({
    skill: s.skill,
    pct: s.pct,
    growthPct: s.growthPct,
  }));

  const key = showGrowth ? "growthPct" : "pct";

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        barSize={12}
        margin={{ left: 8, right: 40, top: 4, bottom: 4 }}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            showGrowth ? `${v > 0 ? "+" : ""}${v}` : `${v}%`
          }
        />
        <YAxis
          type="category"
          dataKey="skill"
          tick={{ fontSize: 11, fill: "#555555" }}
          axisLine={false}
          tickLine={false}
          width={148}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
        <Bar dataKey={key} radius={[0, 3, 3, 0]}>
          {data.map((d, i) => {
            let fill = "#F5C518";
            if (showGrowth) {
              fill = (d.growthPct ?? 0) >= 0 ? "#059669" : "#dc2626";
            } else {
              // gradient effect: top skills darker
              const alpha = 0.4 + (1 - i / data.length) * 0.6;
              fill = `rgba(245, 197, 24, ${alpha.toFixed(2)})`;
            }
            return <Cell key={i} fill={fill} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
