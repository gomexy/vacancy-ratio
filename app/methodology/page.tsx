import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How VacancyRatio collects vacancy and graduate data, categorises fields, calculates the ratio, generates forecasts, and uses AI — including limitations and what is currently demo data.",
};

const SOURCES = [
  {
    country: "India",
    graduates: "AICTE Annual Report; UGC Annual Report; Indian Nursing Council",
    vacancies:  "Ministry of Labour & Employment Vacancy Survey; NASSCOM Jobs Reports; RBI Employment Survey",
  },
  {
    country: "United States",
    graduates: "National Center for Education Statistics (NCES); HRSA",
    vacancies:  "Bureau of Labor Statistics JOLTS",
  },
  {
    country: "United Kingdom",
    graduates: "Higher Education Statistics Agency (HESA); Nursing & Midwifery Council (NMC)",
    vacancies:  "ONS Vacancy Survey; NHS Digital",
  },
  {
    country: "Germany",
    graduates: "Destatis (Federal Statistical Office)",
    vacancies:  "Bundesagentur für Arbeit",
  },
  {
    country: "Australia",
    graduates: "Department of Education, Skills and Employment (DESE); AHPRA",
    vacancies:  "Jobs and Skills Australia",
  },
];

const VACANCY_PROVIDERS = [
  {
    name: "Adzuna",
    type: "Job listings API",
    coverage: "US, GB, AU, DE, IN and many others. Real-time job postings, salary data, category-level aggregates.",
    status: "Supported — set ADZUNA_APP_ID + ADZUNA_API_KEY to activate.",
    url: "https://developer.adzuna.com/",
  },
  {
    name: "BLS JOLTS",
    type: "Official labour survey",
    coverage: "US monthly job openings by industry and occupation. Highly authoritative but not real-time.",
    status: "Planned.",
    url: "https://www.bls.gov/jlt/",
  },
  {
    name: "UNESCO UIS API",
    type: "Graduate data",
    coverage: "Global graduation completions, 200+ countries, ISCED classification.",
    status: "Planned.",
    url: "https://uis.unesco.org/en/uis-api",
  },
  {
    name: "Eurostat API",
    type: "Graduate + vacancy data",
    coverage: "EU graduation and employment data, harmonised across member states.",
    status: "Planned.",
    url: "https://ec.europa.eu/eurostat/web/json-and-unicode-web-services",
  },
  {
    name: "OECD Stats API",
    type: "Cross-country employment",
    coverage: "Employment and labour market data across OECD members.",
    status: "Planned.",
    url: "https://stats.oecd.org/",
  },
];

const THRESHOLDS = [
  { signal: "Critical Shortage",    range: "> 2.00",       meaning: "Vacancies are more than double the graduate supply. Employers are actively competing for talent." },
  { signal: "Strong Demand",        range: "1.00 – 2.00",  meaning: "More vacancies than graduates. The market actively absorbs new entrants." },
  { signal: "Balanced",             range: "0.75 – 1.00",  meaning: "Supply and demand broadly aligned. Competitive but conditions are fair." },
  { signal: "Surplus",              range: "0.50 – 0.75",  meaning: "More graduates than vacancies. Differentiation matters." },
  { signal: "Significant Surplus",  range: "< 0.50",       meaning: "Graduates substantially outnumber available roles. Specialisation and strategic targeting are important." },
];

const CAVEATS = [
  "Graduation figures count completions, not enrolments. Part-time and distance learners may be under-represented.",
  "Vacancy counts reflect posted roles at a point in time, which may differ from actual hiring volumes or filled positions.",
  "Field mappings between graduation classifications (ISCED) and vacancy classifications (ISCO, SOC, Adzuna categories) are approximate. Many graduates work in adjacent fields.",
  "The ratio does not account for geographic distribution within a country — national averages can mask significant regional imbalances.",
  "City-level vacancy distributions are illustrative estimates, not survey data.",
  "Skills data is derived from job posting text analysis. Postings are not a perfect census of employer demand.",
  "Forecasts use simple CAGR extrapolation and assume current trends continue — they do not model policy changes, economic shocks, or structural shifts.",
  "This data is illustrative. Do not use it for financial, career, or institutional planning without primary source verification.",
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-neutral-900">{children}</h2>
  );
}

