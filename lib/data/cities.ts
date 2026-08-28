export interface CityOption {
  code: string;
  name: string;
}

export const CITIES_BY_COUNTRY: Record<string, CityOption[]> = {
  IN: [
    { code: "BLR", name: "Bengaluru" },
    { code: "DEL", name: "Delhi NCR" },
    { code: "MUM", name: "Mumbai" },
    { code: "HYD", name: "Hyderabad" },
    { code: "PUN", name: "Pune" },
    { code: "CHE", name: "Chennai" },
    { code: "KOL", name: "Kolkata" },
    { code: "AHM", name: "Ahmedabad" },
  ],
  US: [
    { code: "SFO", name: "San Francisco Bay Area" },
    { code: "NYC", name: "New York" },
    { code: "SEA", name: "Seattle" },
    { code: "AUS", name: "Austin" },
    { code: "BOS", name: "Boston" },
    { code: "CHI", name: "Chicago" },
  ],
  GB: [
    { code: "LON", name: "London" },
    { code: "MCR", name: "Manchester" },
    { code: "BRM", name: "Birmingham" },
    { code: "LEE", name: "Leeds" },
    { code: "EDI", name: "Edinburgh" },
  ],
  DE: [
    { code: "BER", name: "Berlin" },
    { code: "MUC", name: "Munich" },
    { code: "HAM", name: "Hamburg" },
    { code: "FRA", name: "Frankfurt" },
    { code: "COL", name: "Cologne" },
  ],
  AU: [
    { code: "SYD", name: "Sydney" },
    { code: "MEL", name: "Melbourne" },
    { code: "BNE", name: "Brisbane" },
    { code: "PER", name: "Perth" },
    { code: "ADE", name: "Adelaide" },
  ],
};

export function getCitiesForCountry(country: string): CityOption[] {
  return CITIES_BY_COUNTRY[country] ?? [];
}
