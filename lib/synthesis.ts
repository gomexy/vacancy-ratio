/**
 * Derives structured market-synthesis signals from available data.
 * All returned statements are grounded in the input data — nothing is invented.
 */
import type { MarketSnapshot } from "@/lib/types";
import type { ForecastResult } from "@/lib/forecast";
import type { SkillDemand } from "@/lib/types";

export interface SynthesisItem {
  label: string;
  detail: string;
}

export interface MarketSynthesis {
  keyTakeaway: SynthesisItem;
  mainOpportunity: SynthesisItem | null;
  mainRisk: SynthesisItem | null;
  skillsToWatch: string[];
  bestLocations: string[];
  fiveYearOutlook: {
    label: "Growing" | "Stable" | "Declining";
    confidence: string;
    detail: string;
  } | null;
}

function fmtPer100(v: number): string {
  return v >= 10 ? Math.round(v).toString() : v.toFixed(1);
}

function buildKeyTakeaway(
  snapshot: MarketSnapshot,
  fieldLabel: string
): SynthesisItem {
  const v = fmtPer100(snapshot.vacanciesPer100Graduates);
  switch (snapshot.signal) {
    case "critical-shortage":
      return {
        label: "Demand significantly exceeds supply",
        detail: `${v} vacancies per 100 ${fieldLabel} graduates — employers are actively competing for talent.`,
      };
    case "strong-demand":
      return {
        label: "Demand is growing",
        detail: `${v} vacancies per 100 ${fieldLabel} graduates — the market actively absorbs new entrants.`,
      };
    case "balanced":
      return {
        label: "Supply and demand are broadly matched",
        detail: `${v} vacancies per 100 ${fieldLabel} graduates — competition is moderate.`,
      };
    case "surplus":
      return {
        label: "Supply is outpacing demand",
        detail: `${v} vacancies per 100 ${fieldLabel} graduates — differentiation and specialisation improve prospects.`,
      };
    case "significant-surplus":
      return {
        label: "Significant graduate surplus",
        detail: `${v} vacancies per 100 ${fieldLabel} graduates — graduates substantially outnumber available roles.`,
      };
  }
}

function buildMainOpportunity(
  snapshot: MarketSnapshot,
  skills: SkillDemand[]
): SynthesisItem | null {
  if (skills.length === 0) return null;

  const sorted = [...skills]
    .filter((s) => (s.growthPct ?? 0) > 0)
    .sort((a, b) => (b.growthPct ?? 0) - (a.growthPct ?? 0));

  const topGrowing = sorted[0];

  if (topGrowing && (topGrowing.growthPct ?? 0) >= 15) {
    return {
      label: `${topGrowing.skill}-related roles`,
      detail: `${topGrowing.skill} demand in job postings grew ${
        (topGrowing.growthPct ?? 0) > 0 ? "+" : ""
      }${topGrowing.growthPct} ppt year-on-year — the fastest-growing skill tracked in this field.`,
    };
  }

  if (
    snapshot.signal === "critical-shortage" ||
    snapshot.signal === "strong-demand"
  ) {
    const topSkill = skills[0];
    return {
      label: "Strong hiring environment across roles",
      detail: topSkill
        ? `Employer demand outpaces graduate supply. ${topSkill.skill} is the most in-demand skill in this field.`
        : "Employer demand outpaces graduate supply — candidates have meaningful choice.",
    };
  }

  if (topGrowing) {
    return {
      label: `Growing demand for ${topGrowing.skill}`,
      detail: `${topGrowing.skill} is the fastest-growing skill in job postings for this field.`,
    };
  }

  return null;
}

function buildMainRisk(
  snapshot: MarketSnapshot,
  forecast: ForecastResult | null
): SynthesisItem | null {
  if (forecast) {
    const diff = forecast.graduateCAGR - forecast.vacancyCAGR;

    if (diff > 2) {
      return {
        label: "Graduate supply growing faster than vacancy demand",
        detail: `Graduates grew at ${forecast.graduateCAGR.toFixed(
          1
        )}% p.a. vs ${forecast.vacancyCAGR.toFixed(1)}% for vacancies in the observed period.`,
      };
    }

    if (forecast.outlookLabel === "Declining") {
      return {
        label: "Downward outlook projected",
        detail:
          "If current trends continue, the vacancy-to-graduate ratio is projected to decline — competition for roles is expected to increase.",
      };
    }

    if (
      (snapshot.signal === "strong-demand" ||
        snapshot.signal === "critical-shortage") &&
      forecast.graduateCAGR > 5
    ) {
      return {
        label: "Growing graduate supply could moderate conditions",
        detail: `Graduate numbers are growing at ${forecast.graduateCAGR.toFixed(
          1
        )}% p.a. — if this rate continues, the market could become more competitive over time.`,
      };
    }
  }

  if (snapshot.signal === "significant-surplus") {
    return {
      label: "Highly competitive market",
      detail:
        "Graduates substantially outnumber available roles. Specialisation and differentiation are important for individual prospects.",
    };
  }

  if (snapshot.signal === "surplus") {
    return {
      label: "More graduates than available roles",
      detail:
        "Practical experience and specialist skills provide meaningful differentiation in this market.",
    };
  }

  return null;
}

export function computeSynthesis(
  snapshot: MarketSnapshot,
  forecast: ForecastResult | null,
  skills: SkillDemand[],
  topCities: string[],
  fieldLabel: string
): MarketSynthesis {
  const skillsToWatch = [...skills]
    .filter((s) => (s.growthPct ?? 0) > 0)
    .sort((a, b) => (b.growthPct ?? 0) - (a.growthPct ?? 0))
    .slice(0, 3)
    .map((s) => s.skill);

  const fiveYearOutlook = forecast
    ? {
        label: forecast.outlookLabel,
        confidence: forecast.confidence,
        detail: `${forecast.confidence} confidence — vacancy trend ${
          forecast.vacancyCAGR >= 0 ? "+" : ""
        }${forecast.vacancyCAGR.toFixed(1)}% p.a. (observed).`,
      }
    : null;

  return {
    keyTakeaway: buildKeyTakeaway(snapshot, fieldLabel),
    mainOpportunity: buildMainOpportunity(snapshot, skills),
    mainRisk: buildMainRisk(snapshot, forecast),
    skillsToWatch,
    bestLocations: topCities.slice(0, 3),
    fiveYearOutlook,
  };
}
