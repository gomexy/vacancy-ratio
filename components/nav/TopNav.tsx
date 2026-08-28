"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/explore",     label: "Explore" },
  { href: "/compare",     label: "Compare" },
  { href: "/methodology", label: "Methodology" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#ebebeb]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 sm:px-12" style={{ height: 64 }}>

        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-1.5 group">
          {/* Green dot — single use of accent colour */}
          <span
            className="inline-block h-2 w-2 rounded-full flex-shrink-0"
            style={{ background: "#22c55e" }}
          />
          <span className="text-sm font-semibold text-neutral-900 tracking-tight group-hover:text-neutral-600 transition-colors">
            VacancyRatio
          </span>
        </Link>

        {/* Nav links + CTA */}
        <div className="flex items-center gap-8">
          <nav className="hidden sm:flex items-center gap-7">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "text-sm transition-colors",
                    active
                      ? "text-neutral-900 font-medium"
                      : "text-neutral-400 hover:text-neutral-800"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Primary CTA */}
          <Link
            href="/explore"
            className="inline-flex h-8 items-center rounded-md bg-neutral-900 px-4 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Explore data
          </Link>
        </div>
      </div>
    </header>
  );
}