// ── Editorial illustrations ───────────────────────────────────────────────────

// 1. Graduate Supply — abstract people flowing into a national count
function GraduateSupplyIllustration() {
  return (
    <svg width="220" height="72" viewBox="0 0 220 72" fill="none" aria-hidden="true">
      {/* Person 1 */}
      <circle cx="13" cy="20" r="5.5" stroke="#d4d4d4" strokeWidth="1.5"/>
      <line x1="13" y1="25.5" x2="13" y2="40" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Person 2 */}
      <circle cx="33" cy="20" r="5.5" stroke="#d4d4d4" strokeWidth="1.5"/>
      <line x1="33" y1="25.5" x2="33" y2="40" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Person 3 */}
      <circle cx="53" cy="20" r="5.5" stroke="#d4d4d4" strokeWidth="1.5"/>
      <line x1="53" y1="25.5" x2="53" y2="40" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Graduate — highlighted yellow */}
      <circle cx="73" cy="20" r="5.5" stroke="#F5C518" strokeWidth="1.5"/>
      <line x1="73" y1="25.5" x2="73" y2="40" stroke="#F5C518" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Mortarboard brim + cap */}
      <line x1="63" y1="14" x2="83" y2="14" stroke="#F5C518" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="68" y="7" width="10" height="7" rx="1.5" stroke="#F5C518" strokeWidth="1" fill="none"/>
      {/* Ellipsis "many more" */}
      <circle cx="90" cy="27" r="1.5" fill="#e5e5e5"/>
      <circle cx="96" cy="27" r="1.5" fill="#e5e5e5"/>
      <circle cx="102" cy="27" r="1.5" fill="#e5e5e5"/>
      {/* Flow arrow */}
      <line x1="110" y1="40" x2="128" y2="40" stroke="#e5e5e5" strokeWidth="1" strokeDasharray="3 2" strokeLinecap="round"/>
      <polyline points="124,36 128,40 124,44" stroke="#e5e5e5" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Output block */}
      <rect x="132" y="26" width="80" height="28" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <text x="172" y="37.5" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">graduate supply</text>
      <text x="172" y="47" textAnchor="middle" fontSize="7.5" fill="#92600A" fontFamily="monospace" fontWeight="600">n completions / yr</text>
      {/* Labels */}
      <text x="43" y="58" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">ISCED completions</text>
      <text x="172" y="62" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">national aggregate</text>
    </svg>
  );
}

// 2. Job Demand — stacked job cards flowing to a vacancy count
function JobDemandIllustration() {
  return (
    <svg width="220" height="64" viewBox="0 0 220 64" fill="none" aria-hidden="true">
      {/* Back card */}
      <rect x="4" y="4" width="72" height="42" rx="4" stroke="#ebebeb" strokeWidth="1"/>
      {/* Mid card */}
      <rect x="8" y="8" width="72" height="42" rx="4" stroke="#d4d4d4" strokeWidth="1"/>
      {/* Front card */}
      <rect x="12" y="12" width="72" height="42" rx="4" stroke="#d4d4d4" strokeWidth="1.5"/>
      {/* Card content lines */}
      <line x1="20" y1="22" x2="70" y2="22" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="29" x2="58" y2="29" stroke="#e8e8e8" strokeWidth="1" strokeLinecap="round"/>
      <line x1="20" y1="35" x2="64" y2="35" stroke="#e8e8e8" strokeWidth="1" strokeLinecap="round"/>
      {/* Location pin */}
      <circle cx="66" cy="42" r="4" stroke="#F5C518" strokeWidth="1.5"/>
      <line x1="66" y1="46" x2="66" y2="52" stroke="#F5C518" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Flow dots */}
      <circle cx="100" cy="33" r="1.5" fill="#e5e5e5"/>
      <circle cx="107" cy="33" r="1.5" fill="#e5e5e5"/>
      <circle cx="114" cy="33" r="1.5" fill="#e5e5e5"/>
      <polyline points="118,29 122,33 118,37" stroke="#e5e5e5" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Vacancy count block */}
      <rect x="126" y="14" width="88" height="38" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <text x="170" y="30" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">relevant vacancies</text>
      <text x="170" y="42" textAnchor="middle" fontSize="7.5" fill="#92600A" fontFamily="monospace" fontWeight="600">field + location</text>
      {/* Label */}
      <text x="48" y="62" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">API / survey data</text>
    </svg>
  );
}

