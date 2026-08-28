/**
 * Service layer — the only file that needs to change when swapping mock data
 * for real APIs. Set DATA_SOURCE=live in env to switch (not yet implemented).
 */
import { MOCK_DATA } from "@/lib/data/mock";
import { COUNTRIES } from "@/lib/data/countries";
import { FIELDS } from "@/lib/data/fields";
import type { Country, Field, GraduationEntry } from "@/lib/types";

export function getCountries(): Country[] {
  return COUNTRIES;
}

export function getFields(): Field[] {
  return FIELDS;
}

export function getAvailableYears(country: string, field: string): number[] {
  const years = MOCK_DATA.filter(
    (e) => e.country === country && e.field === field
  ).map((e) => e.year);
  return [...new Set(years)].sort((a, b) => b - a);
}

export function getEntry(
  country: string,
  field: string,
  year: number
): GraduationEntry | null {
  return (
    MOCK_DATA.find(
      (e) => e.country === country && e.field === field && e.year === year
    ) ?? null
  );
}

export function getEntriesForCountryYear(
  country: string,
  year: number
): GraduationEntry[] {
  return MOCK_DATA.filter((e) => e.country === country && e.year === year);
}

export function getEntriesForFieldYear(
  fields: string[],
  country: string,
  year: number
): GraduationEntry[] {
  return MOCK_DATA.filter(
    (e) => fields.includes(e.field) && e.country === country && e.year === year
  );
}

export function getTrendEntries(
  country: string,
  field: string
): GraduationEntry[] {
  return MOCK_DATA.filter(
    (e) => e.country === country && e.field === field
  ).sort((a, b) => a.year - b.year);
}

export function getAvailableCountriesForField(field: string): string[] {
  return [...new Set(MOCK_DATA.filter((e) => e.field === field).map((e) => e.country))];
}
