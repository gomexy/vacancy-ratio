import type { Metadata } from "next";
import { getCountries, getFields } from "@/lib/service";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore the Market",
  description:
    "Select a field and location to see the current vacancy-to-graduate ratio, historical trend, skills demand, and five-year outlook.",
};

export default function ExplorePage() {
  const countries = getCountries();
  const fields    = getFields();

  return (
    <div className="bg-white min-h-screen">
      <ExploreClient countries={countries} fields={fields} />
    </div>
  );
}