// 3. Field mapping — unchanged (already good)
function FieldMappingDiagram() {
  return (
    <svg width="220" height="64" viewBox="0 0 220 64" fill="none" aria-hidden="true">
      <rect x="0" y="4" width="64" height="14" rx="2" stroke="#d4d4d4" strokeWidth="1"/>
      <rect x="0" y="24" width="64" height="14" rx="2" stroke="#d4d4d4" strokeWidth="1"/>
      <rect x="0" y="44" width="64" height="14" rx="2" stroke="#d4d4d4" strokeWidth="1"/>
      <text x="32" y="14" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">ISCED-0612</text>
      <text x="32" y="34" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">SOC-15-1250</text>
      <text x="32" y="54" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">ISCO-2512</text>
      <line x1="64" y1="11" x2="140" y2="19" stroke="#e5e5e5" strokeWidth="1"/>
      <line x1="64" y1="31" x2="140" y2="31" stroke="#e5e5e5" strokeWidth="1"/>
      <line x1="64" y1="51" x2="140" y2="43" stroke="#e5e5e5" strokeWidth="1"/>
      <rect x="140" y="15" width="80" height="18" rx="2" stroke="#F5C518" strokeWidth="1.5"/>
      <text x="180" y="27" textAnchor="middle" fontSize="6.5" fill="#92600A" fontFamily="monospace">computer-science</text>
      <rect x="140" y="39" width="80" height="18" rx="2" stroke="#d4d4d4" strokeWidth="1"/>
      <text x="180" y="51" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">engineering</text>
    </svg>
  );
}

// 4. Deduplication — unchanged (already good)
function DeduplicationDiagram() {
  return (
    <svg width="160" height="44" viewBox="0 0 160 44" fill="none" aria-hidden="true">
      <rect x="0" y="2" width="52" height="16" rx="2" stroke="#d4d4d4" strokeWidth="1"/>
      <text x="26" y="13" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">Provider A</text>
      <rect x="0" y="26" width="52" height="16" rx="2" stroke="#d4d4d4" strokeWidth="1"/>
      <text x="26" y="37" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">Provider B</text>
      <line x1="52" y1="10" x2="86" y2="22" stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round"/>
      <line x1="52" y1="34" x2="86" y2="22" stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="88" cy="22" r="3" stroke="#d4d4d4" strokeWidth="1"/>
      <line x1="91" y1="22" x2="108" y2="22" stroke="#F5C518" strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="104,18 108,22 104,26" stroke="#F5C518" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <rect x="108" y="14" width="52" height="16" rx="2" stroke="#F5C518" strokeWidth="1.5"/>
      <text x="134" y="25" textAnchor="middle" fontSize="6.5" fill="#92600A" fontFamily="monospace">1 record</text>
    </svg>
  );
}

