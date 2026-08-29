import type { VacancyRecord } from "@/lib/types";

// Illustrative demo job listings. Not sourced from any live API.
// All data is fictional. Company names are real but postings are fabricated.
const DEMO_SOURCE = "Demo listing — illustrative only";

export const MOCK_LISTINGS: VacancyRecord[] = [
  // ── Computer Science — India ────────────────────────────────────────────────
  {
    id: "cs-in-001",
    title: "Software Development Engineer II",
    company: "Amazon",
    country: "IN", city: "BLR", cityName: "Bengaluru",
    field: "computer-science",
    skills: ["Java", "Python", "AWS", "System Design", "SQL"],
    postedAt: "2024-11-15",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 2800000, salaryMax: 4500000, salaryCurrency: "INR",
  },
  {
    id: "cs-in-002",
    title: "Senior Backend Engineer",
    company: "Flipkart",
    country: "IN", city: "BLR", cityName: "Bengaluru",
    field: "computer-science",
    skills: ["Golang", "Kubernetes", "PostgreSQL", "Redis", "gRPC"],
    postedAt: "2024-11-20",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 3200000, salaryMax: 5200000, salaryCurrency: "INR",
  },
  {
    id: "cs-in-003",
    title: "Full Stack Developer",
    company: "Infosys",
    country: "IN", city: "HYD", cityName: "Hyderabad",
    field: "computer-science",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "Docker"],
    postedAt: "2024-11-22",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 800000, salaryMax: 1400000, salaryCurrency: "INR",
  },
  {
    id: "cs-in-004",
    title: "Cloud Infrastructure Engineer",
    company: "Microsoft",
    country: "IN", city: "HYD", cityName: "Hyderabad",
    field: "computer-science",
    skills: ["Azure", "Terraform", "Python", "Linux", "Kubernetes"],
    postedAt: "2024-11-18",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 2500000, salaryMax: 4000000, salaryCurrency: "INR",
  },
  {
    id: "cs-in-005",
    title: "Android Developer",
    company: "Paytm",
    country: "IN", city: "DEL", cityName: "Delhi NCR",
    field: "computer-science",
    skills: ["Kotlin", "Android SDK", "Retrofit", "Room DB", "Jetpack Compose"],
    postedAt: "2024-11-10",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 900000, salaryMax: 1600000, salaryCurrency: "INR",
  },
  {
    id: "cs-in-006",
    title: "DevOps Engineer",
    company: "Wipro",
    country: "IN", city: "PUN", cityName: "Pune",
    field: "computer-science",
    skills: ["Jenkins", "Docker", "Ansible", "AWS", "Bash"],
    postedAt: "2024-11-05",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 700000, salaryMax: 1200000, salaryCurrency: "INR",
  },
  {
    id: "cs-in-007",
    title: "AI/ML Engineer",
    company: "Google",
    country: "IN", city: "BLR", cityName: "Bengaluru",
    field: "computer-science",
    skills: ["Python", "TensorFlow", "LLMs", "MLOps", "Cloud"],
    postedAt: "2024-11-25",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 4500000, salaryMax: 8000000, salaryCurrency: "INR",
  },
  {
    id: "cs-in-008",
    title: "Security Engineer",
    company: "HCL Technologies",
    country: "IN", city: "CHE", cityName: "Chennai",
    field: "computer-science",
    skills: ["Penetration Testing", "SIEM", "Python", "Network Security", "ISO 27001"],
    postedAt: "2024-11-08",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 1200000, salaryMax: 2000000, salaryCurrency: "INR",
  },

  // ── Computer Science — US ───────────────────────────────────────────────────
  {
    id: "cs-us-001",
    title: "Staff Software Engineer",
    company: "Google",
    country: "US", city: "SFO", cityName: "San Francisco Bay Area",
    field: "computer-science",
    skills: ["C++", "Go", "Distributed Systems", "Algorithms", "Machine Learning"],
    postedAt: "2024-11-22",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 230000, salaryMax: 380000, salaryCurrency: "USD",
  },
  {
    id: "cs-us-002",
    title: "Frontend Engineer",
    company: "Stripe",
    country: "US", city: "SFO", cityName: "San Francisco Bay Area",
    field: "computer-science",
    skills: ["React", "TypeScript", "GraphQL", "Testing", "Accessibility"],
    postedAt: "2024-11-19",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 190000, salaryMax: 280000, salaryCurrency: "USD",
  },
  {
    id: "cs-us-003",
    title: "Software Engineer II",
    company: "Microsoft",
    country: "US", city: "SEA", cityName: "Seattle",
    field: "computer-science",
    skills: ["C#", ".NET", "Azure", "TypeScript", "SQL Server"],
    postedAt: "2024-11-14",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 170000, salaryMax: 250000, salaryCurrency: "USD",
  },

  // ── Data Science — India ────────────────────────────────────────────────────
  {
    id: "ds-in-001",
    title: "Data Scientist",
    company: "Swiggy",
    country: "IN", city: "BLR", cityName: "Bengaluru",
    field: "data-science",
    skills: ["Python", "Machine Learning", "SQL", "PyTorch", "A/B Testing"],
    postedAt: "2024-11-20",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 1800000, salaryMax: 3200000, salaryCurrency: "INR",
  },
  {
    id: "ds-in-002",
    title: "ML Engineer — Search Relevance",
    company: "Meesho",
    country: "IN", city: "BLR", cityName: "Bengaluru",
    field: "data-science",
    skills: ["Python", "NLP", "LLMs", "ElasticSearch", "Spark"],
    postedAt: "2024-11-18",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 2500000, salaryMax: 4500000, salaryCurrency: "INR",
  },
  {
    id: "ds-in-003",
    title: "Analytics Engineer",
    company: "CRED",
    country: "IN", city: "BLR", cityName: "Bengaluru",
    field: "data-science",
    skills: ["dbt", "SQL", "Python", "Airflow", "Looker"],
    postedAt: "2024-11-10",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 1500000, salaryMax: 2600000, salaryCurrency: "INR",
  },
  {
    id: "ds-us-001",
    title: "Senior Data Scientist",
    company: "Netflix",
    country: "US", city: "SFO", cityName: "San Francisco Bay Area",
    field: "data-science",
    skills: ["Python", "R", "Causal Inference", "SQL", "Spark"],
    postedAt: "2024-11-21",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 220000, salaryMax: 340000, salaryCurrency: "USD",
  },
  {
    id: "ds-us-002",
    title: "Applied Research Scientist — LLM",
    company: "OpenAI",
    country: "US", city: "SFO", cityName: "San Francisco Bay Area",
    field: "data-science",
    skills: ["Python", "PyTorch", "Transformers", "RLHF", "Research"],
    postedAt: "2024-11-24",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 300000, salaryMax: 600000, salaryCurrency: "USD",
  },

  // ── Finance — India ─────────────────────────────────────────────────────────
  {
    id: "fin-in-001",
    title: "Investment Banking Analyst",
    company: "Goldman Sachs",
    country: "IN", city: "BLR", cityName: "Bengaluru",
    field: "finance",
    skills: ["Financial Modelling", "DCF", "Excel", "Bloomberg", "PowerPoint"],
    postedAt: "2024-11-15",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 1200000, salaryMax: 2000000, salaryCurrency: "INR",
  },
  {
    id: "fin-in-002",
    title: "Risk Analyst",
    company: "HDFC Bank",
    country: "IN", city: "MUM", cityName: "Mumbai",
    field: "finance",
    skills: ["Risk Management", "Excel", "SQL", "Basel III", "SAS"],
    postedAt: "2024-11-12",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 700000, salaryMax: 1200000, salaryCurrency: "INR",
  },
  {
    id: "fin-in-003",
    title: "Fintech Product Analyst",
    company: "PhonePe",
    country: "IN", city: "BLR", cityName: "Bengaluru",
    field: "finance",
    skills: ["Python", "SQL", "Data Analysis", "Product Analytics", "A/B Testing"],
    postedAt: "2024-11-20",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 1400000, salaryMax: 2400000, salaryCurrency: "INR",
  },
  {
    id: "fin-gb-001",
    title: "Associate — M&A",
    company: "Barclays",
    country: "GB", city: "LON", cityName: "London",
    field: "finance",
    skills: ["Financial Modelling", "Excel", "Bloomberg", "PowerPoint", "CFA"],
    postedAt: "2024-11-18",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 65000, salaryMax: 90000, salaryCurrency: "GBP",
  },

  // ── Nursing — India ─────────────────────────────────────────────────────────
  {
    id: "nur-in-001",
    title: "ICU Staff Nurse",
    company: "Apollo Hospitals",
    country: "IN", city: "DEL", cityName: "Delhi NCR",
    field: "nursing",
    skills: ["Critical Care", "Ventilator Management", "IV Therapy", "Patient Assessment", "EMR"],
    postedAt: "2024-11-22",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 420000, salaryMax: 720000, salaryCurrency: "INR",
  },
  {
    id: "nur-in-002",
    title: "Staff Nurse — General Ward",
    company: "Fortis Healthcare",
    country: "IN", city: "MUM", cityName: "Mumbai",
    field: "nursing",
    skills: ["Patient Assessment", "Wound Care", "Medication Management", "Communication"],
    postedAt: "2024-11-14",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 350000, salaryMax: 560000, salaryCurrency: "INR",
  },
  {
    id: "nur-us-001",
    title: "Registered Nurse — Emergency Department",
    company: "Kaiser Permanente",
    country: "US", city: "SFO", cityName: "San Francisco Bay Area",
    field: "nursing",
    skills: ["Emergency Medicine", "Triage", "IV Therapy", "CPR/BLS", "ACLS"],
    postedAt: "2024-11-20",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 100000, salaryMax: 140000, salaryCurrency: "USD",
  },
  {
    id: "nur-gb-001",
    title: "Band 5 Registered Nurse — NHS",
    company: "NHS England",
    country: "GB", city: "LON", cityName: "London",
    field: "nursing",
    skills: ["Patient Assessment", "EMR (SystmOne)", "Medication Management", "NMC Registration"],
    postedAt: "2024-11-16",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 29000, salaryMax: 36000, salaryCurrency: "GBP",
  },

  // ── Mechanical Engineering ──────────────────────────────────────────────────
  {
    id: "mech-in-001",
    title: "EV Powertrain Engineer",
    company: "Tata Motors",
    country: "IN", city: "PUN", cityName: "Pune",
    field: "mechanical-engineering",
    skills: ["EV Systems", "MATLAB", "Thermal Management", "SolidWorks", "CAN Bus"],
    postedAt: "2024-11-18",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 900000, salaryMax: 1600000, salaryCurrency: "INR",
  },
  {
    id: "mech-de-001",
    title: "Mechanical Design Engineer",
    company: "Siemens",
    country: "DE", city: "MUC", cityName: "Munich",
    field: "mechanical-engineering",
    skills: ["CATIA V5", "FEA", "GD&T", "Manufacturing Processes", "NX"],
    postedAt: "2024-11-14",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 55000, salaryMax: 80000, salaryCurrency: "EUR",
  },
  {
    id: "mech-us-001",
    title: "Robotics Mechanical Engineer",
    company: "Boston Dynamics",
    country: "US", city: "BOS", cityName: "Boston",
    field: "mechanical-engineering",
    skills: ["Robotics", "SolidWorks", "Dynamics", "Python", "Control Systems"],
    postedAt: "2024-11-20",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 110000, salaryMax: 165000, salaryCurrency: "USD",
  },

  // ── Electrical Engineering ──────────────────────────────────────────────────
  {
    id: "elec-in-001",
    title: "Power Electronics Engineer",
    company: "Ather Energy",
    country: "IN", city: "BLR", cityName: "Bengaluru",
    field: "electrical-engineering",
    skills: ["Power Electronics", "PCB Design", "Embedded C", "Battery BMS", "MATLAB"],
    postedAt: "2024-11-22",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 1200000, salaryMax: 2200000, salaryCurrency: "INR",
  },
  {
    id: "elec-de-001",
    title: "Embedded Systems Engineer",
    company: "Bosch",
    country: "DE", city: "FRA", cityName: "Frankfurt",
    field: "electrical-engineering",
    skills: ["C / C++", "AUTOSAR", "CAN Bus", "MATLAB/Simulink", "RTOS"],
    postedAt: "2024-11-15",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 58000, salaryMax: 82000, salaryCurrency: "EUR",
  },

  // ── Civil Engineering ───────────────────────────────────────────────────────
  {
    id: "civil-in-001",
    title: "Structural Engineer",
    company: "Larsen & Toubro",
    country: "IN", city: "MUM", cityName: "Mumbai",
    field: "civil-engineering",
    skills: ["STAAD Pro", "AutoCAD", "Structural Analysis", "Project Management", "IS Codes"],
    postedAt: "2024-11-15",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 600000, salaryMax: 1100000, salaryCurrency: "INR",
  },
  {
    id: "civil-au-001",
    title: "Civil Project Engineer",
    company: "AECOM",
    country: "AU", city: "SYD", cityName: "Sydney",
    field: "civil-engineering",
    skills: ["Civil 3D", "Project Management", "Environmental Compliance", "BIM", "Stakeholder Management"],
    postedAt: "2024-11-18",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 80000, salaryMax: 110000, salaryCurrency: "AUD",
  },

  // ── Business Administration ─────────────────────────────────────────────────
  {
    id: "biz-in-001",
    title: "Business Analyst",
    company: "Deloitte",
    country: "IN", city: "DEL", cityName: "Delhi NCR",
    field: "business-administration",
    skills: ["Business Analysis", "SQL", "PowerPoint", "Agile", "Stakeholder Management"],
    postedAt: "2024-11-20",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 700000, salaryMax: 1300000, salaryCurrency: "INR",
  },
  {
    id: "biz-us-001",
    title: "Operations Manager",
    company: "Amazon",
    country: "US", city: "NYC", cityName: "New York",
    field: "business-administration",
    skills: ["Operations Management", "Excel", "Six Sigma", "Data Analysis", "Team Leadership"],
    postedAt: "2024-11-17",
    source: DEMO_SOURCE, isDemo: true,
    salaryMin: 85000, salaryMax: 130000, salaryCurrency: "USD",
  },
];

