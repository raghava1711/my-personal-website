import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts, certificates, projects } from "@/db/schema";
import { PublicNav } from "@/components/PublicNav";
import { ensureSeedData } from "@/lib/seed";
import { skillGroups } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  await ensureSeedData();
  const [projectItems, certificateItems, postItems] = await Promise.all([
    db.select().from(projects).orderBy(desc(projects.featured), desc(projects.createdAt)).limit(5),
    db.select().from(certificates).orderBy(desc(certificates.issuedAt)).limit(5),
    db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt)).limit(3),
  ]);

  return (
    <div className="min-h-screen">
      <PublicNav />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <section className="glass mx-auto max-w-5xl rounded-[2rem] p-8 sm:p-12">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Resume Preview</p>
              <h1 className="mt-3 text-5xl font-semibold tracking-tight">Raghavendra</h1>
              <p className="mt-3 text-xl text-[var(--muted)]">Software Engineer | Java Backend Developer</p>
            </div>
            <a href="/api/resume/download" className="rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white">Download Resume</a>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="grid gap-6">
              <div><h2 className="text-lg font-semibold">Contact</h2><p className="mt-3 text-sm text-[var(--muted)]">raghavendra@example.com<br />LinkedIn and GitHub placeholders<br />India</p></div>
              <div><h2 className="text-lg font-semibold">Skills</h2><div className="mt-3 flex flex-wrap gap-2">{skillGroups.flatMap((group) => group.skills).slice(0, 18).map((skill) => <span key={skill} className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-700 dark:text-cyan-200">{skill}</span>)}</div></div>
              <div><h2 className="text-lg font-semibold">Education</h2><p className="mt-3 text-sm text-[var(--muted)]">Engineering Degree<br />College and graduation details to be updated with verified information.</p></div>
            </aside>
            <div className="grid gap-8">
              <section><h2 className="text-2xl font-semibold">Profile Summary</h2><p className="mt-3 leading-7 text-[var(--muted)]">Software engineer focused on Java backend development, REST APIs, SQL databases, full-stack applications, clean architecture, and continuous problem-solving practice.</p></section>
              <section><h2 className="text-2xl font-semibold">Projects</h2><div className="mt-4 grid gap-4">{projectItems.map((project) => <div key={project.id} className="rounded-2xl border border-[var(--line)] p-4"><h3 className="font-semibold">{project.title}</h3><p className="mt-1 text-sm text-[var(--muted)]">{project.description}</p></div>)}</div></section>
              <section><h2 className="text-2xl font-semibold">Certifications</h2><ul className="mt-4 grid gap-2 text-sm text-[var(--muted)]">{certificateItems.map((certificate) => <li key={certificate.id}>{certificate.name} — {certificate.issuer} ({formatDate(certificate.issuedAt)})</li>)}</ul></section>
              <section><h2 className="text-2xl font-semibold">Technical Writing</h2><ul className="mt-4 grid gap-2 text-sm text-[var(--muted)]">{postItems.map((post) => <li key={post.id}>{post.title}</li>)}</ul></section>
            </div>
          </div>
          <p className="mt-10 rounded-2xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-200">This preview contains clearly marked placeholders. Replace personal data and upload the final resume from the private dashboard.</p>
          <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-blue-600 dark:text-cyan-300">← Back to website</Link>
        </section>
      </main>
    </div>
  );
}
