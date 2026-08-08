"use client";

import Link from "next/link";
import { useState } from "react";
import { publicNav } from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";

export function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--background)]/80 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Public navigation">
        <Link href="/#home" className="flex items-center gap-3 font-semibold tracking-tight text-[var(--foreground)]">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-blue-500/20">R</span>
          <span>RAGHAVENDRA</span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {publicNav.map(([label, href]) => (
            <a key={label} href={href} className="rounded-full px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-blue-500/10 hover:text-[var(--foreground)]">
              {label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle compact />
          <Link href="/login" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-blue-700 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-100">
            Login
          </Link>
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-xl border border-[var(--line)] p-2 lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label="Open menu">
          <span className="block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-[var(--line)] px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {publicNav.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--muted)] hover:bg-blue-500/10 hover:text-[var(--foreground)]">
                {label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3 px-1">
              <ThemeToggle />
              <Link href="/login" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Login</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
