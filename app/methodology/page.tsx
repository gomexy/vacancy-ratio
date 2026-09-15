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

// ── Icon SVGs (outline, 18×18, strokeWidth 1.5) ───────────────────────────────

function IconBriefcase() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="14" height="10" rx="2"/>
      <path d="M6 6V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/>
      <line x1="2" y1="11" x2="16" y2="11"/>
    </svg>
  );
}

function IconSchool() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="9,2 17,7 9,12 1,7"/>
      <path d="M5 9.5v4c0 1.1 1.8 2 4 2s4-.9 4-2v-4"/>
      <line x1="15" y1="7" x2="15" y2="13"/>
    </svg>
  );
}

function IconCategory() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="6" height="6" rx="1.5"/>
      <rect x="10" y="2" width="6" height="6" rx="1.5"/>
      <rect x="2" y="10" width="6" height="6" rx="1.5"/>
      <rect x="10" y="10" width="6" height="6" rx="1.5"/>
    </svg>
  );
}

function IconCopyOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="6" width="9" height="9" rx="1.5"/>
      <path d="M12 6V4.5A1.5 1.5 0 0 0 10.5 3H4.5A1.5 1.5 0 0 0 3 4.5v6A1.5 1.5 0 0 0 4.5 12H6"/>
      <line x1="2" y1="2" x2="16" y2="16"/>
    </svg>
  );
}

function IconMathFunction() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* f */}
      <path d="M4 9h5M7 4.5c0-1 .7-1.5 1.5-1.5H10a1 1 0 0 1 1 1v10"/>
      {/* x */}
      <line x1="13" y1="11" x2="17" y2="15"/>
      <line x1="17" y1="11" x2="13" y2="15"/>
    </svg>
  );
}

// ── Chip component ────────────────────────────────────────────────────────────