// ── City vacancy distributions ────────────────────────────────────────────────
// These are illustrative shares of the national vacancy total.
// They let us show city-level vacancy estimates without real city-level survey data.

type DistributionMap = Record<string, number>;

const CITY_SHARES: Record<string, DistributionMap> = {
  "IN:computer-science":        { BLR: 0.32, HYD: 0.18, DEL: 0.16, MUM: 0.12, PUN: 0.11, CHE: 0.07, KOL: 0.02, AHM: 0.02 },
  "IN:data-science":            { BLR: 0.40, HYD: 0.20, DEL: 0.14, MUM: 0.12, PUN: 0.08, CHE: 0.04, KOL: 0.01, AHM: 0.01 },
  "IN:finance":                 { MUM: 0.35, DEL: 0.25, BLR: 0.15, HYD: 0.10, CHE: 0.07, PUN: 0.05, KOL: 0.02, AHM: 0.01 },
  "IN:nursing":                 { DEL: 0.22, MUM: 0.18, BLR: 0.14, CHE: 0.12, KOL: 0.11, HYD: 0.10, AHM: 0.07, PUN: 0.06 },
  "IN:mechanical-engineering":  { PUN: 0.28, DEL: 0.20, MUM: 0.18, CHE: 0.15, BLR: 0.10, HYD: 0.06, AHM: 0.02, KOL: 0.01 },
  "IN:civil-engineering":       { DEL: 0.25, MUM: 0.22, BLR: 0.15, HYD: 0.12, CHE: 0.10, AHM: 0.08, KOL: 0.05, PUN: 0.03 },
  "IN:business-administration": { DEL: 0.28, MUM: 0.22, BLR: 0.18, HYD: 0.12, PUN: 0.08, CHE: 0.07, KOL: 0.03, AHM: 0.02 },
  "IN:electrical-engineering":  { BLR: 0.25, PUN: 0.22, HYD: 0.18, DEL: 0.15, CHE: 0.10, MUM: 0.07, KOL: 0.02, AHM: 0.01 },

  "US:computer-science":        { SFO: 0.30, NYC: 0.20, SEA: 0.18, AUS: 0.12, BOS: 0.10, CHI: 0.10 },
  "US:data-science":            { SFO: 0.35, NYC: 0.22, SEA: 0.15, AUS: 0.10, BOS: 0.10, CHI: 0.08 },
  "US:nursing":                 { NYC: 0.22, CHI: 0.18, SFO: 0.16, BOS: 0.15, AUS: 0.12, SEA: 0.10, },
  "US:finance":                 { NYC: 0.48, SFO: 0.18, CHI: 0.14, BOS: 0.10, AUS: 0.06, SEA: 0.04 },
  "US:mechanical-engineering":  { SEA: 0.25, SFO: 0.20, BOS: 0.18, CHI: 0.15, AUS: 0.12, NYC: 0.10 },

  "GB:computer-science":        { LON: 0.58, MCR: 0.16, BRM: 0.10, LEE: 0.08, EDI: 0.08 },
  "GB:nursing":                 { LON: 0.40, MCR: 0.18, BRM: 0.16, LEE: 0.14, EDI: 0.12 },
  "GB:finance":                 { LON: 0.72, MCR: 0.12, BRM: 0.08, LEE: 0.05, EDI: 0.03 },

  "DE:mechanical-engineering":  { MUC: 0.32, BER: 0.22, HAM: 0.18, FRA: 0.15, COL: 0.13 },
  "DE:computer-science":        { BER: 0.35, MUC: 0.28, HAM: 0.18, FRA: 0.12, COL: 0.07 },
  "DE:nursing":                 { BER: 0.25, MUC: 0.20, HAM: 0.18, FRA: 0.20, COL: 0.17 },

  "AU:computer-science":        { SYD: 0.40, MEL: 0.32, BNE: 0.14, PER: 0.09, ADE: 0.05 },
  "AU:nursing":                 { SYD: 0.38, MEL: 0.30, BNE: 0.16, PER: 0.10, ADE: 0.06 },
  "AU:civil-engineering":       { SYD: 0.38, MEL: 0.28, BNE: 0.18, PER: 0.10, ADE: 0.06 },
};