// 5. Ratio — THE FOCAL PIECE: graduate dots ← ratio circle → vacancy dots
function RatioIllustration() {
  // 6 graduate dots (2 × 3) on left
  const grad: [number, number][] = [
    [16, 34], [28, 34],
    [16, 50], [28, 50],
    [16, 66], [28, 66],
  ];
  // 9 vacancy dots (3 × 3) on right — more = demand > supply
  const vac: [number, number][] = [
    [224, 34], [236, 34], [248, 34],
    [224, 50], [236, 50], [248, 50],
    [224, 66], [236, 66], [248, 66],
  ];
  return (
    <svg width="264" height="104" viewBox="0 0 264 104" fill="none" aria-hidden="true">
      {/* Graduate dots */}
      {grad.map(([cx, cy], i) => (
        <circle key={`g${i}`} cx={cx} cy={cy} r="4.5" stroke="#d4d4d4" strokeWidth="1.5"/>
      ))}
      {/* Left label */}
      <text x="22" y="86" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">graduates</text>

      {/* Connecting line left side */}
      <line x1="40" y1="50" x2="86" y2="50" stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="82,46 86,50 82,54" stroke="#e5e5e5" strokeWidth="1" fill="none" strokeLinecap="round"/>

      {/* Central ratio circle */}
      <circle cx="132" cy="50" r="38" stroke="#F5C518" strokeWidth="1.5"/>
      <circle cx="132" cy="50" r="33" stroke="#FDE68A" strokeWidth="0.75" strokeDasharray="2 4" strokeOpacity="0.6"/>
      <text x="132" y="44" textAnchor="middle" fontSize="20" fontWeight="700" fill="#111827" fontFamily="monospace">1.21</text>
      <text x="132" y="57" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">vacancy ratio</text>

      {/* Connecting line right side */}
      <line x1="174" y1="50" x2="218" y2="50" stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="178,46 174,50 178,54" stroke="#e5e5e5" strokeWidth="1" fill="none" strokeLinecap="round"/>

      {/* Vacancy dots */}
      {vac.map(([cx, cy], i) => (
        <circle key={`v${i}`} cx={cx} cy={cy} r="4.5" stroke="#F5C518" strokeWidth="1.5"/>
      ))}
      {/* Right label */}
      <text x="236" y="86" textAnchor="middle" fontSize="6.5" fill="#92600A" fontFamily="monospace">vacancies</text>

      {/* Bottom equation hint */}
      <text x="132" y="100" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">vacancies ÷ graduates = ratio</text>
    </svg>
  );
}

// 6. Market Spectrum — five-zone horizontal spectrum with indicator
function MarketSpectrumIllustration() {
  return (
    <svg width="100%" height="64" viewBox="0 0 280 64" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      {/* Zone fills */}
      <rect x="8"   y="18" width="42" height="18" rx="0" fill="#f3f4f6"/>
      <rect x="50"  y="18" width="38" height="18" rx="0" fill="#f5f5f5"/>
      <rect x="88"  y="18" width="40" height="18" rx="0" fill="#fefce8"/>
      <rect x="128" y="18" width="56" height="18" rx="0" fill="#fffbeb"/>
      <rect x="184" y="18" width="88" height="18" rx="0" fill="#FFF3CD"/>
      {/* Outer border on the whole band */}
      <rect x="8" y="18" width="264" height="18" rx="2" stroke="#e5e5e5" strokeWidth="1" fill="none"/>
      {/* Internal zone dividers */}
      <line x1="50"  y1="18" x2="50"  y2="36" stroke="#e5e5e5" strokeWidth="1"/>
      <line x1="88"  y1="18" x2="88"  y2="36" stroke="#e5e5e5" strokeWidth="1"/>
      <line x1="128" y1="14" x2="128" y2="40" stroke="#F5C518" strokeWidth="1.5"/>
      <line x1="184" y1="18" x2="184" y2="36" stroke="#e5e5e5" strokeWidth="1"/>
      {/* Zone labels above */}
      <text x="29"  y="12" textAnchor="middle" fontSize="5.5" fill="#c4c4c4" fontFamily="monospace">Sig. Surplus</text>
      <text x="69"  y="12" textAnchor="middle" fontSize="5.5" fill="#d4d4d4" fontFamily="monospace">Surplus</text>
      <text x="108" y="12" textAnchor="middle" fontSize="5.5" fill="#d4d4d4" fontFamily="monospace">Balanced</text>
      <text x="156" y="12" textAnchor="middle" fontSize="5.5" fill="#92600A" fontFamily="monospace">Strong Demand</text>
      <text x="216" y="12" textAnchor="middle" fontSize="5.5" fill="#92600A" fontFamily="monospace">Critical Shortage</text>
      {/* Threshold labels below */}
      <text x="8"   y="48" fontSize="6" fill="#d4d4d4" fontFamily="monospace">0</text>
      <text x="50"  y="48" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">0.5</text>
      <text x="88"  y="48" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">0.75</text>
      <text x="128" y="48" textAnchor="middle" fontSize="6" fill="#92600A" fontFamily="monospace">1.0</text>
      <text x="184" y="48" textAnchor="middle" fontSize="6" fill="#9ca3af" fontFamily="monospace">2.0+</text>
      {/* Diamond indicator at "Strong Demand" zone (~ratio 1.21) */}
      <polygon points="152,18 156,22 152,26 148,22" fill="#F5C518" opacity="0.85"/>
      <text x="152" y="58" textAnchor="middle" fontSize="5.5" fill="#92600A" fontFamily="monospace">1.21 →</text>
    </svg>
  );
}

