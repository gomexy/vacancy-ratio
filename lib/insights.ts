import type { MarketSignal } from "@/lib/types";

interface FieldInsights {
  summary: string;
  bullets: string[];
}

// Generic signal-level fallback
function signalSummary(signal: MarketSignal, fieldLabel: string, vacanciesPer100: number): string {
  const v = vacanciesPer100.toFixed(0);
  switch (signal) {
    case "critical-shortage":
      return `With ${v} vacancies for every 100 ${fieldLabel} graduates, employers are actively competing for talent. New graduates enter an exceptional market.`;
    case "strong-demand":
      return `With ${v} vacancies for every 100 ${fieldLabel} graduates, demand meaningfully outpaces supply. The market actively absorbs new entrants.`;
    case "balanced":
      return `With ${v} vacancies for every 100 ${fieldLabel} graduates, supply and demand are broadly aligned. Entry is competitive but conditions are fair.`;
    case "surplus":
      return `With ${v} vacancies for every 100 ${fieldLabel} graduates, graduates modestly outnumber available roles. Differentiation matters.`;
    case "significant-surplus":
      return `With only ${v} vacancies for every 100 ${fieldLabel} graduates, graduates substantially outnumber available roles. Strategic differentiation is essential.`;
  }
}

// Per-field bullet points — indexed by field slug, then signal
const FIELD_BULLETS: Partial<Record<string, Partial<Record<MarketSignal, string[]>>>> = {
  "computer-science": {
    "significant-surplus": [
      "Specialisation in AI/ML, cloud infrastructure, or cybersecurity meaningfully improves individual prospects — generalist roles are the most crowded.",
      "Geographic mobility matters: tier-1 city and tech-hub markets often maintain vacancy ratios several multiples above the national average.",
      "International markets — particularly the US, Germany, and Australia — maintain ratios above 1.0 for the same discipline.",
    ],
    "surplus": [
      "Build a strong portfolio of applied projects: employers increasingly weight demonstrable work over academic credentials alone.",
      "Open-source contributions and internship experience provide meaningful signal in a competitive applicant pool.",
      "Specialised tracks (security, ML ops, embedded systems) offer better entry conditions than general software engineering.",
    ],
    "balanced": [
      "Competition is fair — focus on developing depth in 1–2 technical domains rather than broad generalism.",
      "Companies in non-tech sectors (finance, healthcare, manufacturing) often hire CS graduates at better terms than saturated tech markets.",
    ],
    "strong-demand": [
      "Employers are competing for CS talent — a strong time to negotiate compensation, remote work terms, and role scope.",
      "Entry-level candidates can afford to be selective. Avoid accepting below-market offers on the basis of employer brand alone.",
    ],
    "critical-shortage": [
      "Employers are competing aggressively for graduates. Senior and specialised roles are accessible earlier than typical.",
      "Consider multiple offers and negotiate proactively — market conditions are firmly in the candidate's favour.",
    ],
  },

  "nursing": {
    "significant-surplus": [
      "Explore urban hospital networks, private healthcare, and international placements — shortfalls vary significantly by location and sector.",
      "Specialisation in high-acuity areas (ICU, theatre, ED) improves employment conditions markedly.",
    ],
    "surplus": [
      "Location flexibility significantly improves prospects — regional and rural postings often carry financial incentives.",
      "Postgraduate specialisation in advanced practice nursing (NP, clinical nurse specialist) opens a faster pathway to senior roles.",
    ],
    "balanced": [
      "Conditions are stable. Specialisation in high-demand areas (ICU, theatre, oncology) provides additional security.",
      "Public and private sector opportunities are broadly comparable — choose based on progression rather than immediacy.",
    ],
    "strong-demand": [
      "Healthcare systems are experiencing genuine workforce pressure — new graduates have real negotiating leverage on salary, shifts, and location.",
      "International mobility is well-supported: nurses qualify for fast-track visa pathways in the UK, Australia, Canada, and the Gulf.",
      "Public-sector roles often carry loan assistance and accelerated progression in shortage environments.",
    ],
    "critical-shortage": [
      "Extreme demand gives new graduates rare negotiating power — salary, shift patterns, and location are all in play.",
      "International postings (UK, Australia, Canada, Gulf) offer enhanced packages specifically targeting shortage roles.",
      "Consider specialising in the highest-acuity areas for fastest career progression in the current environment.",
    ],
  },

  "finance": {
    "significant-surplus": [
      "Chartered qualifications (CFA, ACCA, CA) significantly differentiate candidates from the large graduate pool.",
      "Fintech, risk analytics, and regulatory technology are growing faster than traditional banking — worth prioritising as a specialisation.",
      "Investment banks and asset managers remain highly competitive; corporate finance, treasury, and FP&A offer more accessible entry.",
    ],
    "surplus": [
      "Focus early on building a professional qualification (CFA Level 1, ACCA) — it signals commitment in a crowded field.",
      "Data skills (Python, SQL, Excel modelling) are increasingly table-stakes for finance roles and provide a genuine edge.",
    ],
    "balanced": [
      "The market is broadly fair. Strong performance in technical interviews (financial modelling, case studies) is the key differentiator.",
      "Consider corporate finance, FP&A, and treasury alongside investment banking — competition is significantly lower for equivalent pay bands.",
    ],
    "strong-demand": [
      "Finance employers are actively hiring — a good window to target competitive roles including investment banking and asset management.",
      "Consider negotiating beyond base salary: bonus structures, study support, and remote flexibility are all in play.",
    ],
    "critical-shortage": [
      "Finance talent is genuinely scarce — employers are offering stronger packages and accelerated progression paths.",
      "CFA and CA holders can expect premium offers; even uncertified graduates have strong leverage.",
    ],
  },

  "data-science": {
    "significant-surplus": [
      "The data science market is maturing — domain-specific expertise (healthcare AI, financial ML, climate analytics) is more valued than generalist data skills.",
      "Consider adjacent roles: data engineering, ML platform engineering, and AI product management are growing faster than pure data science.",
    ],
    "surplus": [
      "Build in-depth domain knowledge alongside technical skills — employers increasingly want data scientists who understand the business deeply.",
      "Kaggle rankings, published work, and open-source contributions remain strong differentiators.",
    ],
    "balanced": [
      "A stable market. Specialise in ML engineering or MLOps to stand out from analysts who only build models.",
      "Industry verticals with the most active data science hiring: healthcare, financial services, and climate/energy.",
    ],
    "strong-demand": [
      "Data science remains one of the few disciplines where demand consistently outpaces supply — negotiate proactively.",
      "Domain-specialised roles (healthcare AI, risk ML, NLP) command a premium over generalist data positions.",
    ],
    "critical-shortage": [
      "Exceptional market conditions — data science talent is genuinely scarce and employers are competing aggressively.",
      "Senior and ML engineering roles are accessible earlier than typical; consider holding out for senior positions.",
    ],
  },

  "mechanical-engineering": {
    "significant-surplus": [
      "Traditional manufacturing roles face automation pressure in some sectors. Emerging areas — EV engineering, robotics, aerospace — offer substantially better conditions.",
      "Cross-disciplinary skills in embedded systems, power electronics, or materials science significantly broaden employment options.",
      "Consider international markets: Germany, the US, and South Korea maintain stronger mechanical engineering ratios.",
    ],
    "surplus": [
      "The energy transition is creating pockets of real demand: wind turbine, solar, and grid-scale battery engineering roles are growing.",
      "Focus on gaining hands-on manufacturing or design experience through internships — practical skills differentiate strongly.",
    ],
    "balanced": [
      "A fair market. Aerospace, defence, and advanced manufacturing maintain the strongest conditions.",
      "Sustainable infrastructure (renewables, EV charging, water management) is an emerging and fast-growing specialisation.",
    ],
    "strong-demand": [
      "Mechanical engineers are in demand — consider the sectors driving the growth (EV, renewable energy, advanced manufacturing) for the best long-term trajectory.",
    ],
    "critical-shortage": [
      "Strong market. Focus on high-value sectors: aerospace, defence, and precision engineering where the demand concentration is highest.",
    ],
  },

  "civil-engineering": {
    "significant-surplus": [
      "Infrastructure demand is highly cyclical — government spending programmes create concentrated demand. Research upcoming major projects in your target region.",
      "Environmental, transportation, and water engineering are growing faster than general construction — worth specialising.",
      "Postgraduate study in structural, geotechnical, or environmental engineering markedly improves the graduate-level job search.",
    ],
    "surplus": [
      "Chartership (ICE, ASCE) accelerates career progression and is increasingly expected by major infrastructure employers.",
      "Regional variation is significant — areas with active infrastructure pipelines (HS2, NEOM, Snowy 2.0) have markedly better conditions.",
    ],
    "balanced": [
      "A stable market. Chartership and specialisation in environmental or transportation engineering provide meaningful upside.",
    ],
    "strong-demand": [
      "Infrastructure investment cycles are driving real demand. Target roles connected to major government-backed programmes.",
    ],
    "critical-shortage": [
      "Civil engineers are in high demand. Senior roles and chartership-fast-track programmes are accessible early.",
    ],
  },

  "business-administration": {
    "significant-surplus": [
      "Business administration is one of the highest-volume graduate streams relative to available roles — specialisation is essential.",
      "Finance, operations, and technology management pathways offer better differentiation than general management tracks.",
      "Employers increasingly value industry-specific experience and functional depth over generalist MBA credentials for entry-level roles.",
    ],
    "surplus": [
      "Internship and work placement experience are highly valued — prioritise these over additional academic qualifications.",
      "Tech-adjacent business roles (product operations, growth, business intelligence) are growing and typically less saturated.",
    ],
    "balanced": [
      "A competitive but fair market. Functional specialisation — finance, supply chain, or digital operations — provides the clearest differentiation.",
    ],
    "strong-demand": [
      "A favourable environment. Employers are actively hiring across operations, strategy, and management roles.",
    ],
    "critical-shortage": [
      "Experienced business administrators are genuinely scarce. Leverage this to negotiate better roles and faster progression.",
    ],
  },

  "electrical-engineering": {
    "significant-surplus": [
      "The energy transition is creating genuine demand in power electronics, EV systems, smart grids, and battery storage — these are the growth areas within the discipline.",
      "Semiconductor and chip design roles are highly sought — consider building skills in VLSI, embedded systems, or FPGA design.",
    ],
    "surplus": [
      "Early career moves into renewable energy or EV engineering position well for the medium-term market improvement projections suggest.",
      "Power systems and industrial automation are the most active traditional areas — good foundations for adjacent moves.",
    ],
    "balanced": [
      "A stable market. The energy transition and semiconductor onshoring are creating new demand pockets worth targeting.",
    ],
    "strong-demand": [
      "Electrical engineering skills are in genuine demand — driven largely by the energy transition and semiconductor investment.",
    ],
    "critical-shortage": [
      "Exceptional demand — particularly for power electronics and renewable energy specialists. Negotiate proactively.",
    ],
  },
};

