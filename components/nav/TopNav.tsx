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
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-neutral-900 hover:text-neutral-600 transition-colors"
        >
          Vacancy<span className="text-neutral-400 font-normal">Ratio</span>
        </Link>

        <nav className="flex items-center gap-7">
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
                    : "text-neutral-400 hover:text-neutral-700"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