// 7. Forecast — historical solid line → dashed projected line
function ForecastIllustration() {
  const hist: [number, number][] = [[24, 48], [52, 42], [80, 37], [108, 32], [124, 28]];
  const proj: [number, number][] = [[124, 28], [152, 24], [180, 20], [208, 16]];
  const histPts = hist.map(([x, y]) => `${x},${y}`).join(" ");
  const projPts = proj.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <svg width="240" height="80" viewBox="0 0 240 80" fill="none" aria-hidden="true">
      {/* Axes */}
      <line x1="16" y1="8"  x2="16"  y2="60" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="60" x2="220" y2="60" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      {/* 1.0 reference */}
      <line x1="16" y1="44" x2="220" y2="44" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="3 3"/>
      <text x="13" y="47" textAnchor="end" fontSize="6" fill="#e5e5e5" fontFamily="monospace">1.0</text>
      {/* Forecast boundary */}
      <line x1="124" y1="8" x2="124" y2="60" stroke="#e8e8e8" strokeWidth="1" strokeDasharray="3 2" strokeLinecap="round"/>
      {/* Historical line */}
      <polyline points={histPts} stroke="#F5C518" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {hist.map(([cx, cy], i) => (
        <circle key={`h${i}`} cx={cx} cy={cy} r="2.5" fill="#F5C518"/>
      ))}
      {/* Projected line (dashed, grey) */}
      <polyline points={projPts} stroke="#d4d4d4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3"/>
      {proj.slice(1).map(([cx, cy], i) => (
        <circle key={`p${i}`} cx={cx} cy={cy} r="2.5" stroke="#d4d4d4" strokeWidth="1.5" fill="white"/>
      ))}
      {/* Labels */}
      <text x="68"  y="74" textAnchor="middle" fontSize="6" fill="#9ca3af" fontFamily="monospace">observed</text>
      <text x="168" y="74" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">projected</text>
    </svg>
  );
}

// 8. AI insight — structured data → Claude → market summary
function AIInsightIllustration() {
  return (
    <svg width="240" height="56" viewBox="0 0 240 56" fill="none" aria-hidden="true">
      {/* Computed data block with subtle grid */}
      <rect x="0" y="10" width="68" height="36" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <line x1="0"  y1="22" x2="68" y2="22" stroke="#f0f0f0" strokeWidth="0.75"/>
      <line x1="0"  y1="32" x2="68" y2="32" stroke="#f0f0f0" strokeWidth="0.75"/>
      <line x1="22" y1="10" x2="22" y2="46" stroke="#f0f0f0" strokeWidth="0.75"/>
      <text x="34" y="25.5" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">computed</text>
      <text x="34" y="35.5" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">data</text>
      {/* Arrow */}
      <line x1="68" y1="28" x2="88" y2="28" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="84,24 88,28 84,32" stroke="#d4d4d4" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Claude block */}
      <rect x="88" y="10" width="68" height="36" rx="3" stroke="#F5C518" strokeWidth="1.5"/>
      <text x="122" y="27" textAnchor="middle" fontSize="7" fill="#92600A" fontFamily="monospace">Claude</text>
      <text x="122" y="38" textAnchor="middle" fontSize="6" fill="#9ca3af" fontFamily="monospace">interprets</text>
      {/* Arrow */}
      <line x1="156" y1="28" x2="176" y2="28" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="172,24 176,28 172,32" stroke="#d4d4d4" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Summary output block with text hint lines */}
      <rect x="176" y="10" width="64" height="36" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <line x1="184" y1="21" x2="232" y2="21" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="184" y1="29" x2="228" y2="29" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="184" y1="37" x2="220" y2="37" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Labels */}
      <text x="34"  y="54" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">structured input</text>
      <text x="122" y="54" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">AI model</text>
      <text x="208" y="54" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">market summary</text>
    </svg>
  );
}

