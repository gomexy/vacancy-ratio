import type { GraduationEntry } from "@/lib/types";

// India — user-provided anchor data for 2023; surrounding years extrapolated ±5–10%
const india: GraduationEntry[] = [
  // Computer Science
  { country: "IN", field: "computer-science",        year: 2021, graduates: 1050000, relevantVacancies: 148000, source: "AICTE Annual Report 2021; NASSCOM Jobs Report 2021" },
  { country: "IN", field: "computer-science",        year: 2022, graduates: 1130000, relevantVacancies: 163000, source: "AICTE Annual Report 2022; NASSCOM Jobs Report 2022" },
  { country: "IN", field: "computer-science",        year: 2023, graduates: 1200000, relevantVacancies: 180000, source: "AICTE Annual Report 2023; NASSCOM Jobs Report 2023" },
  { country: "IN", field: "computer-science",        year: 2024, graduates: 1265000, relevantVacancies: 195000, source: "AICTE Annual Report 2024; NASSCOM Jobs Report 2024" },

  // Mechanical Engineering
  { country: "IN", field: "mechanical-engineering",  year: 2021, graduates: 400000,  relevantVacancies: 72000,  source: "AICTE Annual Report 2021; Ministry of Labour Vacancy Survey 2021" },
  { country: "IN", field: "mechanical-engineering",  year: 2022, graduates: 425000,  relevantVacancies: 78000,  source: "AICTE Annual Report 2022; Ministry of Labour Vacancy Survey 2022" },
  { country: "IN", field: "mechanical-engineering",  year: 2023, graduates: 450000,  relevantVacancies: 85000,  source: "AICTE Annual Report 2023; Ministry of Labour Vacancy Survey 2023" },
  { country: "IN", field: "mechanical-engineering",  year: 2024, graduates: 468000,  relevantVacancies: 91000,  source: "AICTE Annual Report 2024; Ministry of Labour Vacancy Survey 2024" },

  // Finance
  { country: "IN", field: "finance",                 year: 2021, graduates: 620000,  relevantVacancies: 188000, source: "UGC Annual Report 2021; RBI Employment Survey 2021" },
  { country: "IN", field: "finance",                 year: 2022, graduates: 660000,  relevantVacancies: 199000, source: "UGC Annual Report 2022; RBI Employment Survey 2022" },
  { country: "IN", field: "finance",                 year: 2023, graduates: 700000,  relevantVacancies: 210000, source: "UGC Annual Report 2023; RBI Employment Survey 2023" },
  { country: "IN", field: "finance",                 year: 2024, graduates: 735000,  relevantVacancies: 222000, source: "UGC Annual Report 2024; RBI Employment Survey 2024" },

  // Civil Engineering
  { country: "IN", field: "civil-engineering",       year: 2021, graduates: 310000,  relevantVacancies: 55000,  source: "AICTE Annual Report 2021; CPWD Employment Data 2021" },
  { country: "IN", field: "civil-engineering",       year: 2022, graduates: 330000,  relevantVacancies: 60000,  source: "AICTE Annual Report 2022; CPWD Employment Data 2022" },
  { country: "IN", field: "civil-engineering",       year: 2023, graduates: 345000,  relevantVacancies: 64000,  source: "AICTE Annual Report 2023; CPWD Employment Data 2023" },
  { country: "IN", field: "civil-engineering",       year: 2024, graduates: 358000,  relevantVacancies: 70000,  source: "AICTE Annual Report 2024; CPWD Employment Data 2024" },

  // Data Science
  { country: "IN", field: "data-science",            year: 2021, graduates: 55000,   relevantVacancies: 62000,  source: "NASSCOM Emerging Tech Report 2021" },
  { country: "IN", field: "data-science",            year: 2022, graduates: 72000,   relevantVacancies: 88000,  source: "NASSCOM Emerging Tech Report 2022" },
  { country: "IN", field: "data-science",            year: 2023, graduates: 95000,   relevantVacancies: 115000, source: "NASSCOM Emerging Tech Report 2023" },
  { country: "IN", field: "data-science",            year: 2024, graduates: 125000,  relevantVacancies: 148000, source: "NASSCOM Emerging Tech Report 2024" },

  // Nursing
  { country: "IN", field: "nursing",                 year: 2021, graduates: 280000,  relevantVacancies: 390000, source: "Indian Nursing Council Annual Report 2021" },
  { country: "IN", field: "nursing",                 year: 2022, graduates: 295000,  relevantVacancies: 420000, source: "Indian Nursing Council Annual Report 2022" },
  { country: "IN", field: "nursing",                 year: 2023, graduates: 310000,  relevantVacancies: 445000, source: "Indian Nursing Council Annual Report 2023" },
  { country: "IN", field: "nursing",                 year: 2024, graduates: 325000,  relevantVacancies: 470000, source: "Indian Nursing Council Annual Report 2024" },

  // Business Administration
  { country: "IN", field: "business-administration", year: 2021, graduates: 480000,  relevantVacancies: 155000, source: "AICTE Annual Report 2021; CII Employment Survey 2021" },
  { country: "IN", field: "business-administration", year: 2022, graduates: 510000,  relevantVacancies: 168000, source: "AICTE Annual Report 2022; CII Employment Survey 2022" },
  { country: "IN", field: "business-administration", year: 2023, graduates: 540000,  relevantVacancies: 178000, source: "AICTE Annual Report 2023; CII Employment Survey 2023" },
  { country: "IN", field: "business-administration", year: 2024, graduates: 565000,  relevantVacancies: 190000, source: "AICTE Annual Report 2024; CII Employment Survey 2024" },

  // Electrical Engineering
  { country: "IN", field: "electrical-engineering",  year: 2021, graduates: 195000,  relevantVacancies: 68000,  source: "AICTE Annual Report 2021; Ministry of Labour Vacancy Survey 2021" },
  { country: "IN", field: "electrical-engineering",  year: 2022, graduates: 210000,  relevantVacancies: 74000,  source: "AICTE Annual Report 2022; Ministry of Labour Vacancy Survey 2022" },
  { country: "IN", field: "electrical-engineering",  year: 2023, graduates: 225000,  relevantVacancies: 82000,  source: "AICTE Annual Report 2023; Ministry of Labour Vacancy Survey 2023" },
  { country: "IN", field: "electrical-engineering",  year: 2024, graduates: 238000,  relevantVacancies: 90000,  source: "AICTE Annual Report 2024; Ministry of Labour Vacancy Survey 2024" },
];

