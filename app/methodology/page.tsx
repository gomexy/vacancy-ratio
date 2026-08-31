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

// ── Inline SVG illustrations ──────────────────────────────────────────────────

function VacancyPipelineDiagram() {
  return (
    <svg width="220" height="48" viewBox="0 0 220 48" fill="none" aria-hidden="true">
      <rect x="0" y="14" width="56" height="20" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <text x="28" y="27" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">API / survey</text>
      <line x1="56" y1="24" x2="74" y2="24" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="70,20 74,24 70,28" stroke="#d4d4d4" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <rect x="74" y="14" width="64" height="20" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <text x="106" y="27" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">tag + dedupe</text>
      <line x1="138" y1="24" x2="156" y2="24" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="152,20 156,24 152,28" stroke="#d4d4d4" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <rect x="156" y="14" width="64" height="20" rx="3" stroke="#F5C518" strokeWidth="1.5"/>
      <text x="188" y="27" textAnchor="middle" fontSize="7" fill="#92600A" fontFamily="monospace">vacancy count</text>
    </svg>
  );
}

function GraduateBarDiagram() {
  return (
    <svg width="160" height="56" viewBox="0 0 160 56" fill="none" aria-hidden="true">
      <line x1="16" y1="4" x2="16" y2="44" stroke="#e5e5e5" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="44" x2="152" y2="44" stroke="#e5e5e5" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="24" y="28" width="14" height="16" rx="1" stroke="#d4d4d4" strokeWidth="1"/>
      <rect x="46" y="22" width="14" height="22" rx="1" stroke="#d4d4d4" strokeWidth="1"/>
      <rect x="68" y="18" width="14" height="26" rx="1" stroke="#d4d4d4" strokeWidth="1"/>
      <rect x="90" y="14" width="14" height="30" rx="1" stroke="#d4d4d4" strokeWidth="1"/>
      <rect x="112" y="16" width="14" height="28" rx="1" stroke="#F5C518" strokeWidth="1.5"/>
      <text x="31" y="53" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">20</text>
      <text x="53" y="53" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">21</text>
      <text x="75" y="53" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">22</text>
      <text x="97" y="53" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">23</text>
      <text x="119" y="53" textAnchor="middle" fontSize="6" fill="#92600A" fontFamily="monospace">24</text>
    </svg>
  );
}

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

function BalanceScaleDiagram() {
  return (
    <svg width="220" height="88" viewBox="0 0 220 88" fill="none" aria-hidden="true">
      {/* Stand */}
      <line x1="110" y1="74" x2="110" y2="50" stroke="#e5e5e5" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="88" y1="74" x2="132" y2="74" stroke="#e5e5e5" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="110" cy="50" r="2.5" fill="#e5e5e5"/>
      {/* Beam tilted — graduates side down, vacancies side up */}
      <line x1="26" y1="56" x2="194" y2="44" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Left pan (graduates) */}
      <line x1="26" y1="56" x2="26" y2="68" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <line x1="10" y1="68" x2="42" y2="68" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="19" cy="64" r="4.5" stroke="#d4d4d4" strokeWidth="1"/>
      <circle cx="33" cy="64" r="4.5" stroke="#d4d4d4" strokeWidth="1"/>
      <text x="26" y="82" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="sans-serif">graduates</text>
      {/* Right pan (vacancies) — higher, yellow */}
      <line x1="194" y1="44" x2="194" y2="56" stroke="#F5C518" strokeWidth="1" strokeLinecap="round"/>
      <line x1="178" y1="56" x2="210" y2="56" stroke="#F5C518" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="183" cy="52" r="4" stroke="#F5C518" strokeWidth="1.5"/>
      <circle cx="194" cy="52" r="4" stroke="#F5C518" strokeWidth="1.5"/>
      <circle cx="205" cy="52" r="4" stroke="#F5C518" strokeWidth="1.5"/>
      <text x="194" y="82" textAnchor="middle" fontSize="7" fill="#92600A" fontFamily="sans-serif">vacancies</text>
      {/* Ratio = label */}
      <text x="110" y="40" textAnchor="middle" fontSize="8" fill="#d4d4d4" fontFamily="monospace">ratio</text>
      <line x1="110" y1="42" x2="110" y2="49" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 1.5"/>
    </svg>
  );
}

function ThresholdSpectrumDiagram() {
  return (
    <svg width="100%" height="48" viewBox="0 0 280 48" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      {/* Track */}
      <line x1="8" y1="22" x2="272" y2="22" stroke="#e5e5e5" strokeWidth="1.5" strokeLinecap="round"/>
      {/* End arrow */}
      <polyline points="268,18 272,22 268,26" stroke="#e5e5e5" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Ticks: 0 */}
      <line x1="8" y1="15" x2="8" y2="29" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="8" y="42" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">0</text>
      {/* 0.50 */}
      <line x1="72" y1="17" x2="72" y2="27" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <text x="72" y="42" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">0.5</text>
      {/* 0.75 */}
      <line x1="108" y1="17" x2="108" y2="27" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <text x="108" y="42" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">0.75</text>
      {/* 1.0 — key threshold, yellow */}
      <line x1="152" y1="12" x2="152" y2="32" stroke="#F5C518" strokeWidth="2" strokeLinecap="round"/>
      <text x="152" y="42" textAnchor="middle" fontSize="7" fill="#92600A" fontFamily="monospace">1.0</text>
      {/* 2.0 */}
      <line x1="248" y1="17" x2="248" y2="27" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <text x="248" y="42" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">2.0+</text>
      {/* Zone labels above */}
      <text x="40" y="10" textAnchor="middle" fontSize="6.5" fill="#d4d4d4" fontFamily="monospace">surplus</text>
      <text x="130" y="10" textAnchor="middle" fontSize="6.5" fill="#d4d4d4" fontFamily="monospace">balanced</text>
      <text x="210" y="10" textAnchor="middle" fontSize="6.5" fill="#92600A" fontFamily="monospace">demand ↑</text>
    </svg>
  );
}

