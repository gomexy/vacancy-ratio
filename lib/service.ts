/**
 * Service layer — the only file that needs to change when swapping mock data
 * for real APIs. Set DATA_SOURCE=live in env to switch (not yet implemented).
 */
import { MOCK_DATA } from "@/lib/data/mock";
import { COUNTRIES } from "@/lib/data/countries";
import { FIELDS } from "@/lib/data/fields";
import { CITIES_BY_COUNTRY, getCitiesForCountry } from "@/lib/data/cities";
import { getCityVacancyCount } from "@/lib/data/mock-vacancies";
import type { Country, Field, GraduationEntry } from "@/lib/types";
import type { CityOption } from "@/lib/data/cities";

export function getCountries(): Country[] {
  return COUNTRIES;
}

export function getFields(): Field[] {
  return FIELDS;
}

export function getCities(country: string): CityOption[] {
  return getCitiesForCountry(country);
}

export function getAllCities(): typeof CITIES_BY_COUNTRY {
  return CITIES_BY_COUNTRY;
}

// Only returns years with real historical data, not projections
export function getAvailableYears(country: string, field: string): number[] {
  const years = MOCK_DATA.filter(
    (e) => e.country === country && e.field === field && !e.isProjected
  ).map((e) => e.year);
  return [...new Set(years)].sort((a, b) => b - a);
}

// Only returns a non-projected entry
export function getEntry(
  country: string,
  field: string,
  year: number
): GraduationEntry | null {
  return (
    MOCK_DATA.find(
      (e) =>
        e.country === country &&
        e.field === field &&
        e.year === year &&
        !e.isProjected
    ) ?? null
  );
}

// Returns the entry with vacancy count adjusted for a specific city
export function getEntryForCity(
  country: string,
  field: string,
  year: number,
  city: string
): GraduationEntry | null {
  const base = getEntry(country, field, year);
  if (!base) return null;
  const cityVacancies = getCityVacancyCount(
    country,
    city,
    field,
    base.relevantVacancies
  );
  return { ...base, relevantVacancies: cityVacancies };
}

export function getEntriesForCountryYear(
  country: string,
  year: number
): GraduationEntry[] {
  return MOCK_DATA.filter(
    (e) => e.country === country && e.year === year && !e.isProjected
  );
}

export function getEntriesForFieldYear(
  fields: string[],
  country: string,
  year: number
): GraduationEntry[] {
  return MOCK_DATA.filter(
    (e) =>
      fields.includes(e.field) &&
      e.country === country &&
      e.year === year &&
      !e.isProjected
  );
}

// Historical entries only, sorted ascending
export function getTrendEntries(
  country: string,
  field: string
): GraduationEntry[] {
  return MOCK_DATA.filter(
    (e) => e.country === country && e.field === field && !e.isProjected
  ).sort((a, b) => a.year - b.year);
}

// Historical + projected combined, sorted ascending
export function getAllEntries(
  country: string,
  field: string
): GraduationEntry[] {
  return MOCK_DATA.filter(
    (e) => e.country === country && e.field === field
  ).sort((a, b) => a.year - b.year);
}

export function getAvailableCountriesForField(field: string): string[] {
  return [
    ...new Set(
      MOCK_DATA.filter((e) => e.field === field && !e.isProjected).map(
        (e) => e.country
      )
    ),
  ];
}

// Returns all cities for a country that have estimated vacancy data
export function getAvailableCitiesForCountry(country: string): CityOption[] {
  return getCitiesForCountry(country);
}

// Returns vacancy counts for each city in a country for a given field + year
// (for the location comparison page)
export function getCityVacancyBreakdown(
  country: string,
  field: string,
  year: number
): Array<{ city: CityOption; vacancies: number; graduates: number }> {
  const base = getEntry(country, field, year);
  if (!base) return [];

  const cities = getCitiesForCountry(country);
  return cities.map((city) => ({
    city,
    vacancies: getCityVacancyCount(
      country,
      city.code,
      field,
      base.relevantVacancies
    ),
    graduates: base.graduates, // graduation data is national
  }));
}
