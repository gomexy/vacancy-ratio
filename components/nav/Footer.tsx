import Link from "next/link";

const nav = [
  { href: "/explore",          label: "Explore" },
  { href: "/outlook",          label: "Outlook" },
  { href: "/compare",          label: "Compare" },
  { href: "/location-compare", label: "Locations" },
  { href: "/methodology",      label: "Methodology" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#F8F8F8", borderTop: "1px solid #EBEBEB" }}>
      <div className="mx-auto max-w-5xl px-6 sm:px-12 pt-14 pb-10">

        {/* Top row */}
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full flex-shrink-0" style={{ background: "#22c55e" }} />
              <span className="text-sm font-semibold text-neutral-900 tracking-tight">VacancyRatio</span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              Graduate career-market intelligence. Understand job demand relative
              to graduate supply — by field, location and year.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300">Pages</p>
            {nav.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-neutral-400 hover:text-neutral-800 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

        </div>

        {/* Divider + bottom row */}
        <div className="mt-12 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" style={{ borderTop: "1px solid #EBEBEB" }}>
          <p className="text-xs text-neutral-400">
            Illustrative demo data only. Not financial or career advice. Real data providers can be connected — see Methodology.
          </p>
          <p className="text-xs text-neutral-300">
            © {new Date().getFullYear()} VacancyRatio
          </p>
        </div>

      </div>
    </footer>
  );
}
