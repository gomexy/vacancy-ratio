"use client";

import { useState, useMemo } from "react";
import JobCard from "@/components/jobs/JobCard";
import Select from "@/components/ui/Select";
import DataStatusBadge from "@/components/ui/DataStatusBadge";
import type { Country, Field, VacancyRecord } from "@/lib/types";

const CONTAINER = "mx-auto max-w-5xl px-6 sm:px-12";

interface Props {
  countries:  Country[];
  fields:     Field[];
  listings:   VacancyRecord[];
}

export default function JobsClient({ countries, fields, listings }: Props) {
  const [country, setCountry] = useState<string>("ALL");
  const [field,   setField]   = useState<string>("ALL");

  const countryOptions = [
    { value: "ALL", label: "All countries" },
    ...countries.map((c) => ({ value: c.code, label: c.name })),
  ];
  const fieldOptions = [
    { value: "ALL", label: "All fields" },
    ...fields.map((f) => ({ value: f.slug, label: f.label })),
  ];

  const filtered = useMemo(() => {
    return listings.filter(
      (l) =>
        (country === "ALL" || l.country === country) &&
        (field   === "ALL" || l.field   === field)
    );
  }, [listings, country, field]);

  const isDemo = listings.every((l) => l.isDemo);

  return (
    <div>
      {/* Filter bar */}
      <div style={{ borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb" }}>
        <div className={CONTAINER}>
          <div
            className="my-6 rounded-xl px-6 py-5"
            style={{ background: "#f7f7f7", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 flex-1">
                <Select
                  label="Country"
                  value={country}
                  options={countryOptions}
                  onChange={setCountry}
                />
                <Select
                  label="Field"
                  value={field}
                  options={fieldOptions}
                  onChange={setField}
                />
              </div>
              <div className="flex items-center gap-3">
                <DataStatusBadge isDemo={isDemo} source="Demo (illustrative)" />
                <p className="text-xs text-neutral-400">
                  {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings grid */}
      <div className={`${CONTAINER} py-10`}>
        {filtered.length === 0 ? (
          <div className="py-16">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300 mb-2">
              No results
            </p>
            <p className="text-sm text-neutral-400">
              No demo listings for this combination. Try a different country or field.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Provider note */}
        <div className="mt-12 pt-8 border-t border-neutral-100">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
            Data provider
          </p>
          <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
            All listings above are illustrative demo data. To show real job postings,
            connect a live data provider (e.g. Adzuna) by setting{" "}
            <code className="rounded bg-neutral-100 px-1 font-mono text-neutral-600">
              ADZUNA_APP_ID
            </code>{" "}
            and{" "}
            <code className="rounded bg-neutral-100 px-1 font-mono text-neutral-600">
              ADZUNA_API_KEY
            </code>{" "}
            in your environment. The provider architecture is ready — no UI changes required.
          </p>
        </div>
      </div>
    </div>
  );
}
