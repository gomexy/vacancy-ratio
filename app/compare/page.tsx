import type { Metadata } from "next";
import { getCountries, getFields } from "@/lib/service";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Compare vacancy ratios across multiple fields side by side. Identify which disciplines have the strongest job availability relative to their graduate supply.",
};

const AVAILABLE_YEARS = [2021, 2022, 2023, 2024];

export default function ComparePage() {
  const countries = getCountries();
  const fields    = getFields();
  return (
    <div className="flex flex-col gap-0">
      <div className="pb-10 border-b border-neutral-200">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Compare Fields
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 leading-snug sm:text-4xl max-w-xl">
          Which field has the strongest job availability relative to graduates?
        </h1>
      </div>
      <CompareClient countries={countries} fields={fields} years={AVAILABLE_YEARS} />
    </div>
  );
}
