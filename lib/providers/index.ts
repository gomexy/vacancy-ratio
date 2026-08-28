import { MockVacancyProvider } from "./mock";
import { AdzunaProvider }      from "./adzuna";
import type { VacancyProvider } from "./types";

// Re-export types so consumers don't need two imports
export type { VacancyProvider, VacancyQuery, CityVacancySummary } from "./types";

// Provider singleton — resolved once per process.
// Priority: Adzuna (if credentials set) → Mock
let _provider: VacancyProvider | null = null;

export function getVacancyProvider(): VacancyProvider {
  if (!_provider) {
    const adzuna = new AdzunaProvider();
    _provider = adzuna.isAvailable() ? adzuna : new MockVacancyProvider();
  }
  return _provider;
}

export function getProviderStatus(): {
  name: string;
  isLive: boolean;
  isAvailable: boolean;
} {
  const provider = getVacancyProvider();
  return {
    name:        provider.name,
    isLive:      provider.isLive,
    isAvailable: provider.isAvailable(),
  };
}
