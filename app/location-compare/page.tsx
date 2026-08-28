import type { Metadata } from "next";
import { getCountries, getFields } from "@/lib/service";
import LocationCompareClient from "./LocationCompareClient";

export const metadata: Metadata = {
  title: "Location Comparison",
  description:
    "Compare job vacancy concentration for the same field across cities within a country. See where demand is strongest.",
};

export default function LocationComparePage() {
  const countries = getCountries();
  const fields    = getFields();

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-5xl px-6 sm:px-12 pt-14 pb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Location Comparison
        </p>
        <h1
          className="font-bold leading-tight tracking-tight text-neutral-900"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
        >
          Where is demand strongest for this field?
        </h1>
        <p className="mt-3 text-sm text-neutral-500 max-w-xl leading-relaxed">
          Compare estimated vacancy concentration across cities within a country
          for a specific field and year. Vacancy data reflects city-level distributions;
          graduate supply is measured at the national level.
        </p>
      </div>
      <LocationCompareClient countries={countries} fields={fields} />
    </div>
  );
}
