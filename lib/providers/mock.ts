import type { VacancyRecord, SkillDemand } from "@/lib/types";
import type { VacancyProvider, VacancyQuery, CityVacancySummary } from "./types";
import { getCityVacancyCount, getListings } from "@/lib/data/mock-vacancies";
import { getSkillsForField } from "@/lib/data/mock-skills";

export class MockVacancyProvider implements VacancyProvider {
  readonly name = "Demo (illustrative mock data)";
  readonly isLive = false;

  isAvailable(): boolean {
    return true; // always available as the fallback
  }

  async getListings(query: VacancyQuery): Promise<VacancyRecord[]> {
    const { country, city, field, limit = 20, offset = 0 } = query;
    const results = getListings(country, field, city);
    return results.slice(offset, offset + limit);
  }

  async getCityVacancyCount(
    country: string,
    city: string | null,
    field: string,
    _year: number,
    nationalTotal: number
  ): Promise<CityVacancySummary> {
    if (!city) {
      return {
        city: null,
        cityName: null,
        count: nationalTotal,
        isDemo: true,
        source: this.name,
        dataAsOf: "2024",
      };
    }

    const count = getCityVacancyCount(country, city, field, nationalTotal);
    return {
      city,
      cityName: city, // resolved by caller from cities list
      count,
      isDemo: true,
      source: this.name,
      dataAsOf: "2024",
    };
  }

  async getTopSkills(country: string, field: string): Promise<SkillDemand[]> {
    // Country-level variation not modelled in mock — same skills for all countries
    void country;
    const raw = getSkillsForField(field);
    return raw.map((s) => ({
      skill: s.skill,
      count: s.pct,      // using pct as a proxy for count
      pct: s.pct,
      growthPct: s.growthPpt,
    }));
  }
}
