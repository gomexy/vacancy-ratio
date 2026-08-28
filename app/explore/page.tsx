import type { Metadata } from "next";
import { getCountries, getFields } from "@/lib/service";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Select a country, field, and year to see how many job vacancies exist per graduate — and understand the supply-demand balance in your chosen market.",
};

export default function ExplorePage() {
  const countries = getCountries();
  const fields = getFields();
  return (
    <div className="flex flex-col gap-0">
      <div className="pb-10 border-b border-neutral-200">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Explore the Market
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 leading-snug sm:text-4xl max-w-xl">
          How many job opportunities are there for graduates in this field?
        </h1>
      </div>
      <ExploreClient countries={countries} fields={fields} />
    </div>
  );
}
