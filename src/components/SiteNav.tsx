"use client";

import Link from "next/link";
import { useState } from "react";
import { navItems } from "../../content/navigation";
import { profile } from "../../content/profile";

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <nav
        className="mx-auto flex w-full max-w-6xl flex-col px-6 sm:px-8 lg:px-12"
        aria-label="Primary"
      >
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="no-underline" onClick={handleLinkClick}>
            <span className="flex items-center gap-3">
              <span className="font-[var(--font-display)] text-xl tracking-tight">
                {profile.name}
              </span>
              <span className="hidden text-xs uppercase tracking-[0.3em] text-muted sm:inline">
                {profile.descriptor}
              </span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 text-[0.7rem] uppercase tracking-[0.32em] md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative no-underline text-muted transition-colors hover:text-foreground"
              >
                <span>{item.label}</span>
                <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            Menu
            <span className="flex flex-col items-end gap-1">
              <span
                className={`h-[2px] w-6 bg-foreground transition-transform duration-200 ${
                  menuOpen ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[2px] w-4 bg-foreground transition-transform duration-200 ${
                  menuOpen ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
        <div
          id="mobile-menu"
          className={`overflow-hidden transition-[max-height,opacity] duration-300 md:hidden ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 border-t border-border py-6 text-[0.7rem] uppercase tracking-[0.32em]">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="no-underline text-muted transition-colors hover:text-foreground"
                onClick={handleLinkClick}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
