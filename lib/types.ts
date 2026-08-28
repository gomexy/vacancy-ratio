// ── Core graduate-market types ────────────────────────────────────────────────

export interface GraduationEntry {
  country: string;
  field: string;
  year: number;
  graduates: number;
  relevantVacancies: number;
  source: string;
  isProjected?: boolean; // true for forecast/extrapolated data
}

export interface MarketSnapshot {
  entry: GraduationEntry;
  vacancyRatio: number;
  vacanciesPer100Graduates: number;
  signal: MarketSignal;
}

export type MarketSignal =
  | "critical-shortage"
  | "strong-demand"
  | "balanced"
  | "surplus"
  | "significant-surplus";

// ── Geographic types ──────────────────────────────────────────────────────────

export interface Country {
  code: string;
  name: string;
}

export interface Field {
  slug: string;
  label: string;
  category: string;
}

export interface City {
  code: string;
  name: string;
  country: string;
}

// ── Vacancy / job-listing types ───────────────────────────────────────────────

export interface VacancyRecord {
  id: string;
  title: string;
  company: string;
  country: string;
  city?: string;      // city code, e.g. "BLR"
  cityName?: string;  // display name, e.g. "Bengaluru"
  field: string;
  skills: string[];
  postedAt: string;   // ISO 8601 date string
  source: string;
  sourceUrl?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  isDemo: boolean;
}

// ── Skills intelligence ───────────────────────────────────────────────────────

export interface SkillDemand {
  skill: string;
  count: number;    // relative frequency (e.g. mentions per 100 postings)
  pct: number;      // % of postings mentioning this skill
  growthPct?: number; // YoY change in pct (percentage points)
}
