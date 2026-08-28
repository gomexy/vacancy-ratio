"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/explore",          label: "Explore" },
  { href: "/compare",          label: "Compare" },
  { href: "/location-compare", label: "Locations" },
  { href: "/jobs",             label: "Jobs" },
  { href: "/methodology",      label: "Methodology" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#ebebeb]">
      <div
        className="mx-auto flex max-w-5xl items-center justify-between px-6 sm:px-12"
        style={{ height: 64 }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-1.5 group flex-shrink-0"
          onClick={() => setOpen(false)}
        >
          <span
            className="inline-block h-2 w-2 rounded-full flex-shrink-0"
            style={{ background: "#22c55e" }}
          />
          <span className="text-sm font-semibold text-neutral-900 tracking-tight group-hover:text-neutral-600 transition-colors">
            VacancyRatio
          </span>
        </Link>

        {/* Desktop nav + CTA */}
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6">
            {links.map((l) => {
              const active =
                pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "text-sm transition-colors whitespace-nowrap",
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

          {/* CTA — desktop */}
          <Link
            href="/explore"
            className="hidden sm:inline-flex h-8 items-center rounded-md bg-neutral-900 px-4 text-xs font-medium text-white transition-colors hover:bg-neutral-700 flex-shrink-0"
          >
            Explore data
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lg:hidden flex items-center justify-center p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="3" x2="15" y2="15" />
                <line x1="15" y1="3" x2="3" y2="15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="2" y1="5" x2="16" y2="5" />
                <line x1="2" y1="9" x2="16" y2="9" />
                <line x1="2" y1="13" x2="16" y2="13" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden border-t border-[#ebebeb] bg-white">
          <div className="flex flex-col px-6 py-4 gap-0">
            {links.map((l) => {
              const active =
                pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "py-3.5 text-sm border-b border-neutral-100 last:border-0 transition-colors",
                    active
                      ? "text-neutral-900 font-medium"
                      : "text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/explore"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Explore data
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
