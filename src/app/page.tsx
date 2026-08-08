import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts, certificates, projects } from "@/db/schema";
import { ContactForm } from "@/components/ContactForm";
import { PublicNav } from "@/components/PublicNav";
import { skillGroups } from "@/lib/constants";
import { ensureSeedData } from "@/lib/seed";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const socialLinks = [
  ["GitHub", "https://github.com/"],
  ["LinkedIn", "https://linkedin.com/"],
  ["Email", "mailto:raghavendra@example.com"],
] as const;

export default async function HomePage() {
  await ensureSeedData();
  const [projectItems, certificateItems, blogItems] = await Promise.all([
    db.select().from(projects).orderBy(desc(projects.featured), desc(projects.createdAt)),
    db.select().from(certificates).orderBy(desc(certificates.issuedAt)),
    db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt)).limit(6),
  ]);

  return (
    <div className="min-h-screen">
      <PublicNav />
      <main>
        <section id="home" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.03fr_0.97fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Available for Java backend opportunities
              </div>
              <p className="text-lg font-semibold text-[var(--muted)]">Hi, I&apos;m Raghavendra</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                Software Engineer<br />
                <span className="gradient-text">Java Full Stack Developer</span><br />
                Java Backend Developer
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                I build reliable backend applications, REST APIs, and modern web applications while continuously improving my problem-solving and software engineering skills.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#projects" className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-xl shadow-blue-500/20">View My Projects</a>
                <a href="/api/resume/download" className="rounded-full border border-[var(--line)] bg-[var(--card)] px-6 py-3 text-center text-sm font-semibold">Download Resume</a>
                <a href="#contact" className="rounded-full px-6 py-3 text-center text-sm font-semibold text-blue-600 dark:text-cyan-300">Contact Me</a>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map(([label, href]) => (
                  <a key={label} href={href} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--muted)] hover:border-blue-400 hover:text-[var(--foreground)]">
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="glass tech-orbit relative min-h-[520px] overflow-hidden rounded-[2rem] p-6">
              <div className="absolute inset-x-8 top-8 rounded-3xl border border-[var(--line)] bg-slate-950 p-5 font-mono text-sm text-slate-200 shadow-2xl">
                <div className="mb-4 flex gap-2"><i className="h-3 w-3 rounded-full bg-red-400" /><i className="h-3 w-3 rounded-full bg-yellow-400" /><i className="h-3 w-3 rounded-full bg-emerald-400" /></div>
                <p><span className="text-cyan-300">class</span> RaghavendraEngineer {'{'}</p>
                <p className="pl-4"><span className="text-blue-300">stack</span> = [Java, SpringBoot, SQL];</p>
                <p className="pl-4"><span className="text-blue-300">focus</span> = buildReliableAPIs();</p>
                <p>{'}'}</p>
              </div>
              {['Java', 'Spring Boot', 'MySQL', 'JavaScript', 'Git', 'GitHub'].map((tech, index) => (
                <span key={tech} className="absolute rounded-2xl border border-white/20 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 shadow-xl dark:bg-slate-900/80 dark:text-slate-100" style={{ left: `${12 + (index % 2) * 58}%`, top: `${38 + index * 8}%` }}>
                  {tech}
                </span>
              ))}
              <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-2xl">
                <p className="text-sm uppercase tracking-[0.2em] text-blue-100">Private Workspace</p>
                <h2 className="mt-2 text-3xl font-semibold">Portfolio + documents + career tracker</h2>
                <p className="mt-3 text-sm text-blue-50">A secure dashboard powers every public content block and personal productivity workflow.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass rounded-[2rem] p-6">
              <div className="grid aspect-square place-items-center rounded-[1.5rem] border border-dashed border-blue-400/40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-center">
                <div>
                  <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-4xl font-bold text-white">R</div>
                  <p className="mt-5 text-sm text-[var(--muted)]">Profile image placeholder — replace from Settings later.</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">About me</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Engineering mindset. Backend focus. Continuous growth.</h2>
              <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
                I am building my professional journey around software engineering, Java backend development, full-stack web applications, and real-world project practice. My interests include clean REST API design, databases, authentication, problem-solving, and maintainable systems.
              </p>
              <div id="experience" className="mt-8 grid gap-4">
                {['Engineering', 'Graduation', 'Java Full Stack Learning', 'Backend Development', 'Real-world Projects', 'Software Engineering Career'].map((item, index) => (
                  <div key={item} className="flex gap-4 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-500/10 font-semibold text-blue-600 dark:text-cyan-300">{index + 1}</div>
                    <div><h3 className="font-semibold">{item}</h3><p className="text-sm text-[var(--muted)]">Professional milestone placeholder to refine with your exact dates and details.</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Skills</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Technology stack and engineering fundamentals</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {skillGroups.map((group) => (
                <article key={group.title} className="glass rounded-[1.75rem] p-6">
                  <h3 className="text-lg font-semibold">{group.title}</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.skills.map((skill) => <span key={skill} className="rounded-full border border-[var(--line)] bg-blue-500/5 px-3 py-1.5 text-sm text-[var(--muted)]">{skill}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Projects</p><h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Dynamic project showcase</h2></div>
              <Link href="/login" className="rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold">Manage in dashboard</Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projectItems.map((project, index) => (
                <article key={project.id} className="glass group overflow-hidden rounded-[2rem]">
                  <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-6 text-white">
                    <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs">{project.sample ? 'Sample' : 'Live'}</span>
                    <div className="text-center"><p className="text-sm uppercase tracking-[0.2em] text-blue-100">Project {index + 1}</p><h3 className="mt-2 text-2xl font-semibold">{project.title}</h3></div>
                  </div>
                  <div className="p-6">
                    <p className="min-h-20 text-sm leading-6 text-[var(--muted)]">{project.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">{project.technologies.map((tech) => <span key={tech} className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-700 dark:text-cyan-200">{tech}</span>)}</div>
                    <div className="mt-6 flex gap-3"><a href={project.githubUrl || '#'} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold">GitHub</a><a href={project.liveUrl || '#'} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">Live Demo</a></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Education</p>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="glass rounded-[2rem] p-8 lg:col-span-2"><h2 className="text-3xl font-semibold">Engineering Degree</h2><p className="mt-4 text-[var(--muted)]">College information, graduation details, and academic highlights are intentionally structured as placeholders so you can replace them with verified personal information.</p><div className="mt-6 flex flex-wrap gap-2">{['Java', 'SQL', 'Software Engineering', 'Data Structures', 'Research Project'].map((item) => <span key={item} className="rounded-full bg-blue-500/10 px-3 py-1.5 text-sm text-blue-700 dark:text-cyan-200">{item}</span>)}</div></div>
              <div className="glass rounded-[2rem] p-8"><p className="text-sm text-[var(--muted)]">Graduation</p><h3 className="mt-2 text-2xl font-semibold">Update exact year</h3><p className="mt-4 text-sm text-[var(--muted)]">Use Settings and content management pages to evolve this into your verified academic profile.</p></div>
            </div>
          </div>
        </section>

        <section id="certificates" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Certifications</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Certificates and continuous learning</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {certificateItems.map((certificate) => (
                <article key={certificate.id} className="glass rounded-[1.75rem] p-5">
                  <div className="grid aspect-video place-items-center rounded-3xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 text-sm text-[var(--muted)]">Certificate image</div>
                  <h3 className="mt-5 text-lg font-semibold">{certificate.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{certificate.issuer}</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">{formatDate(certificate.issuedAt)}</p>
                  <a href={certificate.certificateUrl || '#'} className="mt-4 inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold">View Certificate</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="resume" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="glass rounded-[2rem] p-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Resume</p><h2 className="mt-3 text-4xl font-semibold">Professional resume overview</h2><p className="mt-5 text-[var(--muted)]">Profile summary, skills, education, projects, certifications, and experience are presented in a recruiter-friendly format. Upload your real PDF from the private dashboard and mark it as your active resume.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href="/api/resume/download" className="rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white">Download Resume</a><Link href="/resume" className="rounded-full border border-[var(--line)] px-5 py-3 text-center text-sm font-semibold">Preview Resume</Link></div></div>
            <div className="glass rounded-[2rem] p-8"><h3 className="text-xl font-semibold">Resume sections</h3><ul className="mt-5 grid gap-3 text-sm text-[var(--muted)]">{['Profile summary', 'Skills', 'Education', 'Projects', 'Experience placeholders', 'Certifications'].map((item) => <li key={item} className="rounded-2xl border border-[var(--line)] px-4 py-3">{item}</li>)}</ul></div>
          </div>
        </section>

        <section id="blog" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Blog</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Technical writing and learning notes</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {blogItems.map((post) => (
                <article key={post.id} className="glass rounded-[1.75rem] p-6">
                  <div className="mb-5 grid aspect-video place-items-center rounded-3xl bg-gradient-to-br from-slate-950 to-blue-700 text-sm text-white">{post.category}</div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">{post.category} · {formatDate(post.createdAt)}</p>
                  <h3 className="mt-3 text-xl font-semibold">{post.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-blue-600 dark:text-cyan-300">Read More →</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Contact</p><h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Let&apos;s connect professionally</h2><div className="mt-8 grid gap-3 text-[var(--muted)]"><p>Email: raghavendra@example.com</p><p>LinkedIn: linkedin.com/in/your-profile</p><p>GitHub: github.com/your-profile</p><p>Location: India</p></div></div>
            <div className="glass rounded-[2rem] p-6"><ContactForm /></div>
          </div>
        </section>
      </main>
      <footer className="border-t border-[var(--line)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div><h2 className="text-xl font-semibold">Raghavendra</h2><p className="mt-2 text-sm text-[var(--muted)]">Software Engineer | Java Backend Developer</p></div>
          <div><h3 className="font-semibold">Quick Links</h3><div className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--muted)]">{['Home','About','Projects','Resume','Blog','Contact'].map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</div></div>
          <div><h3 className="font-semibold">Social Links</h3><div className="mt-3 flex gap-3 text-sm text-[var(--muted)]">{socialLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div></div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-sm text-[var(--muted)]">© 2026 Raghavendra. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
