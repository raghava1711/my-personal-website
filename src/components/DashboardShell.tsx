"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { dashboardNav } from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";

type SearchItem = { id: string; title: string; subtitle: string | null; type: string | null };

export function DashboardShell({ children, user }: { children: ReactNode; user: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function search(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
    const data = (await response.json().catch(() => ({ items: [] }))) as { items: SearchItem[] };
    setResults(data.items || []);
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-[var(--line)] bg-[var(--card)] p-4 backdrop-blur-2xl">
      <Link href="/dashboard" className="mb-6 flex items-center gap-3 px-2 font-semibold"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white">R</span><span>RAGHAVENDRA<br /><small className="font-normal text-[var(--muted)]">Workspace</small></span></Link>
      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto" aria-label="Dashboard navigation">
        {dashboardNav.map(([label, href, icon]) => {
          const active = pathname === href;
          return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-[var(--muted)] hover:bg-blue-500/10 hover:text-[var(--foreground)]"}`}><span className="w-6 text-center text-xs">{icon}</span>{label}</Link>;
        })}
      </nav>
      <button onClick={logout} className="mt-4 rounded-2xl border border-[var(--line)] px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-500/10">Logout</button>
    </aside>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
      <div className="fixed inset-y-0 left-0 z-50 hidden lg:block">{sidebar}</div>
      {open && <div className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden" onClick={() => setOpen(false)}><div className="h-full" onClick={(event) => event.stopPropagation()}>{sidebar}</div></div>}
      <div className="lg:col-start-2">
        <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--background)]/85 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="rounded-xl border border-[var(--line)] p-2 lg:hidden" aria-label="Open dashboard menu">☰</button>
            <div className="relative max-w-xl flex-1">
              <label className="sr-only" htmlFor="global-search">Search workspace</label>
              <input id="global-search" value={query} onChange={(event) => search(event.target.value)} placeholder="Search projects, documents, notes, applications..." className="w-full rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-2.5 text-sm" />
              {results.length > 0 && <div className="absolute left-0 right-0 top-12 z-50 max-h-80 overflow-auto rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] p-2 shadow-2xl">{results.map((item) => <div key={`${item.type}-${item.id}`} className="rounded-xl px-3 py-2 text-sm hover:bg-blue-500/10"><strong>{item.title}</strong><p className="truncate text-xs text-[var(--muted)]">{item.type || 'Result'} · {item.subtitle}</p></div>)}</div>}
            </div>
            <button className="hidden rounded-2xl border border-[var(--line)] px-3 py-2 text-sm sm:inline-flex" aria-label="Notifications">🔔</button>
            <ThemeToggle compact />
            <div className="hidden items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 sm:flex"><span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">{user.name.slice(0, 1)}</span><span className="text-sm"><strong>{user.name}</strong><br /><small className="text-[var(--muted)]">{user.email}</small></span></div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
