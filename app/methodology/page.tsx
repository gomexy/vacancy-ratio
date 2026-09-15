import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How VacancyRatio collects vacancy and graduate data, categorises fields, calculates the ratio, generates forecasts, and uses AI — including limitations and what is currently demo data.",
};

const SOURCES = [
  {
    country: "🇮🇳 India",
    graduates: "AICTE Annual Report; UGC Annual Report; Indian Nursing Council",
    vacancies:  "Ministry of Labour & Employment Vacancy Survey; NASSCOM Jobs Reports; RBI Employment Survey",
  },
  {
    country: "🇺🇸 United States",
    graduates: "National Center for Education Statistics (NCES); HRSA",
    vacancies:  "Bureau of Labor Statistics JOLTS",
  },
  {
    country: "🇬🇧 United Kingdom",
    graduates: "Higher Education Statistics Agency (HESA); Nursing & Midwifery Council (NMC)",
    vacancies:  "ONS Vacancy Survey; NHS Digital",
  },
  {
    country: "🇩🇪 Germany",
    graduates: "Destatis (Federal Statistical Office)",
    vacancies:  "Bundesagentur für Arbeit",
  },
  {
    country: "🇦🇺 Australia",
    graduates: "Department of Education, Skills and Employment (DESE); AHPRA",
    vacancies:  "Jobs and Skills Australia",
  },
];

const VACANCY_PROVIDERS = [
  {
    name: "Adzuna",
    type: "Job listings API",
    coverage: "US, GB, AU, DE, IN and many others. Real-time job postings, salary data, category-level aggregates.",
    status: "Supported",
  },
  {
    name: "BLS JOLTS",
    type: "Official labour survey",
    coverage: "US monthly job openings by industry and occupation. Highly authoritative but not real-time.",
    status: "Planned",
  },
  {
    name: "UNESCO UIS API",
    type: "Graduate data",
    coverage: "Global graduation completions, 200+ countries, ISCED classification.",
    status: "Planned",
  },
  {
    name: "Eurostat API",
    type: "Graduate + vacancy data",
    coverage: "EU graduation and employment data, harmonised across member states.",
    status: "Planned",
  },
  {
    name: "OECD Stats API",
    type: "Cross-country employment",
    coverage: "Employment and labour market data across OECD members.",
    status: "Planned",
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
];

// ── Shared primitives ─────────────────────────────────────────────────────────

function Badge({ icon, bg, color }: { icon: string; bg: string; color: string }) {
  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 rounded-lg ${bg} ${color}`}
      style={{ width: 36, height: 36 }}
    >
      <i className={`ti ti-${icon}`} style={{ fontSize: 18 }} />
    </div>
  );
}

function CardTitle({ icon, bg, color, children }: { icon: string; bg: string; color: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Badge icon={icon} bg={bg} color={color} />
      <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-neutral-500">
        {children}
      </span>
    </div>
  );
}

function Chip({ label, bg, text }: { label: string; bg: string; text: string }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[11px] ${bg} ${text}`}>
      {label}
    </span>
  );
}

// ── SVG illustrations ─────────────────────────────────────────────────────────

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
    </svg>
  );
}

function ForecastIllustration() {
  const hist: [number, number][] = [[24, 48], [52, 42], [80, 37], [108, 32], [124, 28]];
  const proj: [number, number][] = [[124, 28], [152, 24], [180, 20], [208, 16]];
  return (
    <svg width="240" height="80" viewBox="0 0 240 80" fill="none" aria-hidden="true">
      <line x1="16" y1="8"  x2="16"  y2="60" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="60" x2="220" y2="60" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="44" x2="220" y2="44" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="3 3"/>
      <text x="13" y="47" textAnchor="end" fontSize="6" fill="#e5e5e5" fontFamily="monospace">1.0</text>
      <line x1="124" y1="8" x2="124" y2="60" stroke="#e8e8e8" strokeWidth="1" strokeDasharray="3 2" strokeLinecap="round"/>
      <polyline points={hist.map(([x,y])=>`${x},${y}`).join(" ")} stroke="#F5C518" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {hist.map(([cx,cy],i)=><circle key={`h${i}`} cx={cx} cy={cy} r="2.5" fill="#F5C518"/>)}
      <polyline points={proj.map(([x,y])=>`${x},${y}`).join(" ")} stroke="#d4d4d4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3"/>
      {proj.slice(1).map(([cx,cy],i)=><circle key={`p${i}`} cx={cx} cy={cy} r="2.5" stroke="#d4d4d4" strokeWidth="1.5" fill="white"/>)}
      <text x="68"  y="74" textAnchor="middle" fontSize="6" fill="#9ca3af" fontFamily="monospace">observed</text>
      <text x="168" y="74" textAnchor="middle" fontSize="6" fill="#d4d4d4" fontFamily="monospace">projected</text>
    </svg>
  );
}

