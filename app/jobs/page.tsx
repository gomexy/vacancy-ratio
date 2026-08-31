import type { Metadata } from "next";
import { getCountries, getFields } from "@/lib/service";
import { MOCK_LISTINGS } from "@/lib/data/mock-vacancies";
import JobsClient from "./JobsClient";

export const metadata: Metadata = {
  title: "Job Opportunities",
  description:
    "Browse illustrative job listings across fields and locations. See the skills employers are asking for and understand where demand is concentrated.",
};

export default function JobsPage() {
  const countries = getCountries();
  const fields    = getFields();

  return (
    <div style={{ background: "#F0F0F0" }} className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 sm:px-12 pt-14 pb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Job Opportunities
        </p>
        <h1
          className="font-bold leading-tight tracking-tight text-neutral-900"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
        >
          What roles are employers posting?
        </h1>
        <p className="mt-3 text-sm text-neutral-500 max-w-xl leading-relaxed">
          Browse job listings by field and location. Each listing shows the skills
          employers are asking for. Connect a real data provider to see live postings.
        </p>
      </div>
      <JobsClient countries={countries} fields={fields} listings={MOCK_LISTINGS} />
    </div>
  );
}