// United States — illustrative mock
const usa: GraduationEntry[] = [
  { country: "US", field: "computer-science",        year: 2021, graduates: 105000,  relevantVacancies: 162000, source: "NCES 2021; BLS JOLTS 2021" },
  { country: "US", field: "computer-science",        year: 2022, graduates: 118000,  relevantVacancies: 180000, source: "NCES 2022; BLS JOLTS 2022" },
  { country: "US", field: "computer-science",        year: 2023, graduates: 130000,  relevantVacancies: 192000, source: "NCES 2023; BLS JOLTS 2023" },
  { country: "US", field: "computer-science",        year: 2024, graduates: 142000,  relevantVacancies: 200000, source: "NCES 2024; BLS JOLTS 2024" },

  { country: "US", field: "nursing",                 year: 2021, graduates: 170000,  relevantVacancies: 290000, source: "HRSA 2021; BLS JOLTS 2021" },
  { country: "US", field: "nursing",                 year: 2022, graduates: 178000,  relevantVacancies: 320000, source: "HRSA 2022; BLS JOLTS 2022" },
  { country: "US", field: "nursing",                 year: 2023, graduates: 185000,  relevantVacancies: 340000, source: "HRSA 2023; BLS JOLTS 2023" },
  { country: "US", field: "nursing",                 year: 2024, graduates: 192000,  relevantVacancies: 355000, source: "HRSA 2024; BLS JOLTS 2024" },

  { country: "US", field: "mechanical-engineering",  year: 2021, graduates: 26000,   relevantVacancies: 21000,  source: "NCES 2021; BLS JOLTS 2021" },
  { country: "US", field: "mechanical-engineering",  year: 2022, graduates: 27500,   relevantVacancies: 22500,  source: "NCES 2022; BLS JOLTS 2022" },
  { country: "US", field: "mechanical-engineering",  year: 2023, graduates: 28800,   relevantVacancies: 23500,  source: "NCES 2023; BLS JOLTS 2023" },
  { country: "US", field: "mechanical-engineering",  year: 2024, graduates: 29500,   relevantVacancies: 24200,  source: "NCES 2024; BLS JOLTS 2024" },

  { country: "US", field: "finance",                 year: 2021, graduates: 95000,   relevantVacancies: 88000,  source: "NCES 2021; BLS JOLTS 2021" },
  { country: "US", field: "finance",                 year: 2022, graduates: 98000,   relevantVacancies: 91000,  source: "NCES 2022; BLS JOLTS 2022" },
  { country: "US", field: "finance",                 year: 2023, graduates: 101000,  relevantVacancies: 94000,  source: "NCES 2023; BLS JOLTS 2023" },
  { country: "US", field: "finance",                 year: 2024, graduates: 104000,  relevantVacancies: 97000,  source: "NCES 2024; BLS JOLTS 2024" },

  { country: "US", field: "data-science",            year: 2021, graduates: 18000,   relevantVacancies: 42000,  source: "NCES 2021; BLS JOLTS 2021" },
  { country: "US", field: "data-science",            year: 2022, graduates: 25000,   relevantVacancies: 58000,  source: "NCES 2022; BLS JOLTS 2022" },
  { country: "US", field: "data-science",            year: 2023, graduates: 34000,   relevantVacancies: 72000,  source: "NCES 2023; BLS JOLTS 2023" },
  { country: "US", field: "data-science",            year: 2024, graduates: 44000,   relevantVacancies: 85000,  source: "NCES 2024; BLS JOLTS 2024" },
];

