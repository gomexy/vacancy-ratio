import type { VacancyRecord } from "@/lib/types";
import DataStatusBadge from "@/components/ui/DataStatusBadge";

interface Props {
  job: VacancyRecord;
}

function daysAgo(isoDate: string): string {
  const posted = new Date(isoDate);
  const now    = new Date("2024-11-28"); // anchored to demo data date
  const diff   = Math.floor((now.getTime() - posted.getTime()) / 86_400_000);
  if (diff <= 0)  return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 30)  return `${diff}d ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}

function fmtSalary(min?: number, max?: number, currency?: string): string | null {
  if (!min && !max) return null;
  const sym =
    currency === "USD" ? "$"
    : currency === "GBP" ? "£"
    : currency === "EUR" ? "€"
    : currency === "AUD" ? "A$"
    : "₹";
  const fmtNum = (n: number) =>
    n >= 100_000
      ? `${sym}${(n / 100_000).toFixed(1)}L`
      : n >= 1_000
      ? `${sym}${(n / 1_000).toFixed(0)}K`
      : `${sym}${n}`;
  if (min && max) return `${fmtNum(min)} – ${fmtNum(max)}`;
  return fmtNum(min ?? max!);
}

export default function JobCard({ job }: Props) {
  const salary = fmtSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <div
      className="bg-white rounded-xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-[var(--shadow-md)] group"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-neutral-700 transition-colors">
            {job.title}
          </p>
          <p className="text-xs text-neutral-500 mt-0.5">{job.company}</p>
        </div>
        <DataStatusBadge isDemo={job.isDemo} source={job.isDemo ? undefined : job.source} />
      </div>

      {/* Location + date */}
      <div className="flex items-center gap-3 text-xs text-neutral-400">
        <span>{job.cityName ?? job.city ?? job.country}</span>
        {job.cityName && (
          <>
            <span className="text-neutral-200">·</span>
            <span>{job.country}</span>
          </>
        )}
        <span className="text-neutral-200">·</span>
        <span>{daysAgo(job.postedAt)}</span>
        {salary && (
          <>
            <span className="text-neutral-200">·</span>
            <span className="font-medium text-neutral-500">{salary}</span>
          </>
        )}
      </div>

      {/* Skills */}
      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 6).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-neutral-50 border border-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-500"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Source link */}
      {job.sourceUrl ? (
        <a
          href={job.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-[10px] text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2"
        >
          View on {job.source} →
        </a>
      ) : (
        <p className="mt-1 text-[10px] text-neutral-300 font-mono">{job.source}</p>
      )}
    </div>
  );
}
