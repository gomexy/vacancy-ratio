import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-xs text-neutral-400">
          VacancyRatio — illustrative data only. Not financial or career advice.
        </p>
        <nav className="flex gap-4">
          {[
            { href: "/explore", label: "Explore" },
            { href: "/compare", label: "Compare" },
            { href: "/methodology", label: "Methodology" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-xs text-neutral-400 hover:text-neutral-700">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
