import type { GraduationEntry } from "@/lib/types";
import { computeSnapshot } from "@/lib/compute";

export interface ForecastResult {
  projections: Array<{ year: number; ratio: number }>;
  outlookLabel: "Growing" | "Stable" | "Declining";
  confidence: "High" | "Medium" | "Low";
  vacancyCAGR: number;    // % per year (e.g. 8.2 means 8.2% p.a.)
  graduateCAGR: number;
  ratioDirection: number; // projected ratio change over 5 years (positive = improving)
  drivers: string[];      // plain-language drivers
  caveats: string[];
}

// --- helpers -----------------------------------------------------------------

function cagr(start: number, end: number, years: number): number {
  if (start <= 0 || years <= 0) return 0;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

function outlookFromChange(pctChange: number): "Growing" | "Stable" | "Declining" {
  if (pctChange >  8) return "Growing";
  if (pctChange < -8) return "Declining";
  return "Stable";
}

function confidenceFromDataPoints(n: number): "High" | "Medium" | "Low" {
  // Demo data caps at Medium because it hasn't been externally validated
  if (n >= 4) return "Medium";
  return "Low";
}

function buildDrivers(
  vacancyCAGR: number,
  graduateCAGR: number,
  outlookLabel: "Growing" | "Stable" | "Declining"
): string[] {
  const drivers: string[] = [];

  if (vacancyCAGR > 5) {
    drivers.push(
      `Vacancy demand has grown at ${vacancyCAGR.toFixed(1)}% p.a. over the observed period — above the rate needed to absorb new graduates.`
    );
  } else if (vacancyCAGR < 0) {
    drivers.push(
      `Vacancy count declined at ${Math.abs(vacancyCAGR).toFixed(1)}% p.a., suggesting falling employer demand in the observed period.`
    );
  } else {
    drivers.push(
      `Vacancy demand grew at a modest ${vacancyCAGR.toFixed(1)}% p.a. — in line with broader labour market growth.`
    );
  }

  if (graduateCAGR > vacancyCAGR + 3) {
    drivers.push(
      `Graduate supply grew faster than vacancies (${graduateCAGR.toFixed(1)}% vs ${vacancyCAGR.toFixed(1)}% p.a.), putting downward pressure on the vacancy ratio.`
    );
  } else if (vacancyCAGR > graduateCAGR + 3) {
    drivers.push(
      `Vacancies grew faster than graduate supply (${vacancyCAGR.toFixed(1)}% vs ${graduateCAGR.toFixed(1)}% p.a.), improving the vacancy ratio.`
    );
  }

  if (outlookLabel === "Growing") {
    drivers.push(
      "If current trends continue, the vacancy ratio is projected to improve over the next five years."
    );
  } else if (outlookLabel === "Declining") {
    drivers.push(
      "If current trends continue, competition among graduates for available roles is expected to increase."
    );
  } else {
    drivers.push(
      "The vacancy ratio is projected to remain broadly stable over the next five years."
    );
  }

  return drivers;
}

// --- main export -------------------------------------------------------------

export function computeForecast(
  historicalEntries: GraduationEntry[]
): ForecastResult | null {
  const sorted = [...historicalEntries]
    .filter((e) => !e.isProjected)
    .sort((a, b) => a.year - b.year);

  if (sorted.length < 2) return null;

  const first = sorted[0];
  const last  = sorted[sorted.length - 1];
  const years = last.year - first.year;

  const vacancyCAGR   = cagr(first.relevantVacancies, last.relevantVacancies, years);
  const graduateCAGR  = cagr(first.graduates,         last.graduates,         years);

  const startRatio = computeSnapshot(last).vacancyRatio;

  // Project 5 years using separate CAGR for each component
  const projections: Array<{ year: number; ratio: number }> = [];
  for (let i = 1; i <= 5; i++) {
    const projVacancies = last.relevantVacancies * Math.pow(1 + vacancyCAGR / 100, i);
    const projGraduates = last.graduates         * Math.pow(1 + graduateCAGR / 100, i);
    const ratio = projVacancies / projGraduates;
    projections.push({ year: last.year + i, ratio: parseFloat(ratio.toFixed(4)) });
  }

  const endRatio       = projections[projections.length - 1].ratio;
  const ratioDirection = endRatio - startRatio;
  const pctChange      = (ratioDirection / startRatio) * 100;

  const outlookLabel = outlookFromChange(pctChange);
  const confidence   = confidenceFromDataPoints(sorted.length);
  const drivers      = buildDrivers(vacancyCAGR, graduateCAGR, outlookLabel);

  const caveats = [
    "Projections assume current growth rates continue — they do not model policy changes, economic shocks, or structural shifts.",
    "Graduate supply is measured nationally; regional vacancy concentration may differ significantly from the national picture.",
    "Demo data has not been externally validated. Treat projections as directional only.",
  ];

  return {
    projections,
    outlookLabel,
    confidence,
    vacancyCAGR,
    graduateCAGR,
    ratioDirection,
    drivers,
    caveats,
  };
}

// Returns the outlook label directly, or "Stable" if forecast unavailable
export function getOutlookLabel(
  entries: GraduationEntry[]
): "Growing" | "Stable" | "Declining" {
  const forecast = computeForecast(entries);
  return forecast?.outlookLabel ?? "Stable";
}