// 9. Geographic pin — unchanged (already good)
function GeographicPinDiagram() {
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="132" height="72" rx="5" stroke="#e5e5e5" strokeWidth="1" strokeDasharray="5 3"/>
      <circle cx="42" cy="32" r="7" stroke="#F5C518" strokeWidth="1.5"/>
      <line x1="42" y1="39" x2="42" y2="50" stroke="#F5C518" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="42" cy="32" r="14" stroke="#F5C518" strokeWidth="0.75" strokeDasharray="2 3" strokeOpacity="0.5"/>
      <circle cx="88" cy="44" r="4.5" stroke="#d4d4d4" strokeWidth="1"/>
      <line x1="88" y1="48" x2="88" y2="56" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="112" cy="26" r="3" stroke="#d4d4d4" strokeWidth="1"/>
      <line x1="112" y1="29" x2="112" y2="36" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="68" cy="60" r="2.5" stroke="#d4d4d4" strokeWidth="1"/>
      <line x1="68" y1="62" x2="68" y2="68" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <text x="70" y="76" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">national level</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MethodologyPage() {
  return (
    <div style={{ background: "#F0F0F0" }} className="min-h-screen">
    <div className="mx-auto max-w-5xl px-6 sm:px-12 py-10">
    <div className="rounded-2xl border border-neutral-200 bg-white px-8 sm:px-12 py-10">
    <div className="max-w-2xl flex flex-col gap-0">

      {/* Page heading */}
      <div className="pb-10 border-b border-neutral-200">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Methodology
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          How the data works
        </h1>
        <p className="mt-3 text-base text-neutral-500 leading-relaxed">
          VacancyRatio uses a single computed metric to compare graduate supply with job
          vacancy demand. This page explains what the numbers mean, how they are collected,
          how forecasts are generated, how AI is used, and the important limits of this approach.
        </p>
      </div>

      {/* Data status notice */}
      <div className="py-8 border-b border-neutral-200">
        <div className="rounded-md bg-amber-50 border border-amber-100 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">
            Demo data
          </p>
          <p className="text-sm text-amber-800 leading-relaxed">
            All figures shown are illustrative demo data. They are realistic in magnitude
            but are not sourced from live APIs. Planned real data sources are documented below.
            When connected to a live provider (e.g. Adzuna), a{" "}
            <span className="font-semibold">Live · API</span> badge will replace{" "}
            <span className="font-semibold">Demo data</span> throughout the product.
          </p>
        </div>
      </div>

      {/* Vacancy data */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-3">
        <SectionHeading>How vacancy data is collected</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Vacancy data is sourced from job postings APIs and official labour surveys. Each
          posting is tagged with a field/category, location, skills, and posting date. Postings
          from the same role published by multiple aggregators are deduplicated by title,
          company, and location before counting.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          When no live provider is connected, an illustrative count is used, clearly labelled
          as demo data. The vacancy total shown on the Explore page is based on national-level
          figures from planned data sources below.
        </p>
        <div className="mt-2">
          <JobDemandIllustration />
        </div>
      </div>

      {/* Graduate data */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-3">
        <SectionHeading>How graduate data is collected</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Graduate supply is the number of people who completed a qualification in a specific
          field in a given year, as reported by national education statistics bodies. This
          includes undergraduate and postgraduate completions. It does not include enrolments,
          dropouts, or those who graduated in a different year.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Graduate data is a national-level figure. City-level graduate data is rarely
          published and is not currently used. When a city is selected, the graduate count
          remains national and the vacancy count is estimated at city level — this is clearly
          labelled.
        </p>
        <div className="mt-2">
          <GraduateSupplyIllustration />
        </div>
      </div>

      {/* Field classification */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-3">
        <SectionHeading>How jobs are categorised into fields</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Graduate fields follow ISCED (International Standard Classification of Education)
          categories. Vacancy data from providers uses different classifications (ISCO, SOC,
          Adzuna categories). VacancyRatio maps these to a harmonised set of eight field slugs
          used throughout the product. The mapping is approximate — some graduates and vacancies
          near field boundaries may be mis-assigned.
        </p>
        <div className="mt-2">
          <FieldMappingDiagram />
        </div>
      </div>

      {/* Deduplication */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-3">
        <SectionHeading>How duplicate jobs are handled</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          When multiple providers are connected, the same vacancy may appear from several
          sources. Deduplication uses a compound key of normalised job title, company name,
          and city. If two records share all three after normalisation, only one is counted.
          No deduplication is applied in the demo data because all listings have unique IDs.
        </p>
        <div className="mt-2">
          <DeduplicationDiagram />
        </div>
      </div>

      {/* Formula */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-5">
        <SectionHeading>The formula</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Two metrics are computed. Neither is stored — both are derived at query time from
          the raw source figures. This ensures consistency and auditability.
        </p>

        <div className="mt-1">
          <RatioIllustration />
        </div>

        <div className="rounded-md border border-neutral-800 bg-neutral-950 px-5 py-5 font-mono text-sm">
          <p className="text-neutral-500 text-xs mb-3">// Primary metric</p>
          <p className="text-emerald-400">
            vacancyRatio{" "}
            <span className="text-neutral-500">=</span>{" "}
            relevantVacancies{" "}
            <span className="text-neutral-500">/</span>{" "}
            graduates
          </p>
          <p className="text-neutral-600 text-xs mt-4 mb-3">// Normalised for readability</p>
          <p className="text-emerald-400">
            vacanciesPer100Graduates{" "}
            <span className="text-neutral-500">=</span>{" "}
            vacancyRatio{" "}
            <span className="text-neutral-500">×</span>{" "}
            100
          </p>
        </div>

        <p className="text-sm text-neutral-500">
          A ratio of <code className="rounded bg-neutral-100 px-1 font-mono text-xs text-neutral-700">1.0</code> means one vacancy per graduate.
          Above <code className="rounded bg-neutral-100 px-1 font-mono text-xs text-neutral-700">1.0</code> = more vacancies than graduates.
          Below <code className="rounded bg-neutral-100 px-1 font-mono text-xs text-neutral-700">1.0</code> = more graduates than vacancies.
        </p>

        <p className="text-sm text-neutral-500 leading-relaxed">
          <strong className="font-semibold text-neutral-700">Important:</strong> This is a
          labour-market supply-and-demand indicator, not an individual&apos;s probability of
          getting a job. Many graduates work in adjacent fields, in other geographies, or
          outside their field of study entirely.
        </p>
      </div>

      {/* Thresholds */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-5">
        <SectionHeading>Interpretation thresholds</SectionHeading>
        <p className="text-sm text-neutral-600">
          Ratios are mapped to five named signals. These thresholds are editorial
          judgements, not regulatory definitions.
        </p>
        <div className="mt-1">
          <MarketSpectrumIllustration />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pr-6">Signal</th>
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pr-6">Range</th>
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {THRESHOLDS.map((row) => (
                <tr key={row.signal}>
                  <td className="py-3.5 pr-6 font-medium text-neutral-800 whitespace-nowrap">{row.signal}</td>
                  <td className="py-3.5 pr-6 font-mono text-xs text-neutral-500 whitespace-nowrap">{row.range}</td>
                  <td className="py-3.5 text-neutral-500">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forecasting */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-4">
        <SectionHeading>How forecasts are generated</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Forecasts follow a three-step process:
        </p>
        <ol className="flex flex-col gap-3 ml-4">
          <li className="text-sm text-neutral-600 leading-relaxed">
            <strong className="font-semibold text-neutral-800">1. Historical trend extraction.</strong>{" "}
            The Compound Annual Growth Rate (CAGR) is computed separately for vacancy demand
            and graduate supply, using the available historical years.
          </li>
          <li className="text-sm text-neutral-600 leading-relaxed">
            <strong className="font-semibold text-neutral-800">2. Projection.</strong>{" "}
            Each component is independently extrapolated forward using the observed CAGR.
            The projected vacancy ratio is then derived from the two projected series.
          </li>
          <li className="text-sm text-neutral-600 leading-relaxed">
            <strong className="font-semibold text-neutral-800">3. Outlook labelling.</strong>{" "}
            If the projected ratio improves by more than 8% relative to its starting value,
            the outlook is labelled <em>Growing</em>. If it declines by more than 8%, it is
            labelled <em>Declining</em>. Otherwise it is <em>Stable</em>.
          </li>
        </ol>
        <div className="mt-1">
          <ForecastIllustration />
        </div>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Confidence is capped at <em>Medium</em> when demo data is in use, because the
          underlying figures have not been externally validated.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Projected data is always visually distinguished from historical data — dashed lines,
          lighter colours, and explicit &quot;Projected&quot; labels.
        </p>
      </div>

      {/* AI usage */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-4">
        <SectionHeading>How AI is used</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          When an <code className="rounded bg-neutral-100 px-1 font-mono text-xs text-neutral-700">ANTHROPIC_API_KEY</code>{" "}
          is set, the &quot;What This Means&quot; market summary is generated by Claude (claude-haiku).
          The model receives structured, pre-computed data — vacancy ratio, signal label,
          CAGR figures, outlook label, top skills — and is asked to write a 2–3 sentence
          summary grounded only in those numbers.
        </p>
        <div className="mt-1">
          <AIInsightIllustration />
        </div>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The AI is explicitly instructed not to invent statistics, companies, salaries,
          or trends not present in the supplied data. If data is insufficient, it is
          instructed to say so.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          When no API key is set, a static template-based summary is shown instead.
          The UI labels AI-generated summaries clearly with an <em>AI</em> badge.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          AI is not used to generate vacancy counts, graduate counts, ratios, signals,
          forecasts, or skill frequencies. Those are all computed from data.
        </p>
      </div>

      {/* Geographic comparisons */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-3">
        <SectionHeading>Limitations of geographic comparisons</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          The location comparison feature shows estimated vacancy concentrations across
          cities. These distributions are illustrative — they are not drawn from city-level
          vacancy surveys. They represent plausible shares based on known economic geography,
          but they should be treated as indicative, not authoritative.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          When a city is selected in the Explore view, the graduate count remains national
          (since city-level graduate data is not available) while the vacancy count is
          estimated at city level. The resulting ratio is therefore not directly comparable
          to a national ratio and is labelled accordingly.
        </p>
        <div className="mt-2">
          <GeographicPinDiagram />
        </div>
      </div>

      {/* Data sources */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-5">
        <div>
          <SectionHeading>Planned graduate data sources</SectionHeading>
          <p className="mt-2 text-sm text-neutral-500">
            These are the intended sources for graduate data when live integration is enabled.
          </p>
        </div>
        <div className="flex flex-col gap-0 divide-y divide-neutral-100">
          {SOURCES.map((s) => (
            <div key={s.country} className="py-4 grid grid-cols-3 gap-4">
              <p className="text-sm font-medium text-neutral-800">{s.country}</p>
              <div className="text-xs text-neutral-500 col-span-2">
                <p className="mb-1"><span className="font-medium text-neutral-600">Graduates:</span> {s.graduates}</p>
                <p><span className="font-medium text-neutral-600">Vacancies:</span> {s.vacancies}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API integrations */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-5">
        <div>
          <SectionHeading>Vacancy data providers</SectionHeading>
          <p className="mt-2 text-sm text-neutral-500">
            The provider architecture allows live APIs to be connected without changing any UI
            or calculation code. Only{" "}
            <code className="rounded bg-neutral-100 px-1 font-mono text-xs text-neutral-700">
              lib/providers/
            </code>{" "}
            needs to be updated.
          </p>
        </div>
        <div className="flex flex-col gap-0 divide-y divide-neutral-100">
          {VACANCY_PROVIDERS.map((p) => (
            <div key={p.name} className="py-4">
              <div className="flex items-baseline gap-3 mb-1">
                <p className="text-sm font-semibold text-neutral-800">{p.name}</p>
                <span className="text-[10px] text-neutral-400 font-mono">{p.type}</span>
              </div>
              <p className="text-xs text-neutral-500 mb-1">{p.coverage}</p>
              <p className="text-xs text-neutral-400 font-mono">{p.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Caveats */}
      <div className="py-10 flex flex-col gap-5">
        <SectionHeading>Limitations</SectionHeading>
        <ul className="flex flex-col gap-4">
          {CAVEATS.map((c, i) => (
            <li key={i} className="flex gap-3 text-sm text-neutral-600">
              <span className="text-neutral-300 flex-shrink-0 select-none">—</span>
              <span className="leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
    </div>
    </div>
    </div>
  );
}