function Chip({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono ${className}`}>
      {label}
    </span>
  );
}

// ── Illustrations for lower sections ─────────────────────────────────────────

function MarketSpectrumIllustration() {
  return (
    <svg width="100%" height="64" viewBox="0 0 280 64" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <rect x="8"   y="18" width="42" height="18" fill="#f3f4f6"/>
      <rect x="50"  y="18" width="38" height="18" fill="#f5f5f5"/>
      <rect x="88"  y="18" width="40" height="18" fill="#fefce8"/>
      <rect x="128" y="18" width="56" height="18" fill="#fffbeb"/>
      <rect x="184" y="18" width="88" height="18" fill="#FFF3CD"/>
      <rect x="8" y="18" width="264" height="18" rx="2" stroke="#e5e5e5" strokeWidth="1" fill="none"/>
      <line x1="50"  y1="18" x2="50"  y2="36" stroke="#e5e5e5" strokeWidth="1"/>
      <line x1="88"  y1="18" x2="88"  y2="36" stroke="#e5e5e5" strokeWidth="1"/>
      <line x1="128" y1="14" x2="128" y2="40" stroke="#F5C518" strokeWidth="1.5"/>
      <line x1="184" y1="18" x2="184" y2="36" stroke="#e5e5e5" strokeWidth="1"/>
      <text x="29"  y="12" textAnchor="middle" fontSize="5.5" fill="#c4c4c4" fontFamily="monospace">Sig. Surplus</text>
      <text x="69"  y="12" textAnchor="middle" fontSize="5.5" fill="#d4d4d4" fontFamily="monospace">Surplus</text>
      <text x="108" y="12" textAnchor="middle" fontSize="5.5" fill="#d4d4d4" fontFamily="monospace">Balanced</text>
      <text x="156" y="12" textAnchor="middle" fontSize="5.5" fill="#92600A" fontFamily="monospace">Strong Demand</text>
      <text x="216" y="12" textAnchor="middle" fontSize="5.5" fill="#92600A" fontFamily="monospace">Critical Shortage</text>
      <text x="8"   y="48" fontSize="6" fill="#d4d4d4" fontFamily="monospace">0</text>
      <text x="50"  y="48" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">0.5</text>
      <text x="88"  y="48" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">0.75</text>
      <text x="128" y="48" textAnchor="middle" fontSize="6" fill="#92600A" fontFamily="monospace">1.0</text>
      <text x="184" y="48" textAnchor="middle" fontSize="6" fill="#9ca3af" fontFamily="monospace">2.0+</text>
      <polygon points="152,18 156,22 152,26 148,22" fill="#F5C518" opacity="0.85"/>
      <text x="152" y="58" textAnchor="middle" fontSize="5.5" fill="#92600A" fontFamily="monospace">1.21 →</text>
    </svg>
  );
}

function ForecastIllustration() {
  const hist: [number, number][] = [[24, 48], [52, 42], [80, 37], [108, 32], [124, 28]];
  const proj: [number, number][] = [[124, 28], [152, 24], [180, 20], [208, 16]];
  const histPts = hist.map(([x, y]) => `${x},${y}`).join(" ");
  const projPts = proj.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <svg width="240" height="80" viewBox="0 0 240 80" fill="none" aria-hidden="true">
      <line x1="16" y1="8"  x2="16"  y2="60" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="60" x2="220" y2="60" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="44" x2="220" y2="44" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="3 3"/>
      <text x="13" y="47" textAnchor="end" fontSize="6" fill="#e5e5e5" fontFamily="monospace">1.0</text>
      <line x1="124" y1="8" x2="124" y2="60" stroke="#e8e8e8" strokeWidth="1" strokeDasharray="3 2" strokeLinecap="round"/>
      <polyline points={histPts} stroke="#F5C518" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {hist.map(([cx, cy], i) => (
        <circle key={`h${i}`} cx={cx} cy={cy} r="2.5" fill="#F5C518"/>
      ))}
      <polyline points={projPts} stroke="#d4d4d4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3"/>
      {proj.slice(1).map(([cx, cy], i) => (
        <circle key={`p${i}`} cx={cx} cy={cy} r="2.5" stroke="#d4d4d4" strokeWidth="1.5" fill="white"/>
      ))}
      <text x="68"  y="74" textAnchor="middle" fontSize="6" fill="#9ca3af" fontFamily="monospace">observed</text>
      <text x="168" y="74" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">projected</text>
    </svg>
  );
}

function AIInsightIllustration() {
  return (
    <svg width="240" height="56" viewBox="0 0 240 56" fill="none" aria-hidden="true">
      <rect x="0" y="10" width="68" height="36" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <line x1="0"  y1="22" x2="68" y2="22" stroke="#f0f0f0" strokeWidth="0.75"/>
      <line x1="0"  y1="32" x2="68" y2="32" stroke="#f0f0f0" strokeWidth="0.75"/>
      <line x1="22" y1="10" x2="22" y2="46" stroke="#f0f0f0" strokeWidth="0.75"/>
      <text x="34" y="25.5" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">computed</text>
      <text x="34" y="35.5" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">data</text>
      <line x1="68" y1="28" x2="88" y2="28" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="84,24 88,28 84,32" stroke="#d4d4d4" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <rect x="88" y="10" width="68" height="36" rx="3" stroke="#F5C518" strokeWidth="1.5"/>
      <text x="122" y="27" textAnchor="middle" fontSize="7" fill="#92600A" fontFamily="monospace">Claude</text>
      <text x="122" y="38" textAnchor="middle" fontSize="6" fill="#9ca3af" fontFamily="monospace">interprets</text>
      <line x1="156" y1="28" x2="176" y2="28" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="172,24 176,28 172,32" stroke="#d4d4d4" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <rect x="176" y="10" width="64" height="36" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <line x1="184" y1="21" x2="232" y2="21" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="184" y1="29" x2="228" y2="29" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="184" y1="37" x2="220" y2="37" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="34"  y="54" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">structured input</text>
      <text x="122" y="54" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">AI model</text>
      <text x="208" y="54" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">market summary</text>
    </svg>
  );
}

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

// ── Field mapping + dedup (unchanged, still good) ─────────────────────────────

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

      {/* ── Data collection card grid ──────────────────────────────────────── */}
      <div className="py-10 border-b border-neutral-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* 1. Vacancy data — blue */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-50 text-blue-600">
                <IconBriefcase />
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                Vacancy Data
              </span>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Sourced from job posting APIs and official labour surveys, tagged by field,
              location, skills, and date. Deduped by title, company, and city.
            </p>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
              <Chip label="field + location key" className="bg-blue-50 text-blue-700"/>
              <Chip label="national-level" className="bg-neutral-100 text-neutral-600"/>
            </div>
          </div>

          {/* 2. Graduate data — green */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-50 text-green-600">
                <IconSchool />
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                Graduate Data
              </span>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Completions per field per year from national education bodies. Excludes
              enrolments, dropouts, and late-year graduates. Always national — city
              vacancy is estimated.
            </p>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
              <Chip label="completions / yr" className="bg-green-50 text-green-700"/>
              <Chip label="UG + PG" className="bg-neutral-100 text-neutral-600"/>
            </div>
          </div>

          {/* 3. Field mapping — amber */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-50 text-amber-600">
                <IconCategory />
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                Field Mapping
              </span>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Graduates follow ISCED categories. Vacancies (ISCO, SOC, Adzuna) are mapped
              to 8 harmonised field slugs. Boundary assignments are approximate.
            </p>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
              <Chip label="8 field slugs" className="bg-amber-50 text-amber-700"/>
              <Chip label="ISCED aligned" className="bg-neutral-100 text-neutral-600"/>
            </div>
          </div>

          {/* 4. Deduplication — red */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50 text-red-500">
                <IconCopyOff />
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                Deduplication
              </span>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Same vacancy from multiple providers is collapsed using a compound key of
              normalised title, company, and city. Only one record counted. Demo data is
              not deduped.
            </p>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
              <Chip label="title · company · city" className="bg-red-50 text-red-600"/>
            </div>
          </div>

          {/* 5. The formula — violet, full width */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col gap-4 sm:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-violet-50 text-violet-600">
                <IconMathFunction />
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                The Formula
              </span>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Both metrics are derived at query time — never stored. This ensures
              auditability and consistency across views.
            </p>
            {/* Code + legend side by side */}
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              <div
                className="rounded-md px-5 py-4 font-mono text-sm flex-1 w-full"
                style={{ background: "#1a1a2e" }}
              >
                <p className="text-neutral-500 text-xs mb-2">// Primary metric</p>
                <p>
                  <span className="text-emerald-400">vacancyRatio</span>
                  <span className="text-neutral-400"> = </span>
                  <span className="text-emerald-400">relevantVacancies</span>
                  <span className="text-neutral-400"> / </span>
                  <span className="text-emerald-400">graduates</span>
                </p>
                <p className="text-neutral-500 text-xs mt-3 mb-2">// Normalised</p>
                <p>
                  <span className="text-emerald-400">vacanciesPer100Graduates</span>
                  <span className="text-neutral-400"> = vacancyRatio × </span>
                  <span className="text-neutral-300">100</span>
                </p>
              </div>
              <div className="flex flex-col gap-2.5 lg:py-1 lg:min-w-[220px]">
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"/>
                  <span className="text-xs text-neutral-500 leading-relaxed">
                    Above 1.0 → more vacancies than graduates
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-rose-400 flex-shrink-0"/>
                  <span className="text-xs text-neutral-500 leading-relaxed">
                    Below 1.0 → more graduates than vacancies
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                  Supply-demand signal, not individual job probability.
                </p>
              </div>
            </div>
          </div>

        </div>
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