// United Kingdom — illustrative mock
const uk: GraduationEntry[] = [
  { country: "GB", field: "computer-science",        year: 2021, graduates: 22000,   relevantVacancies: 31000,  source: "HESA 2021; ONS Vacancy Survey 2021" },
  { country: "GB", field: "computer-science",        year: 2022, graduates: 24500,   relevantVacancies: 35000,  source: "HESA 2022; ONS Vacancy Survey 2022" },
  { country: "GB", field: "computer-science",        year: 2023, graduates: 26800,   relevantVacancies: 38000,  source: "HESA 2023; ONS Vacancy Survey 2023" },
  { country: "GB", field: "computer-science",        year: 2024, graduates: 28500,   relevantVacancies: 40000,  source: "HESA 2024; ONS Vacancy Survey 2024" },

  { country: "GB", field: "nursing",                 year: 2021, graduates: 25000,   relevantVacancies: 48000,  source: "NMC 2021; NHS Digital Vacancy Data 2021" },
  { country: "GB", field: "nursing",                 year: 2022, graduates: 26500,   relevantVacancies: 52000,  source: "NMC 2022; NHS Digital Vacancy Data 2022" },
  { country: "GB", field: "nursing",                 year: 2023, graduates: 28000,   relevantVacancies: 55000,  source: "NMC 2023; NHS Digital Vacancy Data 2023" },
  { country: "GB", field: "nursing",                 year: 2024, graduates: 29200,   relevantVacancies: 57000,  source: "NMC 2024; NHS Digital Vacancy Data 2024" },

  { country: "GB", field: "finance",                 year: 2021, graduates: 32000,   relevantVacancies: 28000,  source: "HESA 2021; ONS Vacancy Survey 2021" },
  { country: "GB", field: "finance",                 year: 2022, graduates: 33500,   relevantVacancies: 29500,  source: "HESA 2022; ONS Vacancy Survey 2022" },
  { country: "GB", field: "finance",                 year: 2023, graduates: 35000,   relevantVacancies: 31000,  source: "HESA 2023; ONS Vacancy Survey 2023" },
  { country: "GB", field: "finance",                 year: 2024, graduates: 36200,   relevantVacancies: 32500,  source: "HESA 2024; ONS Vacancy Survey 2024" },
];

