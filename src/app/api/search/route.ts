import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts, certificates, codingProblems, documents, goals, jobApplications, learningTopics, notes, projects } from "@/db/schema";
import { ok, requireApiUser, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const query = new URL(request.url).searchParams.get("q")?.trim() || "";
    if (!query) return ok({ items: [] });
    const pattern = `%${query}%`;
    const [projectRows, docRows, certRows, blogRows, noteRows, jobRows, codingRows, learningRows, goalRows] = await Promise.all([
      db.select({ type: projects.title, id: projects.id, title: projects.title, subtitle: projects.description }).from(projects).where(or(ilike(projects.title, pattern), ilike(projects.description, pattern))).limit(8),
      db.select({ type: documents.extension, id: documents.id, title: documents.name, subtitle: documents.originalName }).from(documents).where(and(eq(documents.userId, user.id), or(ilike(documents.name, pattern), ilike(documents.originalName, pattern)))).limit(8),
      db.select({ type: certificates.issuer, id: certificates.id, title: certificates.name, subtitle: certificates.issuer }).from(certificates).where(or(ilike(certificates.name, pattern), ilike(certificates.issuer, pattern))).limit(8),
      db.select({ type: blogPosts.category, id: blogPosts.id, title: blogPosts.title, subtitle: blogPosts.excerpt }).from(blogPosts).where(or(ilike(blogPosts.title, pattern), ilike(blogPosts.excerpt, pattern))).limit(8),
      db.select({ type: notes.category, id: notes.id, title: notes.title, subtitle: notes.content }).from(notes).where(and(eq(notes.userId, user.id), or(ilike(notes.title, pattern), ilike(notes.content, pattern)))).orderBy(desc(notes.updatedAt)).limit(8),
      db.select({ type: jobApplications.status, id: jobApplications.id, title: jobApplications.company, subtitle: jobApplications.role }).from(jobApplications).where(and(eq(jobApplications.userId, user.id), or(ilike(jobApplications.company, pattern), ilike(jobApplications.role, pattern)))).limit(8),
      db.select({ type: codingProblems.platform, id: codingProblems.id, title: codingProblems.problem, subtitle: codingProblems.category }).from(codingProblems).where(and(eq(codingProblems.userId, user.id), ilike(codingProblems.problem, pattern))).limit(8),
      db.select({ type: learningTopics.status, id: learningTopics.id, title: learningTopics.topic, subtitle: learningTopics.notes }).from(learningTopics).where(and(eq(learningTopics.userId, user.id), ilike(learningTopics.topic, pattern))).limit(8),
      db.select({ type: goals.status, id: goals.id, title: goals.title, subtitle: goals.description }).from(goals).where(and(eq(goals.userId, user.id), ilike(goals.title, pattern))).limit(8),
    ]);
    return ok({ items: [...projectRows, ...docRows, ...certRows, ...blogRows, ...noteRows, ...jobRows, ...codingRows, ...learningRows, ...goalRows] });
  } catch (error) {
    return serverError(error);
  }
}
