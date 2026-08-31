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
    <div style={{ background: "#F0F0F0" }} className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 sm:px-12 pt-14 pb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Compare Fields
        </p>
        <h1
          className="font-bold leading-tight tracking-tight text-neutral-900"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
        >
          Which field has the strongest job availability relative to graduates?
        </h1>
      </div>
      <CompareClient countries={countries} fields={fields} years={AVAILABLE_YEARS} />
    </div>
  );
}
