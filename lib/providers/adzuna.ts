/**
 * Adzuna vacancy data provider.
 *
 * Requires these environment variables (set in Vercel or .env.local):
 *   ADZUNA_APP_ID   — from https://developer.adzuna.com/
 *   ADZUNA_API_KEY  — from https://developer.adzuna.com/
 *
 * When credentials are absent, isAvailable() returns false and the system
 * automatically falls back to MockVacancyProvider.
 *
 * Adzuna API reference: https://api.adzuna.com/v1/api/
 * Supported countries: us, gb, au, de, in (and others)
 */

import type { VacancyRecord, SkillDemand } from "@/lib/types";
import type { VacancyProvider, VacancyQuery, CityVacancySummary } from "./types";

// Maps our internal country codes to Adzuna country path segments
const COUNTRY_MAP: Record<string, string> = {
  US: "us",
  GB: "gb",
  AU: "au",
  DE: "de",
  IN: "in",
};

// Maps our internal field slugs to rough Adzuna category tags
const FIELD_CATEGORY_MAP: Record<string, string> = {
  "computer-science":        "it-jobs",
  "data-science":            "it-jobs",
  "finance":                 "finance-jobs",
  "nursing":                 "healthcare-nursing-jobs",
  "mechanical-engineering":  "engineering-jobs",
  "civil-engineering":       "engineering-jobs",
  "electrical-engineering":  "engineering-jobs",
  "business-administration": "management-jobs",
};

export class AdzunaProvider implements VacancyProvider {
  readonly name = "Adzuna";
  readonly isLive = true;

  private appId  = process.env.ADZUNA_APP_ID  ?? "";
  private apiKey = process.env.ADZUNA_API_KEY ?? "";

  isAvailable(): boolean {
    return Boolean(this.appId && this.apiKey);
  }

  async getListings(query: VacancyQuery): Promise<VacancyRecord[]> {
    const { country, field, city, limit = 20 } = query;
    const countryCode = COUNTRY_MAP[country];
    const category   = FIELD_CATEGORY_MAP[field];

    if (!countryCode || !category) return [];

    const params = new URLSearchParams({
      app_id:       this.appId,
      app_key:      this.apiKey,
      results_per_page: String(limit),
      category,
      ...(city ? { where: city } : {}),
    });

    const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?${params.toString()}`;

    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour
    if (!res.ok) throw new Error(`Adzuna API error: ${res.status}`);

    const json = await res.json();

    return (json.results ?? []).map((r: Record<string, unknown>) => ({
      id:        String(r.id),
      title:     String(r.title ?? ""),
      company:   String((r.company as Record<string, unknown>)?.display_name ?? ""),
      country,
      city:      city ?? undefined,
      cityName:  city ?? undefined,
      field,
      skills:    [], // Adzuna does not return skill tags — would require NLP parsing
      postedAt:  String(r.created ?? ""),
      source:    "Adzuna",
      sourceUrl: String(r.redirect_url ?? ""),
      salaryMin: typeof r.salary_min === "number" ? r.salary_min : undefined,
      salaryMax: typeof r.salary_max === "number" ? r.salary_max : undefined,
      salaryCurrency: countryCode === "in" ? "INR" : countryCode === "us" ? "USD" : countryCode === "gb" ? "GBP" : countryCode === "de" ? "EUR" : "AUD",
      isDemo:    false,
    }));
  }

  async getCityVacancyCount(
    country: string,
    city: string | null,
    field: string,
    _year: number,
    _nationalTotal: number
  ): Promise<CityVacancySummary> {
    const countryCode = COUNTRY_MAP[country];
    const category   = FIELD_CATEGORY_MAP[field];

    if (!countryCode || !category) {
      return { city, cityName: city, count: 0, isDemo: false, source: this.name };
    }

    const params = new URLSearchParams({
      app_id:   this.appId,
      app_key:  this.apiKey,
      category,
      results_per_page: "1",
      ...(city ? { where: city } : {}),
    });

    const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?${params.toString()}`;
    const res  = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Adzuna API error: ${res.status}`);

    const json = await res.json();
    const count = typeof json.count === "number" ? json.count : 0;

    return {
      city,
      cityName: city,
      count,
      isDemo:   false,
      source:   this.name,
      dataAsOf: new Date().toISOString().slice(0, 10),
    };
  }

  async getTopSkills(_country: string, _field: string): Promise<SkillDemand[]> {
    // Adzuna does not expose skill frequency directly.
    // A production implementation would use the job descriptions endpoint,
    // extract skills via NLP, and aggregate.
    // For now, return empty — the UI falls back to mock skills.
    return [];
  }
}
