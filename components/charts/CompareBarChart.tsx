"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { computeSnapshot, SIGNAL_META } from "@/lib/compute";
import type { GraduationEntry, MarketSignal } from "@/lib/types";
import { FIELDS } from "@/lib/data/fields";

interface Props {
  entries: GraduationEntry[];
}

const SIGNAL_COLORS: Record<string, string> = {
  "critical-shortage":   "#059669",
  "strong-demand":       "#2563eb",
  "balanced":            "#d97706",
  "surplus":             "#ea580c",
  "significant-surplus": "#dc2626",
};

function isMarketSignal(s: unknown): s is MarketSignal {
  return typeof s === "string" && s in SIGNAL_META;
}

export default function CompareBarChart({ entries }: Props) {
  const data = entries.map((e) => {
    const snap = computeSnapshot(e);
    const field = FIELDS.find((f) => f.slug === e.field);
    return {
      field: field?.label ?? e.field,
      ratio: parseFloat(snap.vacancyRatio.toFixed(3)),
      signal: snap.signal,
    };
  }).sort((a, b) => b.ratio - a.ratio);

  return (
    <ResponsiveContainer width="100%" height={Math.max(240, data.length * 52)}>
      <BarChart data={data} layout="vertical" barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, "auto"]}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v.toFixed(2)}
        />
        <YAxis
          type="category"
          dataKey="field"
          width={160}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(v, _name, props) => {
            const sig = props?.payload?.signal;
            const label = isMarketSignal(sig) ? SIGNAL_META[sig].label : "";
            return [
              typeof v === "number" ? v.toFixed(3) : String(v),
              `Ratio — ${label}`,
            ];
          }}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 13 }}
        />
        <Bar dataKey="ratio" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={SIGNAL_COLORS[entry.signal]} />
          ))}
          <LabelList
            dataKey="ratio"
            position="right"
            formatter={(v: unknown) => typeof v === "number" ? v.toFixed(2) : String(v)}
            style={{ fontSize: 11, fill: "#737373" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
