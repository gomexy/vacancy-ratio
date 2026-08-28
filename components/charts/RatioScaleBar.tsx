"use client";

// Scale bar showing where the vacancy ratio sits on the 0–2+ spectrum.
// Segments correspond to the five MarketSignal zones.

const SCALE_MAX = 2.0;

// Segment widths as % of the 0→2.0 range, matching signal thresholds
const SEGMENTS = [
  { pct: 25,   color: "#fca5a5", label: "Sig. Surplus" },  // 0.0 – 0.5
  { pct: 12.5, color: "#fde68a", label: "Surplus" },        // 0.5 – 0.75
  { pct: 12.5, color: "#e5e5e5", label: "Balanced" },       // 0.75 – 1.0
  { pct: 50,   color: "#93c5fd", label: "Strong / Critical" }, // 1.0 – 2.0+
];

interface Props {
  ratio: number;
}

export default function RatioScaleBar({ ratio }: Props) {
  const clampedPct = Math.min(ratio / SCALE_MAX, 1) * 100;

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-xs">
      <p className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400">
        Market position
      </p>

      {/* Track + marker */}
      <div className="relative">
        {/* Coloured track */}
        <div className="flex h-1.5 w-full rounded-full overflow-hidden">
          {SEGMENTS.map((seg, i) => (
            <div
              key={i}
              style={{ width: `${seg.pct}%`, background: seg.color }}
            />
          ))}
        </div>

        {/* Position marker */}
        <div
          className="absolute top-0 h-1.5 w-0.5 rounded-full bg-neutral-900"
          style={{
            left: `${clampedPct}%`,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Axis labels */}
      <div className="flex justify-between font-mono text-[9px] text-neutral-300">
        <span>0</span>
        <span>0.5</span>
        <span>1.0</span>
        <span>2.0+</span>
      </div>
    </div>
  );
}
