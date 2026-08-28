import type { GraduationEntry, MarketSignal, MarketSnapshot } from "@/lib/types";

export function getSignal(ratio: number): MarketSignal {
  if (ratio > 2)    return "critical-shortage";
  if (ratio >= 1)   return "strong-demand";
  if (ratio >= 0.75) return "balanced";
  if (ratio >= 0.5) return "surplus";
  return "significant-surplus";
}

export function computeSnapshot(entry: GraduationEntry): MarketSnapshot {
  const vacancyRatio = entry.relevantVacancies / entry.graduates;
  const vacanciesPer100Graduates = vacancyRatio * 100;
  return {
    entry,
    vacancyRatio,
    vacanciesPer100Graduates,
    signal: getSignal(vacancyRatio),
  };
}

export const SIGNAL_META: Record<
  MarketSignal,
  { label: string; description: string; color: string; bg: string }
> = {
  "critical-shortage": {
    label: "Critical Shortage",
    description:
      "Vacancies far exceed graduates. Strong employer competition for talent; excellent career prospects.",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  "strong-demand": {
    label: "Strong Demand",
    description:
      "More vacancies than graduates. Good prospects; the market is actively absorbing new entrants.",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  balanced: {
    label: "Balanced",
    description:
      "Vacancies and graduates are roughly aligned. Competitive but fair entry conditions.",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  surplus: {
    label: "Surplus",
    description:
      "More graduates than vacancies. Competitive market; differentiation matters.",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
  },
  "significant-surplus": {
    label: "Significant Surplus",
    description:
      "Graduates substantially outnumber vacancies. Difficult entry conditions; consider adjacent fields.",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
  },
};
