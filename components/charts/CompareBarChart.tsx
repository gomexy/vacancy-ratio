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

function isMarketSignal(s: unknown): s is MarketSignal {
  return typeof s === "string" && s in SIGNAL_META;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const sig: unknown = d?.signal;
  const sigMeta = isMarketSignal(sig) ? SIGNAL_META[sig] : null;
  return (
    <div className="rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-xs shadow-md min-w-[160px]">
      <p className="mb-2 font-semibold text-neutral-700">{d?.field}</p>
      <div className="flex justify-between gap-4">
        <span className="text-neutral-500">Ratio</span>
        <span className="font-medium tabular-nums text-neutral-900">
          {typeof d?.ratio === "number" ? d.ratio.toFixed(3) : "—"}
        </span>
      </div>
      {sigMeta && (
        <p className={`mt-1.5 font-semibold uppercase tracking-widest text-[10px] ${sigMeta.color}`}>
          {sigMeta.label}
        </p>
      )}
    </div>
  );
}

export default function CompareBarChart({ entries }: Props) {
  const data = entries
    .map((e) => {
      const snap = computeSnapshot(e);
      const field = FIELDS.find((f) => f.slug === e.field);
      return {
        field: field?.label ?? e.field,
        ratio: parseFloat(snap.vacancyRatio.toFixed(4)),
        signal: snap.signal as string,
      };
    })
    .sort((a, b) => b.ratio - a.ratio);

  return (
    <ResponsiveContainer
      width="100%"
      height={Math.max(220, data.length * 48)}
    >
      <BarChart data={data} layout="vertical" barCategoryGap="35%">
        <CartesianGrid
          strokeDasharray="2 4"
          stroke="#f0f0f0"
          horizontal={false}
        />
        <XAxis
          type="number"
          domain={[0, "auto"]}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v.toFixed(2)}
        />
        <YAxis
          type="category"
          dataKey="field"
          width={156}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
        <Bar dataKey="ratio" radius={[0, 3, 3, 0]}>
          {data.map((entry, i) => {
            const sig = entry.signal;
            const hex = isMarketSignal(sig) ? SIGNAL_META[sig].hex : "#a3a3a3";
            return <Cell key={i} fill={hex} />;
          })}
          <LabelList
            dataKey="ratio"
            position="right"
            formatter={(v: unknown) =>
              typeof v === "number" ? v.toFixed(2) : String(v)
            }
            style={{ fontSize: 11, fill: "#9ca3af" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
