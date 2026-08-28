import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How VacancyRatio calculates the vacancy-to-graduate ratio, what the data represents, its limitations, and how mock data will be replaced by real sources.",
};

const SOURCES = [
  {
    country: "India",
    graduates: "AICTE Annual Report; UGC Annual Report; Indian Nursing Council",
    vacancies: "Ministry of Labour & Employment Vacancy Survey; NASSCOM Jobs Reports; RBI Employment Survey",
  },
  {
    country: "United States",
    graduates: "National Center for Education Statistics (NCES); HRSA",
    vacancies: "Bureau of Labor Statistics JOLTS",
  },
  {
    country: "United Kingdom",
    graduates: "Higher Education Statistics Agency (HESA); Nursing & Midwifery Council (NMC)",
    vacancies: "ONS Vacancy Survey; NHS Digital",
  },
  {
    country: "Germany",
    graduates: "Destatis (Federal Statistical Office)",
    vacancies: "Bundesagentur für Arbeit",
  },
  {
    country: "Australia",
    graduates: "Department of Education, Skills and Employment (DESE); AHPRA",
    vacancies: "Jobs and Skills Australia",
  },
];

const FUTURE_APIS = [
  { name: "UNESCO UIS API",                 coverage: "Global graduation data, 200+ countries, ISCED classification" },
  { name: "Eurostat API",                   coverage: "EU graduation data, harmonised across member states" },
  { name: "BLS JOLTS API",                  coverage: "US monthly job openings by industry and occupation" },
  { name: "OECD Stats API",                 coverage: "Cross-country employment and labour market data" },
  { name: "LinkedIn API (partner programme)", coverage: "Real-time job posting volumes by field and geography" },
];

const THRESHOLDS = [
  { signal: "Critical Shortage",  range: "> 2.00",       meaning: "Vacancies are more than double the graduate supply" },
  { signal: "Strong Demand",      range: "1.00 – 2.00",  meaning: "More vacancies than graduates; market actively absorbing new entrants" },
  { signal: "Balanced",           range: "0.75 – 1.00",  meaning: "Supply and demand broadly aligned" },
  { signal: "Surplus",            range: "0.50 – 0.75",  meaning: "More graduates than vacancies" },
  { signal: "Significant Surplus", range: "< 0.50",      meaning: "Graduates substantially outnumber available roles" },
];

const CAVEATS = [
  "Graduation figures count completions, not enrolments. Part-time and distance learners may be under-represented in some sources.",
  "Vacancy counts reflect posted roles at a point in time, which may diverge from actual hiring volumes or filled positions.",
  "Field mappings between graduation classifications (ISCED) and vacancy classifications (ISCO, SOC) are approximate. Some graduates work in adjacent fields.",
  "The ratio does not account for geographic distribution within a country — national averages can mask significant regional imbalances.",
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
          VacancyRatio uses a single computed metric to compare graduate supply
          with job vacancy demand. This page explains what the numbers mean,
          where the data comes from, and the important limits of this approach.
        </p>
      </div>

      {/* Data status notice */}
      <div className="py-8 border-b border-neutral-200">
        <div className="rounded-md bg-amber-50 border border-amber-100 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">
            Demo data
          </p>
          <p className="text-sm text-amber-800 leading-relaxed">
            All figures shown are illustrative mock data. They reflect realistic orders of magnitude
            but are not sourced from live APIs. The planned real data sources are documented below.
          </p>
        </div>
      </div>

      {/* What "graduates" means */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-3">
        <SectionHeading>What does "graduates" mean?</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Graduates refers to the number of people who completed a qualification
          in a specific field of study in a given year, as reported by national
          education statistics bodies. This includes undergraduate and postgraduate
          completions. It does not include students who enrolled but did not complete,
          or those who studied part-time and graduated in a different cohort year.
        </p>
      </div>

      {/* What "vacancies" means */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-3">
        <SectionHeading>What does "vacancies" mean?</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Vacancies refers to the number of job openings relevant to a given field,
          as reported by national labour surveys or job market data providers at
          or around the reference year. A vacancy is a role that an employer is
          actively seeking to fill. This figure does not represent the total number
          of employed people in the field — only active new openings.
        </p>
      </div>

      {/* Formula */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-5">
        <SectionHeading>The formula</SectionHeading>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Two metrics are computed. Neither is stored — both are derived at query
          time from the raw source figures, ensuring consistency and auditability.
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
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pr-6">
                  Signal
                </th>
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pr-6">
                  Range
                </th>
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Meaning
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {THRESHOLDS.map((row) => (
                <tr key={row.signal}>
                  <td className="py-3.5 pr-6 font-medium text-neutral-800 whitespace-nowrap">
                    {row.signal}
                  </td>
                  <td className="py-3.5 pr-6 font-mono text-xs text-neutral-500 whitespace-nowrap">
                    {row.range}
                  </td>
                  <td className="py-3.5 text-neutral-500">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data sources */}
      <div className="py-10 border-b border-neutral-200 flex flex-col gap-5">
        <div>
          <SectionHeading>Planned data sources</SectionHeading>
          <p className="mt-2 text-sm text-neutral-500">
            These are the intended sources for each market when real data integration
            is enabled. All current figures are illustrative.
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
          <SectionHeading>Planned API integrations</SectionHeading>
          <p className="mt-2 text-sm text-neutral-500">
            The service layer is designed so that replacing mock data with live
            APIs requires changing only one file —{" "}
            <code className="rounded bg-neutral-100 px-1 font-mono text-xs text-neutral-700">
              lib/service.ts
            </code>{" "}
            — without any changes to the UI or computation logic.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 pr-6">
                  API
                </th>
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Coverage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {FUTURE_APIS.map((api) => (
                <tr key={api.name}>
                  <td className="py-3.5 pr-6 font-medium text-neutral-800 whitespace-nowrap">
                    {api.name}
                  </td>
                  <td className="py-3.5 text-neutral-500">{api.coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-400">
          Update frequency will depend on the cadence of each upstream source — typically annual
          for graduation data and quarterly or monthly for vacancy data.
        </p>
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
