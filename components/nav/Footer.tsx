import Link from "next/link";

const nav = [
  { href: "/explore",     label: "Explore" },
  { href: "/compare",     label: "Compare" },
  { href: "/methodology", label: "Methodology" },
];

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-neutral-200">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-tight text-neutral-900">
            Vacancy<span className="text-neutral-400 font-normal">Ratio</span>
          </p>
          <p className="text-xs text-neutral-400">
            Illustrative demo data only. Not financial or career advice.
          </p>
        </div>
        <nav className="flex gap-6">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
