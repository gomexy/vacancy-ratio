import type { GraduationEntry } from "@/lib/types";
import { computeSnapshot } from "@/lib/compute";

// ── New interfaces for the 5-Year Outlook feature ────────────────────────────

export interface OutlookFactor {
  id: string;
  label: string;
  value: string;
  direction: "positive" | "negative" | "neutral";
  headline: string;
  detail: string;
}

export interface ChangeScenario {
  type: "upside" | "downside" | "structural";
  label: string;
  description: string;
}

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

// ── computeOutlookFactors ─────────────────────────────────────────────────────

function fmtSignedPct(v: number): string {
  const sign = v >= 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}% p.a.`;
}

export function computeOutlookFactors(
  result: ForecastResult,
  trendEntries: GraduationEntry[]
): OutlookFactor[] {
  const sorted = [...trendEntries]
    .filter((e) => !e.isProjected)
    .sort((a, b) => a.year - b.year);

  const lastHistorical = sorted[sorted.length - 1];
  const startRatio = lastHistorical
    ? computeSnapshot(lastHistorical).vacancyRatio
    : 0;
  const endRatio =
    result.projections[result.projections.length - 1]?.ratio ?? startRatio;

  const { vacancyCAGR, graduateCAGR } = result;

  // Factor 1: Vacancy demand trend
  const vacancyDirection: OutlookFactor["direction"] =
    vacancyCAGR > 3 ? "positive" : vacancyCAGR < 0 ? "negative" : "neutral";
  const vacancyFactor: OutlookFactor = {
    id: "vacancy-demand",
    label: "Vacancy demand trend",
    value: fmtSignedPct(vacancyCAGR),
    direction: vacancyDirection,
    headline:
      vacancyCAGR > 3
        ? "Vacancy demand growing above baseline"
        : vacancyCAGR < 0
        ? "Vacancy demand contracting in observed period"
        : "Vacancy demand broadly stable",
    detail: `Observed vacancy CAGR of ${fmtSignedPct(vacancyCAGR)} over the historical period. ${
      vacancyCAGR > 3
        ? "Sustained growth in employer demand is a positive signal for graduates entering this field."
        : vacancyCAGR < 0
        ? "A declining vacancy trend increases competition for available roles."
        : "Modest growth is broadly in line with general labour market expansion."
    }`,
  };

  // Factor 2: Graduate supply trend
  const supplyDirection: OutlookFactor["direction"] =
    vacancyCAGR > graduateCAGR + 2
      ? "positive"
      : graduateCAGR > vacancyCAGR + 2
      ? "negative"
      : "neutral";
  const supplyFactor: OutlookFactor = {
    id: "graduate-supply",
    label: "Graduate supply trend",
    value: fmtSignedPct(graduateCAGR),
    direction: supplyDirection,
    headline:
      supplyDirection === "positive"
        ? "Vacancies outpacing graduate supply"
        : supplyDirection === "negative"
        ? "Graduate supply growing faster than demand"
        : "Supply and demand broadly in step",
    detail: `Graduate supply CAGR of ${fmtSignedPct(graduateCAGR)} versus vacancy growth of ${fmtSignedPct(vacancyCAGR)}. ${
      supplyDirection === "positive"
        ? "When demand grows faster than supply, the vacancy ratio improves for graduates."
        : supplyDirection === "negative"
        ? "When graduate numbers grow faster than vacancies, competition for roles intensifies."
        : "Balanced growth rates suggest the market structure is likely to remain similar."
    }`,
  };

  // Factor 3: Ratio trajectory
  const ratioRising = endRatio > startRatio;
  const ratioDirection: OutlookFactor["direction"] = ratioRising
    ? "positive"
    : endRatio < startRatio
    ? "negative"
    : "neutral";
  const ratioFactor: OutlookFactor = {
    id: "ratio-trajectory",
    label: "Ratio trajectory",
    value: `${startRatio.toFixed(2)} → ${endRatio.toFixed(2)}`,
    direction: ratioDirection,
    headline: ratioRising
      ? "Projected ratio improving over 5 years"
      : endRatio < startRatio
      ? "Projected ratio declining over 5 years"
      : "Projected ratio broadly unchanged",
    detail: `If current CAGR rates continue, the vacancy ratio is projected to move from ${startRatio.toFixed(2)} to ${endRatio.toFixed(2)} by ${result.projections[result.projections.length - 1]?.year ?? "the end of the projection period"}. This projection is directional only and assumes no structural changes.`,
  };

  // Factor 4: Skill dynamics
  const skillFactor: OutlookFactor = {
    id: "skill-dynamics",
    label: "Skill dynamics",
    value: "Field-level",
    direction: "neutral",
    headline:
      "Skills tracked at field level — city-specific data not available in this demo",
    detail:
      "Skill demand data is aggregated at the field level and does not reflect sub-regional or city-level variation. Actual skill requirements may differ by employer type, location, and seniority.",
  };

  return [vacancyFactor, supplyFactor, ratioFactor, skillFactor];
}

// ── computeChangeScenarios ────────────────────────────────────────────────────

const FIELD_SCENARIOS: Record<string, ChangeScenario[]> = {
  "computer-science": [
    {
      type: "downside",
      label: "AI-driven automation",
      description:
        "Accelerated AI adoption could structurally reduce demand for entry-level software roles, particularly coding, testing, and routine development tasks.",
    },
    {
      type: "downside",
      label: "Economic contraction",
      description:
        "A significant downturn would likely compress tech hiring budgets, particularly at larger enterprises and venture-backed startups.",
    },
    {
      type: "upside",
      label: "Accelerated digital transformation",
      description:
        "Faster-than-projected enterprise adoption of cloud, AI/ML, and data infrastructure could push vacancy growth above the modelled rate.",
    },
    {
      type: "structural",
      label: "Graduate supply expansion",
      description:
        "Government-led STEM expansion or new CS programmes could significantly increase graduate numbers, compressing the vacancy-to-graduate ratio.",
    },
  ],
  "data-science": [
    {
      type: "downside",
      label: "Automated analysis tools",
      description:
        "Rapid improvement in AI-assisted analytics platforms could reduce demand for entry-level data science roles focused on routine model building and reporting.",
    },
    {
      type: "downside",
      label: "Bootcamp supply growth",
      description:
        "Continued growth in short-course data science programmes could increase graduate supply faster than employer demand, compressing the vacancy ratio.",
    },
    {
      type: "upside",
      label: "AI/ML infrastructure expansion",
      description:
        "Widespread enterprise adoption of machine learning infrastructure could sustain strong demand for practitioners capable of building, deploying, and monitoring models.",
    },
    {
      type: "structural",
      label: "Regulatory data requirements",
      description:
        "New data governance, privacy, or AI transparency regulations could create sustained demand for data professionals with compliance and auditing expertise.",
    },
  ],
  finance: [
    {
      type: "downside",
      label: "Fintech and automation",
      description:
        "Continued automation of back-office, compliance, and analytical tasks by fintech platforms could structurally reduce headcount in traditional finance roles.",
    },
    {
      type: "downside",
      label: "Regulatory or recessionary pressure",
      description:
        "A sustained economic downturn or tighter capital requirements could reduce hiring across investment banking, asset management, and corporate finance.",
    },
    {
      type: "upside",
      label: "Capital market expansion",
      description:
        "Growth in private markets, ESG investing, and retail participation in capital markets could drive incremental demand for finance graduates beyond the modelled rate.",
    },
    {
      type: "structural",
      label: "Accounting standard changes",
      description:
        "Major shifts in reporting standards — such as sustainability disclosure mandates — could drive a temporary but significant retraining demand that re-shapes graduate requirements.",
    },
  ],
  nursing: [
    {
      type: "upside",
      label: "Ageing population demand",
      description:
        "Sustained demographic pressure from an ageing population could maintain or accelerate nursing vacancy growth well above the observed baseline rate.",
    },
    {
      type: "downside",
      label: "Workforce attrition from burnout",
      description:
        "High rates of burnout and attrition in the profession could widen the effective supply gap, but are unlikely to resolve quickly without structural pay and workload reform.",
    },
    {
      type: "downside",
      label: "Immigration policy changes",
      description:
        "Tighter immigration policy could reduce cross-border nursing supply in countries that rely on internationally trained nurses to fill domestic gaps.",
    },
    {
      type: "structural",
      label: "Scope-of-practice expansion",
      description:
        "Legislative or regulatory changes expanding nurse practitioner or advanced practice roles could increase the range of roles available, improving the vacancy ratio significantly.",
    },
  ],
  "mechanical-engineering": [
    {
      type: "upside",
      label: "Industrial reshoring",
      description:
        "Government-backed reshoring of manufacturing capacity could drive sustained demand for mechanical engineers above the current trend rate.",
    },
    {
      type: "downside",
      label: "Automation displacing traditional roles",
      description:
        "Advanced robotics and process automation could reduce headcount requirements in traditional manufacturing and maintenance roles for mechanical graduates.",
    },
    {
      type: "downside",
      label: "Infrastructure investment slowdown",
      description:
        "Cuts to public capital works or a slowdown in construction activity could reduce demand across engineering disciplines including mechanical.",
    },
    {
      type: "structural",
      label: "Electric vehicle transition",
      description:
        "The shift from internal combustion to electric powertrains is reshaping skills demand, reducing some traditional mechanical roles while creating new ones in thermal management and drive systems.",
    },
  ],
  "civil-engineering": [
    {
      type: "upside",
      label: "Infrastructure investment programmes",
      description:
        "Significant government-led infrastructure programmes — transport, water, energy — could sustain strong civil engineering demand well beyond the modelled projection.",
    },
    {
      type: "downside",
      label: "Public capital budget constraints",
      description:
        "Fiscal tightening could delay or cancel major infrastructure programmes, reducing project pipeline and near-term hiring demand.",
    },
    {
      type: "downside",
      label: "Construction cost inflation",
      description:
        "Sustained materials and labour cost inflation could reduce the economic viability of planned projects, shrinking the effective vacancy pipeline.",
    },
    {
      type: "structural",
      label: "Climate adaptation requirements",
      description:
        "Increasing investment in flood defences, heat-resilient infrastructure, and coastal management could reshape the project mix, requiring different specialisations than the current graduate cohort.",
    },
  ],
  "business-administration": [
    {
      type: "downside",
      label: "AI-driven management automation",
      description:
        "Automation of scheduling, reporting, and administrative coordination functions could structurally reduce entry-level demand for generalist business graduates.",
    },
    {
      type: "downside",
      label: "Employer preference for specialists",
      description:
        "Growing employer preference for domain-specialist degrees over generalist business administration qualifications could compress the effective vacancy pool for BA graduates.",
    },
    {
      type: "upside",
      label: "SME growth driving generalist demand",
      description:
        "Expansion of the small-to-medium enterprise sector — which typically values versatile generalists — could sustain demand even as large employers automate routine functions.",
    },
    {
      type: "structural",
      label: "Remote work geographic expansion",
      description:
        "Normalisation of remote and hybrid work could expand the geographic hiring pool for business roles, simultaneously increasing competition and opportunity for graduates.",
    },
  ],
  "electrical-engineering": [
    {
      type: "upside",
      label: "Electrification and energy transition",
      description:
        "The transition to electric vehicles, heat pumps, and grid-connected renewables is generating sustained demand for electrical engineers across infrastructure and product development.",
    },
    {
      type: "downside",
      label: "Electronics manufacturing slowdown",
      description:
        "A cyclical downturn in semiconductor and consumer electronics manufacturing could temporarily but significantly reduce vacancy volumes in hardware-focused roles.",
    },
    {
      type: "upside",
      label: "Renewable energy buildout",
      description:
        "Continued investment in wind, solar, and grid-scale storage infrastructure could sustain above-trend demand for electrical engineers in project delivery roles.",
    },
    {
      type: "structural",
      label: "Grid modernisation skills shift",
      description:
        "Smart grid, power electronics, and distributed energy management require a different skills profile than traditional power distribution roles, reshaping graduate requirements over the medium term.",
    },
  ],
};

function genericScenarios(
  outlook: "Growing" | "Stable" | "Declining"
): ChangeScenario[] {
  if (outlook === "Growing") {
    return [
      {
        type: "upside",
        label: "Sustained sector expansion",
        description:
          "If sector-level growth continues to exceed expectations, vacancy growth could outpace the modelled CAGR rate, improving outcomes for graduates.",
      },
      {
        type: "upside",
        label: "Labour market tightening",
        description:
          "A broad tightening of the labour market — driven by demographic or structural factors — could amplify the vacancy signal in this field.",
      },
      {
        type: "downside",
        label: "Economic downturn or sector slowdown",
        description:
          "A macroeconomic contraction or sector-specific disruption could reverse or moderate the current growth trajectory significantly.",
      },
      {
        type: "structural",
        label: "Technology reshaping role mix",
        description:
          "Automation or technology adoption may shift the type of roles available, requiring graduates to adapt to new specialisations not reflected in current vacancy data.",
      },
    ];
  }

  if (outlook === "Declining") {
    return [
      {
        type: "upside",
        label: "Structural demand recovery",
        description:
          "Policy support, infrastructure investment, or industry restructuring could reverse the declining trend and restore vacancy growth.",
      },
      {
        type: "downside",
        label: "Continued demand contraction",
        description:
          "If the structural factors driving the current decline persist or accelerate, the vacancy-to-graduate ratio could deteriorate further.",
      },
      {
        type: "downside",
        label: "Graduate supply growth outpacing vacancies",
        description:
          "If graduate numbers continue to grow while vacancies contract, competition for available roles will increase markedly.",
      },
      {
        type: "structural",
        label: "Technology-driven role transformation",
        description:
          "Disruption from automation or AI could reshape the skill requirements for roles in this field, creating a mismatch between current graduate profiles and employer needs.",
      },
    ];
  }

  // Stable
  return [
    {
      type: "upside",
      label: "Cyclical recovery",
      description:
        "A cyclical upturn in the broader economy or within the sector could lift vacancy growth above the stable baseline, improving prospects for graduates.",
    },
    {
      type: "downside",
      label: "Economic contraction",
      description:
        "A recession or sector slowdown could tip the market from stable to declining, particularly if graduate supply continues to grow.",
    },
    {
      type: "structural",
      label: "Automation reshaping skill requirements",
      description:
        "Technology adoption may gradually alter which roles exist and which skills are valued, requiring graduates to adapt even in a broadly stable market.",
    },
    {
      type: "structural",
      label: "Policy or regulatory change",
      description:
        "Changes to licensing requirements, public funding, or sector regulation could shift employer hiring patterns significantly in either direction.",
    },
  ];
}

export function computeChangeScenarios(
  field: string,
  outlook: "Growing" | "Stable" | "Declining"
): ChangeScenario[] {
  return FIELD_SCENARIOS[field] ?? genericScenarios(outlook);
}

// Returns the outlook label directly, or "Stable" if forecast unavailable
export function getOutlookLabel(
  entries: GraduationEntry[]
): "Growing" | "Stable" | "Declining" {
  const forecast = computeForecast(entries);
  return forecast?.outlookLabel ?? "Stable";
}
