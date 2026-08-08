"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    if (response.ok) {
      router.push("/dashboard");
      router.refresh();
      return;
    }
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    setError(data.error || "Unable to login.");
    setStatus("error");
  }

  return (
    <div className="glass w-full max-w-md rounded-[2rem] p-6 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white">R</span> RAGHAVENDRA</Link>
        <ThemeToggle compact />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Private workspace login</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Access your documents, notes, projects, learning, applications, goals, expenses, calendar, and website content management.</p>
      <form onSubmit={submit} className="mt-8 grid gap-4">
        <label className="grid gap-2 text-sm font-medium">Email<input required type="email" name="email" className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" placeholder="raghavendra@example.com" /></label>
        <label className="grid gap-2 text-sm font-medium">Password<input required type="password" name="password" className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" placeholder="••••••••" /></label>
        <button disabled={status === "loading"} className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-60">{status === "loading" ? "Logging in..." : "Login"}</button>
      </form>
      <button type="button" onClick={() => setForgot((value) => !value)} className="mt-4 text-sm font-semibold text-blue-600 dark:text-cyan-300">Forgot Password</button>
      {forgot && <p className="mt-3 rounded-2xl bg-blue-500/10 px-4 py-3 text-sm text-[var(--muted)]">For this private owner workspace, reset the password by updating ADMIN_PASSWORD in your environment and changing it again from Settings after login.</p>}
      {status === "error" && <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</p>}
      <p className="mt-6 text-xs leading-5 text-[var(--muted)]">Initial sandbox owner credentials are seeded from ADMIN_EMAIL and ADMIN_PASSWORD. If unset: raghavendra@example.com / ChangeMe@123. Change immediately in production.</p>
    </div>
  );
}