const DEFAULT_SHARE = 0.15;

// Returns the estimated vacancy count for a specific city, given the national total.
export function getCityVacancyCount(
  country: string,
  city: string,
  field: string,
  nationalTotal: number
): number {
  const key = `${country}:${field}`;
  const share = CITY_SHARES[key]?.[city] ?? DEFAULT_SHARE;
  return Math.round(nationalTotal * share);
}

// Returns listings filtered by country, field, and optionally city
export function getListings(
  country: string,
  field: string,
  city?: string
): VacancyRecord[] {
  return MOCK_LISTINGS.filter(
    (l) =>
      l.country === country &&
      l.field === field &&
      (city === undefined || l.city === city)
  );
}

// Returns all listings for a country, optionally filtered by field
export function getAllListings(
  country?: string,
  field?: string,
  city?: string
): VacancyRecord[] {
  return MOCK_LISTINGS.filter(
    (l) =>
      (country === undefined || l.country === country) &&
      (field === undefined || l.field === field) &&
      (city === undefined || l.city === city)
  );
}

// Returns the salary min/max for a specific city + field, derived from listings.
// When real salary APIs are available, replace the body of this function.
export function getCitySalaryRange(
  country: string,
  field: string,
  city: string
): { min: number; max: number; currency: string } | null {
  const listings = MOCK_LISTINGS.filter(
    (l) =>
      l.country === country &&
      l.field === field &&
      l.city === city &&
      l.salaryMin != null &&
      l.salaryMax != null
  );
  if (listings.length === 0) return null;
  const min = Math.min(...listings.map((l) => l.salaryMin!));
  const max = Math.max(...listings.map((l) => l.salaryMax!));
  return { min, max, currency: listings[0].salaryCurrency ?? "USD" };
}
