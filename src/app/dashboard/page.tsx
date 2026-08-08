import { and, count, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { certificates, codingProblems, documents, goals, jobApplications, learningTopics, notes, projects } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const [documentCount, projectCount, certificateCount, jobCount, solvedCount, activeGoalCount, recentDocs, recentProjects, upcomingInterviews, recentNotes, learning, goalRows] = await Promise.all([
    db.select({ value: count() }).from(documents).where(eq(documents.userId, user.id)),
    db.select({ value: count() }).from(projects),
    db.select({ value: count() }).from(certificates),
    db.select({ value: count() }).from(jobApplications).where(eq(jobApplications.userId, user.id)),
    db.select({ value: count() }).from(codingProblems).where(and(eq(codingProblems.userId, user.id), eq(codingProblems.status, "Solved"))),
    db.select({ value: count() }).from(goals).where(and(eq(goals.userId, user.id), eq(goals.status, "Active"))),
    db.select().from(documents).where(eq(documents.userId, user.id)).orderBy(desc(documents.createdAt)).limit(5),
    db.select().from(projects).orderBy(desc(projects.createdAt)).limit(5),
    db.select().from(jobApplications).where(and(eq(jobApplications.userId, user.id), gt(jobApplications.interviewDate, new Date()))).orderBy(jobApplications.interviewDate).limit(5),
    db.select().from(notes).where(eq(notes.userId, user.id)).orderBy(desc(notes.updatedAt)).limit(5),
    db.select().from(learningTopics).where(eq(learningTopics.userId, user.id)).orderBy(desc(learningTopics.progress)).limit(6),
    db.select().from(goals).where(eq(goals.userId, user.id)).orderBy(desc(goals.updatedAt)).limit(4),
  ]);

  const cards = [
    ["Total Documents", documentCount[0]?.value ?? 0, "Private files"],
    ["Total Projects", projectCount[0]?.value ?? 0, "Public portfolio"],
    ["Certificates", certificateCount[0]?.value ?? 0, "Credential library"],
    ["Job Applications", jobCount[0]?.value ?? 0, "Career tracker"],
    ["Coding Problems Solved", solvedCount[0]?.value ?? 0, "Practice progress"],
    ["Current Goals", activeGoalCount[0]?.value ?? 0, "Active objectives"],
  ];

  return (
    <div className="grid gap-6">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Dashboard</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Welcome back, {user.name}</h1><p className="mt-2 text-[var(--muted)]">Your private control center for career, learning, documents, and public website content.</p></div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, subtitle]) => <article key={label} className="glass rounded-[1.5rem] p-5"><p className="text-sm text-[var(--muted)]">{label}</p><h2 className="mt-3 text-3xl font-semibold">{value}</h2><p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p></article>)}
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="Recent Documents" items={recentDocs.map((item) => `${item.name} · ${item.extension.toUpperCase()} · ${formatDate(item.createdAt)}`)} empty="No documents found." />
        <Panel title="Recent Projects" items={recentProjects.map((item) => `${item.title}${item.sample ? ' · sample' : ''}`)} empty="No projects yet." />
        <Panel title="Upcoming Interviews" items={upcomingInterviews.map((item) => `${item.company} · ${item.role} · ${formatDate(item.interviewDate)}`)} empty="No upcoming interviews." />
        <Panel title="Recent Notes" items={recentNotes.map((item) => `${item.title} · ${item.category}`)} empty="No notes yet." />
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass rounded-[1.5rem] p-5"><h2 className="text-xl font-semibold">Learning Progress</h2><div className="mt-5 grid gap-4">{learning.map((item) => <div key={item.id}><div className="flex justify-between text-sm"><span>{item.topic}</span><span>{item.progress}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${item.progress}%` }} /></div></div>)}</div></div>
        <div className="glass rounded-[1.5rem] p-5"><h2 className="text-xl font-semibold">Goals</h2><div className="mt-5 grid gap-4">{goalRows.map((item) => <div key={item.id} className="rounded-2xl border border-[var(--line)] p-4"><div className="flex justify-between gap-4"><strong>{item.title}</strong><span className="text-sm text-[var(--muted)]">{item.progress}%</span></div><p className="mt-1 text-sm text-[var(--muted)]">{item.status} · {formatDate(item.deadline)}</p></div>)}</div></div>
      </section>
    </div>
  );
}

function Panel({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return <div className="glass rounded-[1.5rem] p-5"><h2 className="text-xl font-semibold">{title}</h2><div className="mt-4 grid gap-3">{items.length ? items.map((item) => <p key={item} className="rounded-2xl border border-[var(--line)] px-4 py-3 text-sm text-[var(--muted)]">{item}</p>) : <p className="rounded-2xl border border-dashed border-[var(--line)] px-4 py-8 text-center text-sm text-[var(--muted)]">{empty}</p>}</div></div>;
}