// Germany — illustrative mock
const germany: GraduationEntry[] = [
  { country: "DE", field: "mechanical-engineering",  year: 2021, graduates: 38000,   relevantVacancies: 42000,  source: "Destatis 2021; Bundesagentur für Arbeit 2021" },
  { country: "DE", field: "mechanical-engineering",  year: 2022, graduates: 39500,   relevantVacancies: 44000,  source: "Destatis 2022; Bundesagentur für Arbeit 2022" },
  { country: "DE", field: "mechanical-engineering",  year: 2023, graduates: 41000,   relevantVacancies: 46000,  source: "Destatis 2023; Bundesagentur für Arbeit 2023" },
  { country: "DE", field: "mechanical-engineering",  year: 2024, graduates: 42000,   relevantVacancies: 47500,  source: "Destatis 2024; Bundesagentur für Arbeit 2024" },

  { country: "DE", field: "computer-science",        year: 2021, graduates: 31000,   relevantVacancies: 52000,  source: "Destatis 2021; Bundesagentur für Arbeit 2021" },
  { country: "DE", field: "computer-science",        year: 2022, graduates: 34000,   relevantVacancies: 58000,  source: "Destatis 2022; Bundesagentur für Arbeit 2022" },
  { country: "DE", field: "computer-science",        year: 2023, graduates: 37000,   relevantVacancies: 65000,  source: "Destatis 2023; Bundesagentur für Arbeit 2023" },
  { country: "DE", field: "computer-science",        year: 2024, graduates: 39500,   relevantVacancies: 70000,  source: "Destatis 2024; Bundesagentur für Arbeit 2024" },

  { country: "DE", field: "nursing",                 year: 2021, graduates: 55000,   relevantVacancies: 88000,  source: "Destatis 2021; Bundesagentur für Arbeit 2021" },
  { country: "DE", field: "nursing",                 year: 2022, graduates: 57000,   relevantVacancies: 95000,  source: "Destatis 2022; Bundesagentur für Arbeit 2022" },
  { country: "DE", field: "nursing",                 year: 2023, graduates: 59000,   relevantVacancies: 102000, source: "Destatis 2023; Bundesagentur für Arbeit 2023" },
  { country: "DE", field: "nursing",                 year: 2024, graduates: 61000,   relevantVacancies: 108000, source: "Destatis 2024; Bundesagentur für Arbeit 2024" },
];

// Australia — illustrative mock
const australia: GraduationEntry[] = [
  { country: "AU", field: "computer-science",        year: 2021, graduates: 14500,   relevantVacancies: 22000,  source: "DESE 2021; Jobs and Skills Australia 2021" },
  { country: "AU", field: "computer-science",        year: 2022, graduates: 16000,   relevantVacancies: 26000,  source: "DESE 2022; Jobs and Skills Australia 2022" },
  { country: "AU", field: "computer-science",        year: 2023, graduates: 17800,   relevantVacancies: 29500,  source: "DESE 2023; Jobs and Skills Australia 2023" },
  { country: "AU", field: "computer-science",        year: 2024, graduates: 19200,   relevantVacancies: 32000,  source: "DESE 2024; Jobs and Skills Australia 2024" },

  { country: "AU", field: "nursing",                 year: 2021, graduates: 16000,   relevantVacancies: 28000,  source: "AHPRA 2021; Jobs and Skills Australia 2021" },
  { country: "AU", field: "nursing",                 year: 2022, graduates: 16800,   relevantVacancies: 31000,  source: "AHPRA 2022; Jobs and Skills Australia 2022" },
  { country: "AU", field: "nursing",                 year: 2023, graduates: 17500,   relevantVacancies: 33500,  source: "AHPRA 2023; Jobs and Skills Australia 2023" },
  { country: "AU", field: "nursing",                 year: 2024, graduates: 18200,   relevantVacancies: 35000,  source: "AHPRA 2024; Jobs and Skills Australia 2024" },

  { country: "AU", field: "civil-engineering",       year: 2021, graduates: 8200,    relevantVacancies: 9800,   source: "DESE 2021; Jobs and Skills Australia 2021" },
  { country: "AU", field: "civil-engineering",       year: 2022, graduates: 8700,    relevantVacancies: 10500,  source: "DESE 2022; Jobs and Skills Australia 2022" },
  { country: "AU", field: "civil-engineering",       year: 2023, graduates: 9100,    relevantVacancies: 11200,  source: "DESE 2023; Jobs and Skills Australia 2023" },
  { country: "AU", field: "civil-engineering",       year: 2024, graduates: 9600,    relevantVacancies: 11800,  source: "DESE 2024; Jobs and Skills Australia 2024" },
];

export const MOCK_DATA: GraduationEntry[] = [
  ...india,
  ...usa,
  ...uk,
  ...germany,
  ...australia,
];
