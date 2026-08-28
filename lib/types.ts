export interface GraduationEntry {
  country: string;         // ISO 3166-1 alpha-2
  field: string;           // slug
  year: number;
  graduates: number;
  relevantVacancies: number;
  source: string;
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

export interface Country {
  code: string;
  name: string;
}

export interface Field {
  slug: string;
  label: string;
  category: string;
}
