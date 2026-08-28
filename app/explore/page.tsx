import type { Metadata } from "next";
import { getCountries, getFields } from "@/lib/service";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Select a country, field, and year to see how many job vacancies exist per graduate and understand the supply-demand balance in your chosen market.",
};

export default function ExplorePage() {
  const countries = getCountries();
  const fields    = getFields();
  return (
    <div className="bg-white min-h-screen">
      {/* Page header */}
      <div className="mx-auto max-w-5xl px-6 sm:px-12 pt-14 pb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Explore the Market
        </p>
        <h1
          className="font-bold leading-tight tracking-tight text-neutral-900"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
        >
          How many job opportunities are there for graduates in this field?
        </h1>
      </div>

      {/* Interactive content — client component manages its own layout */}
      <ExploreClient countries={countries} fields={fields} />
    </div>
  );
}
