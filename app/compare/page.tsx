import { getCountries, getFields } from "@/lib/service";
import CompareClient from "./CompareClient";

export const metadata = {
  title: "Compare Fields — VacancyRatio",
};

const AVAILABLE_YEARS = [2021, 2022, 2023, 2024];

export default function ComparePage() {
  const countries = getCountries();
  const fields = getFields();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Compare Fields
        </h1>
        <p className="mt-2 text-neutral-500">
          Select multiple fields to compare vacancy ratios side by side.
        </p>
      </div>
      <CompareClient countries={countries} fields={fields} years={AVAILABLE_YEARS} />
    </div>
  );
}
