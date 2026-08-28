import { getCountries, getFields } from "@/lib/service";
import ExploreClient from "./ExploreClient";

export const metadata = {
  title: "Explore Market — VacancyRatio",
};

export default function ExplorePage() {
  const countries = getCountries();
  const fields = getFields();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Explore the Market
        </h1>
        <p className="mt-2 text-neutral-500">
          Select a country, field, and year to see the vacancy-to-graduate ratio.
        </p>
      </div>
      <ExploreClient countries={countries} fields={fields} />
    </div>
  );
}
