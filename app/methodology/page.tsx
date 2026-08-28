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

export default function MethodologyPage() {
  return (
    <div className="bg-white min-h-screen">
    <div className="mx-auto max-w-5xl px-6 sm:px-12 py-14">
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
      </div>

      {/* Formula */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-5">
        <SectionHeading>The formula</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Two metrics are computed. Neither is stored — both are derived at query time from
          the raw source figures. This ensures consistency and auditability.
        </p>

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
  );
}