function ForecastTimelineDiagram() {
  return (
    <svg width="220" height="68" viewBox="0 0 220 68" fill="none" aria-hidden="true">
      {/* Axes */}
      <line x1="16" y1="8" x2="16" y2="52" stroke="#e5e5e5" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="52" x2="212" y2="52" stroke="#e5e5e5" strokeWidth="1.5" strokeLinecap="round"/>
      {/* 1:1 reference line */}
      <line x1="16" y1="40" x2="212" y2="40" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="3 3"/>
      <text x="12" y="43" textAnchor="end" fontSize="6" fill="#e5e5e5" fontFamily="monospace">1.0</text>
      {/* Historical line (yellow, solid) */}
      <polyline points="24,46 52,40 80,36 108,32 124,30" stroke="#F5C518" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="24" cy="46" r="2.5" stroke="#F5C518" strokeWidth="1.5"/>
      <circle cx="52" cy="40" r="2.5" stroke="#F5C518" strokeWidth="1.5"/>
      <circle cx="80" cy="36" r="2.5" stroke="#F5C518" strokeWidth="1.5"/>
      <circle cx="108" cy="32" r="2.5" stroke="#F5C518" strokeWidth="1.5"/>
      <circle cx="124" cy="30" r="2.5" stroke="#F5C518" strokeWidth="1.5"/>
      {/* Forecast boundary */}
      <line x1="124" y1="8" x2="124" y2="52" stroke="#e5e5e5" strokeWidth="1" strokeDasharray="3 2" strokeLinecap="round"/>
      {/* Projected line (grey, dashed) */}
      <polyline points="124,30 152,26 180,22 208,18" stroke="#d4d4d4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3"/>
      {/* Labels */}
      <text x="70" y="63" textAnchor="middle" fontSize="6" fill="#9ca3af" fontFamily="monospace">observed</text>
      <text x="168" y="63" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">projected</text>
    </svg>
  );
}

function AiFlowDiagram() {
  return (
    <svg width="220" height="44" viewBox="0 0 220 44" fill="none" aria-hidden="true">
      <rect x="0" y="12" width="56" height="20" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <text x="28" y="24" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">computed</text>
      <text x="28" y="33" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">data</text>
      <line x1="56" y1="22" x2="74" y2="22" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="70,18 74,22 70,26" stroke="#d4d4d4" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <rect x="74" y="12" width="72" height="20" rx="3" stroke="#F5C518" strokeWidth="1.5"/>
      <text x="110" y="25" textAnchor="middle" fontSize="7" fill="#92600A" fontFamily="monospace">Claude (AI model)</text>
      <line x1="146" y1="22" x2="164" y2="22" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="160,18 164,22 160,26" stroke="#d4d4d4" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <rect x="164" y="12" width="56" height="20" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <text x="192" y="24" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">market</text>
      <text x="192" y="33" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">summary</text>
    </svg>
  );
}

function GeographicPinDiagram() {
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" fill="none" aria-hidden="true">
      {/* Country outline */}
      <rect x="4" y="4" width="132" height="72" rx="5" stroke="#e5e5e5" strokeWidth="1" strokeDasharray="5 3"/>
      {/* Main city pin (yellow - strongest hub) */}
      <circle cx="42" cy="32" r="7" stroke="#F5C518" strokeWidth="1.5"/>
      <line x1="42" y1="39" x2="42" y2="50" stroke="#F5C518" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Ripple */}
      <circle cx="42" cy="32" r="14" stroke="#F5C518" strokeWidth="0.75" strokeDasharray="2 3" strokeOpacity="0.5"/>
      {/* Secondary pins */}
      <circle cx="88" cy="44" r="4.5" stroke="#d4d4d4" strokeWidth="1"/>
      <line x1="88" y1="48" x2="88" y2="56" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="112" cy="26" r="3" stroke="#d4d4d4" strokeWidth="1"/>
      <line x1="112" y1="29" x2="112" y2="36" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="68" cy="60" r="2.5" stroke="#d4d4d4" strokeWidth="1"/>
      <line x1="68" y1="62" x2="68" y2="68" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      {/* National label */}
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
          <VacancyPipelineDiagram />
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
          <GraduateBarDiagram />
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
          <BalanceScaleDiagram />
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
          <ThresholdSpectrumDiagram />
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
          <ForecastTimelineDiagram />
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
          <AiFlowDiagram />
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
