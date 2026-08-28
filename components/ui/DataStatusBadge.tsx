// Shows whether data comes from a live provider or is illustrative demo data.
// Always show this so users never mistake mock data for real data.

interface Props {
  isDemo: boolean;
  source?: string;
  className?: string;
}

export default function DataStatusBadge({ isDemo, source, className }: Props) {
  if (isDemo) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-100 ${className ?? ""}`}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0"
          aria-hidden
        />
        Demo data
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 ${className ?? ""}`}
      title={source ? `Source: ${source}` : undefined}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0"
        aria-hidden
      />
      Live · {source ?? "API"}
    </span>
  );
}