function AIFlowDiagram() {
  return (
    <svg width="100%" height="56" viewBox="0 0 240 56" fill="none" aria-hidden="true" preserveAspectRatio="xMinYMid meet">
      <rect x="0" y="10" width="68" height="36" rx="3" stroke="#d4d4d4" strokeWidth="1.5"/>
      <line x1="0"  y1="22" x2="68" y2="22" stroke="#f0f0f0" strokeWidth="0.75"/>
      <line x1="0"  y1="32" x2="68" y2="32" stroke="#f0f0f0" strokeWidth="0.75"/>
      <line x1="22" y1="10" x2="22" y2="46" stroke="#f0f0f0" strokeWidth="0.75"/>
      <text x="34" y="25.5" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">computed</text>
      <text x="34" y="35.5" textAnchor="middle" fontSize="6.5" fill="#9ca3af" fontFamily="monospace">data</text>
      <line x1="68" y1="28" x2="88" y2="28" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round"/>
      <polyline points="84,24 88,28 84,32" stroke="#d4d4d4" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <rect x="88" y="10" width="68" height="36" rx="3" stroke="#a78bfa" strokeWidth="1.5"/>
      <text x="122" y="27" textAnchor="middle" fontSize="7" fill="#7c3aed" fontFamily="monospace">Claude</text>
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

// ── Shared card shell ─────────────────────────────────────────────────────────

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white px-6 py-6 flex flex-col gap-5 ${className}`}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MethodologyPage() {
  return (
    <div style={{ background: "#F0F0F0" }} className="min-h-screen">
    <div className="mx-auto max-w-5xl px-4 sm:px-8 py-8 flex flex-col gap-4">

      {/* ── Header card ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-8 sm:px-12 py-10 flex flex-col gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
            Methodology
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl mb-3">
            How the data works
          </h1>
          <p className="text-base text-neutral-500 leading-relaxed max-w-2xl">
            VacancyRatio uses a single computed metric to compare graduate supply with job
            vacancy demand. This page explains what the numbers mean, how they are collected,
            how forecasts are generated, how AI is used, and the important limits of this approach.
          </p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <i className="ti ti-info-circle text-amber-500 flex-shrink-0 mt-0.5" style={{ fontSize: 16 }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">
                Demo data
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                All figures shown are illustrative demo data. Realistic in magnitude but not
                sourced from live APIs. When connected to a live provider (e.g. Adzuna), a{" "}
                <span className="font-semibold">Live · API</span> badge will replace{" "}
                <span className="font-semibold">Demo data</span> throughout the product.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Data collection card grid ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 flex flex-col gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 px-1">
          Data collection
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Vacancy Data */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col gap-4">
            <CardTitle icon="briefcase" bg="bg-blue-50" color="text-blue-600">Vacancy Data</CardTitle>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Sourced from job posting APIs and official labour surveys, tagged by field,
              location, skills, and date. Deduped by title, company, and city.
            </p>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
              <Chip label="field + location key" bg="bg-blue-50"    text="text-blue-700"/>
              <Chip label="national-level"       bg="bg-neutral-100" text="text-neutral-600"/>
            </div>
          </div>

          {/* Graduate Data */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col gap-4">
            <CardTitle icon="school" bg="bg-green-50" color="text-green-600">Graduate Data</CardTitle>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Completions per field per year from national education bodies. Excludes
              enrolments, dropouts, and late-year graduates. Always national — city
              vacancy is estimated.
            </p>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
              <Chip label="completions / yr" bg="bg-green-50"    text="text-green-700"/>
              <Chip label="UG + PG"          bg="bg-neutral-100" text="text-neutral-600"/>
            </div>
          </div>

          {/* Field Mapping */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col gap-4">
            <CardTitle icon="category" bg="bg-amber-50" color="text-amber-600">Field Mapping</CardTitle>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Graduates follow ISCED categories. Vacancies (ISCO, SOC, Adzuna) are mapped
              to 8 harmonised field slugs. Boundary assignments are approximate.
            </p>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
              <Chip label="8 field slugs"  bg="bg-amber-50"    text="text-amber-700"/>
              <Chip label="ISCED aligned"  bg="bg-neutral-100" text="text-neutral-600"/>
            </div>
          </div>

          {/* Deduplication */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col gap-4">
            <CardTitle icon="copy-off" bg="bg-red-50" color="text-red-500">Deduplication</CardTitle>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Same vacancy from multiple providers is collapsed using a compound key of
              normalised title, company, and city. Only one record counted. Demo data is
              not deduped.
            </p>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
              <Chip label="title · company · city" bg="bg-red-50" text="text-red-600"/>
            </div>
          </div>

          {/* The Formula — full width */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col gap-4 sm:col-span-2">
            <CardTitle icon="math-function" bg="bg-violet-50" color="text-violet-600">The Formula</CardTitle>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Both metrics are derived at query time — never stored. Ensures auditability
              and consistency across views.
            </p>
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              <div className="rounded-lg px-5 py-4 font-mono text-[13px] flex-1 w-full" style={{ background: "#1a1a2e" }}>
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
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"/>
                  <span className="text-[13px] text-neutral-500 leading-relaxed">Above 1.0 → more vacancies than graduates</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-rose-400 flex-shrink-0"/>
                  <span className="text-[13px] text-neutral-500 leading-relaxed">Below 1.0 → more graduates than vacancies</span>
                </div>
                <p className="text-[12px] text-neutral-400 mt-1 leading-relaxed">
                  Supply-demand signal, not individual job probability.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Interpretation thresholds ─────────────────────────────────────────── */}
      <SectionCard>
        <CardTitle icon="adjustments-horizontal" bg="bg-neutral-100" color="text-neutral-500">
          Interpretation Thresholds
        </CardTitle>
        <p className="text-sm text-neutral-600">
          Ratios are mapped to five named signals. These thresholds are editorial
          judgements, not regulatory definitions.
        </p>
        <MarketSpectrumIllustration />
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
      </SectionCard>

      {/* ── Forecasts ─────────────────────────────────────────────────────────── */}
      <SectionCard>
        <CardTitle icon="trending-up" bg="bg-blue-50" color="text-blue-600">
          How Forecasts Are Generated
        </CardTitle>
        <div className="flex flex-col gap-4">
          {[
            { n: "1", title: "Historical trend extraction.", body: "The Compound Annual Growth Rate (CAGR) is computed separately for vacancy demand and graduate supply, using the available historical years." },
            { n: "2", title: "Projection.", body: "Each component is independently extrapolated forward using the observed CAGR. The projected vacancy ratio is then derived from the two projected series." },
            { n: "3", title: "Outlook labelling.", body: "If the projected ratio improves by more than 8% relative to its starting value, the outlook is labelled Growing. If it declines by more than 8%, it is labelled Declining. Otherwise it is Stable." },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-3 items-start">
              <span className="flex-shrink-0 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 font-semibold" style={{ width: 20, height: 20, fontSize: 11 }}>
                {n}
              </span>
              <p className="text-sm text-neutral-600 leading-relaxed">
                <strong className="font-semibold text-neutral-800">{title}</strong>{" "}{body}
              </p>
            </div>
          ))}
        </div>
        <ForecastIllustration />
        <p className="text-sm text-neutral-500 leading-relaxed">
          Confidence is capped at <em>Medium</em> when demo data is in use. Projected data
          is always visually distinguished — dashed lines, lighter colours, and explicit
          &quot;Projected&quot; labels.
        </p>
      </SectionCard>

      {/* ── AI ────────────────────────────────────────────────────────────────── */}
      <SectionCard>
        <CardTitle icon="sparkles" bg="bg-violet-50" color="text-violet-600">
          How AI Is Used
        </CardTitle>
        <p className="text-sm text-neutral-600 leading-relaxed">
          When an{" "}
          <code className="rounded bg-neutral-100 px-1 font-mono text-xs text-neutral-700">ANTHROPIC_API_KEY</code>{" "}
          is set, the &quot;What This Means&quot; market summary is generated by Claude (claude-haiku).
          The model receives structured, pre-computed data — vacancy ratio, signal label,
          CAGR figures, outlook label, top skills — and writes a 2–3 sentence summary
          grounded only in those numbers.
        </p>
        <AIFlowDiagram />
        <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-4 flex flex-col gap-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            AI does not generate
          </p>
          {[
            "Vacancy counts, graduate counts, ratios, or signals",
            "Forecasts or skill frequencies — those are all computed from data",
            "Statistics, companies, salaries, or trends not present in the supplied data",
          ].map((item) => (
            <div key={item} className="flex gap-2.5 items-start">
              <i className="ti ti-x flex-shrink-0 text-red-400 mt-0.5" style={{ fontSize: 13 }} />
              <span className="text-sm text-neutral-600 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-neutral-500 leading-relaxed">
          When no API key is set, a static template-based summary is shown instead.
          AI-generated summaries are labelled with an <em>AI</em> badge.
        </p>
      </SectionCard>

      {/* ── Geographic comparisons ───────────────────────────────────────────── */}
      <SectionCard>
        <CardTitle icon="map-pin-off" bg="bg-amber-50" color="text-amber-600">
          Limitations of Geographic Comparisons
        </CardTitle>
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
      </SectionCard>

      {/* ── Graduate data sources ────────────────────────────────────────────── */}
      <SectionCard>
        <CardTitle icon="database" bg="bg-green-50" color="text-green-600">
          Planned Graduate Data Sources
        </CardTitle>
        <p className="text-[13px] text-neutral-500">
          Intended sources for graduate data when live integration is enabled.
        </p>
        <div className="flex flex-col divide-y divide-neutral-100">
          {SOURCES.map((s) => (
            <div key={s.country} className="py-4 flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-neutral-800">{s.country}</p>
              <p className="text-[13px] text-neutral-500 leading-relaxed">
                <span className="font-medium text-neutral-600">Graduates:</span>{" "}{s.graduates}
              </p>
              <p className="text-[13px] text-neutral-500 leading-relaxed">
                <span className="font-medium text-neutral-600">Vacancies:</span>{" "}{s.vacancies}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Vacancy data providers ───────────────────────────────────────────── */}
      <SectionCard>
        <CardTitle icon="api" bg="bg-blue-50" color="text-blue-600">
          Vacancy Data Providers
        </CardTitle>
        <p className="text-[13px] text-neutral-500 leading-relaxed">
          The provider architecture allows live APIs to be connected without changing any UI
          or calculation code. Only{" "}
          <code className="rounded bg-neutral-100 px-1 font-mono text-xs text-neutral-700">lib/providers/</code>{" "}
          needs to be updated.
        </p>
        <div className="flex flex-col divide-y divide-neutral-100">
          {VACANCY_PROVIDERS.map((p) => (
            <div key={p.name} className="py-4 flex items-start gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-neutral-100 text-neutral-400 flex-shrink-0 mt-0.5">
                <i className="ti ti-plug" style={{ fontSize: 14 }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-semibold text-neutral-800">{p.name}</p>
                  <span className="text-[10px] text-neutral-400 font-mono">{p.type}</span>
                  {p.status === "Supported" ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-green-50 text-green-700">Supported</span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-100 text-neutral-500">Planned</span>
                  )}
                </div>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{p.coverage}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Limitations ──────────────────────────────────────────────────────── */}
      <SectionCard>
        <CardTitle icon="alert-triangle" bg="bg-red-50" color="text-red-500">
          Limitations
        </CardTitle>
        <div className="flex flex-col gap-2.5">
          {CAVEATS.map((c, i) => (
            <div key={i} className="flex gap-3 pl-3 border-l-2 border-amber-200 items-start">
              <p className="text-sm text-neutral-700 leading-relaxed">{c}</p>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-neutral-400 leading-relaxed pt-1 border-t border-neutral-100">
          Do not use for financial, career, or institutional planning without primary source verification.
        </p>
      </SectionCard>

    </div>
    </div>
  );
}