// Generic bullets as fallback when no field-specific bullets exist
const GENERIC_BULLETS: Record<MarketSignal, string[]> = {
  "critical-shortage": [
    "Employers are actively competing for graduates — negotiate salary, scope, and location proactively.",
    "This is an excellent time to target senior-level or specialist roles that would normally require more experience.",
  ],
  "strong-demand": [
    "Market conditions favour candidates — don't accept the first offer without exploring alternatives.",
    "Specialisation commands a premium over generalist profiles in strong-demand markets.",
  ],
  "balanced": [
    "Competition is moderate — differentiate through practical experience and functional depth.",
    "Adjacent industries and roles often offer comparable pay with less competition.",
  ],
  "surplus": [
    "Postgraduate qualifications or industry certifications can meaningfully shift your position in the applicant pool.",
    "Geographic flexibility significantly improves prospects — national averages can mask strong regional pockets.",
  ],
  "significant-surplus": [
    "Specialisation, geographic mobility, and sector-switching are the most reliable routes to better conditions.",
    "International markets may maintain significantly higher ratios for the same discipline — worth researching.",
    "Postgraduate study or professional qualifications provide meaningful differentiation in surplus markets.",
  ],
};

export function getFieldInsights(
  field: string,
  signal: MarketSignal,
  vacanciesPer100: number,
  fieldLabel: string
): FieldInsights {
  const summary = signalSummary(signal, fieldLabel, vacanciesPer100);
  const bullets =
    FIELD_BULLETS[field]?.[signal] ?? GENERIC_BULLETS[signal];

  return { summary, bullets };
}
