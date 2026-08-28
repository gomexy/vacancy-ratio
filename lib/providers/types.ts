import type { VacancyRecord, SkillDemand } from "@/lib/types";

export interface VacancyQuery {
  country: string;
  city?: string;
  field: string;
  limit?: number;
  offset?: number;
}

export interface CityVacancySummary {
  city: string | null; // null = national aggregate
  cityName: string | null;
  count: number;
  isDemo: boolean;
  source: string;
  dataAsOf?: string;
}

export interface VacancyProvider {
  readonly name: string;
  readonly isLive: boolean; // false = demo/mock
  isAvailable(): boolean;
  getListings(query: VacancyQuery): Promise<VacancyRecord[]>;
  getCityVacancyCount(
    country: string,
    city: string | null,
    field: string,
    year: number,
    nationalTotal: number
  ): Promise<CityVacancySummary>;
  getTopSkills(country: string, field: string): Promise<SkillDemand[]>;
}
