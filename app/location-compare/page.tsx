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
      <LocationCompareClient countries={countries} fields={fields} />
    </div>
  );
}
