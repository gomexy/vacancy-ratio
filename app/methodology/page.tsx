import Card from "@/components/ui/Card";

export const metadata = {
  title: "Methodology — VacancyRatio",
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
  { name: "UNESCO UIS API", coverage: "Global graduation data, 200+ countries, ISCED classification" },
  { name: "Eurostat API",   coverage: "EU graduation data, harmonised across member states" },
  { name: "BLS JOLTS API",  coverage: "US monthly job openings by industry and occupation" },
  { name: "OECD Stats API", coverage: "Cross-country employment and labour market data" },
  { name: "LinkedIn API (partner programme)", coverage: "Real-time job posting volumes by field and geography" },
];

export default function MethodologyPage() {
  return (
    <div className="flex flex-col gap-12 max-w-3xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Methodology
        </h1>
        <p className="mt-2 text-neutral-500">
          How VacancyRatio calculates and interprets the data.
        </p>
      </div>

      {/* Formula */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-neutral-900">Core Formula</h2>
        <Card className="font-mono text-sm bg-neutral-950 text-neutral-100 border-neutral-800">
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-neutral-400">// Vacancy-to-graduate ratio</span>
              <p className="mt-1 text-emerald-400">vacancyRatio = relevantVacancies / graduates</p>
            </div>
            <div>
              <span className="text-neutral-400">// Normalised view</span>
              <p className="mt-1 text-emerald-400">vacanciesPer100Graduates = vacancyRatio × 100</p>
            </div>
          </div>
        </Card>
        <p className="text-sm text-neutral-500 leading-relaxed">
          The ratio is never stored — it is always derived at query time from the raw graduate
          and vacancy figures. This ensures the numbers stay consistent and auditable.
        </p>
      </section>

      {/* Signal thresholds */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-neutral-900">Interpretation Thresholds</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Signal</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Ratio Range</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                { signal: "Critical Shortage",   range: "> 2.00",        meaning: "Vacancies are more than double the graduate supply" },
                { signal: "Strong Demand",        range: "1.00 – 2.00",   meaning: "More vacancies than graduates; market absorbing entrants" },
                { signal: "Balanced",             range: "0.75 – 1.00",   meaning: "Supply and demand broadly aligned" },
                { signal: "Surplus",              range: "0.50 – 0.75",   meaning: "More graduates than vacancies" },
                { signal: "Significant Surplus",  range: "< 0.50",        meaning: "Graduates substantially outnumber available roles" },
              ].map((row) => (
                <tr key={row.signal} className="border-b border-neutral-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-neutral-800">{row.signal}</td>
                  <td className="px-5 py-3 font-mono text-xs text-neutral-600">{row.range}</td>
                  <td className="px-5 py-3 text-neutral-500">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Current data sources */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-neutral-900">Current Data (Mock)</h2>
        <p className="text-sm text-neutral-500">
          This version uses illustrative mock data structured to reflect realistic orders of magnitude.
          The sources below are the intended future references for each market.
        </p>
        <div className="flex flex-col gap-3">
          {SOURCES.map((s) => (
            <Card key={s.country} className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-neutral-800">{s.country}</p>
              <div className="grid grid-cols-2 gap-4 text-xs text-neutral-500">
                <div>
                  <span className="font-medium text-neutral-700">Graduates: </span>
                  {s.graduates}
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Vacancies: </span>
                  {s.vacancies}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Future API integrations */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-neutral-900">Planned Real-Data Integrations</h2>
        <p className="text-sm text-neutral-500">
          The service layer is designed to swap mock data for live APIs with a single environment
          variable change (<code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs">DATA_SOURCE=live</code>).
          No other code changes are required.
        </p>
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">API</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {FUTURE_APIS.map((api) => (
                <tr key={api.name} className="border-b border-neutral-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-neutral-800">{api.name}</td>
                  <td className="px-5 py-3 text-neutral-500">{api.coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Caveats */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-neutral-900">Caveats</h2>
        <ul className="flex flex-col gap-2 text-sm text-neutral-500">
          {[
            "Graduation figures count completions, not enrolments. Part-time and distance learners may be under-represented in some sources.",
            "Vacancy counts reflect posted roles at a point in time, which may diverge from actual hiring volumes.",
            "Field mappings between graduation classifications (ISCED) and vacancy classifications (ISCO, SOC) are approximate.",
            "The ratio does not account for geographic distribution within a country — national averages mask regional imbalances.",
            "This data is illustrative. Do not use it for financial, career, or institutional planning without primary source verification.",
          ].map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 text-neutral-300">—</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
