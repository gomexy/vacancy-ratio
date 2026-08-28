import type { GraduationEntry, MarketSignal, MarketSnapshot } from "@/lib/types";

export function getSignal(ratio: number): MarketSignal {
  if (ratio > 2)     return "critical-shortage";
  if (ratio >= 1)    return "strong-demand";
  if (ratio >= 0.75) return "balanced";
  if (ratio >= 0.5)  return "surplus";
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
  { label: string; description: string; color: string; hex: string }
> = {
  "critical-shortage": {
    label: "Critical Shortage",
    description:
      "Vacancies far exceed graduates. Employers are competing for talent; new graduates enter a highly favourable market.",
    color: "text-emerald-600",
    hex: "#059669",
  },
  "strong-demand": {
    label: "Strong Demand",
    description:
      "More vacancies than graduates. The market is actively absorbing new entrants with good career prospects.",
    color: "text-blue-600",
    hex: "#2563eb",
  },
  balanced: {
    label: "Balanced",
    description:
      "Vacancies and graduates are broadly aligned. Entry is competitive but conditions are fair.",
    color: "text-neutral-500",
    hex: "#6b7280",
  },
  surplus: {
    label: "Surplus",
    description:
      "More graduates than vacancies. The market is competitive; differentiation and specialisation matter.",
    color: "text-amber-600",
    hex: "#d97706",
  },
  "significant-surplus": {
    label: "Significant Surplus",
    description:
      "Graduates substantially outnumber available roles. Entry conditions are difficult; adjacent fields or specialisations may improve prospects.",
    color: "text-red-600",
    hex: "#dc2626",
  },
};
