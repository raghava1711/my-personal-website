"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      event.currentTarget.reset();
      setStatus("success");
    } else {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Unable to send message.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4" aria-label="Contact form">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Name
          <input required name="name" className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" placeholder="Your name" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input required type="email" name="email" className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" placeholder="you@example.com" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Subject
        <input required name="subject" className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" placeholder="Opportunity, collaboration, or question" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Message
        <textarea required minLength={10} name="message" rows={5} className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" placeholder="Write your message..." />
      </label>
      <button disabled={status === "loading"} className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60">
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "success" && <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-300">Message sent successfully!</p>}
      {status === "error" && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</p>}
    </form>
  );
}
