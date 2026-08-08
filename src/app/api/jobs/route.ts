import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { safeText, toDateOrNull } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const items = await db.select().from(jobApplications).where(eq(jobApplications.userId, user.id)).orderBy(desc(jobApplications.applicationDate));
    return ok({ items });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await readJson(request);
    const company = safeText(body.company);
    const role = safeText(body.role);
    if (!company || !role) return badRequest("Company and job role are required.");
    const [item] = await db.insert(jobApplications).values({
      userId: user.id,
      company,
      role,
      applicationDate: toDateOrNull(body.applicationDate) ?? new Date(),
      status: safeText(body.status, "Applied"),
      interviewDate: toDateOrNull(body.interviewDate),
      location: safeText(body.location),
      jobUrl: safeText(body.jobUrl),
      notes: safeText(body.notes),
    }).returning();
    return ok({ item }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await readJson(request);
    const id = safeText(body.id);
    const company = safeText(body.company);
    const role = safeText(body.role);
    if (!id || !company || !role) return badRequest("Application id, company and role are required.");
    const [item] = await db.update(jobApplications).set({
      company,
      role,
      applicationDate: toDateOrNull(body.applicationDate) ?? new Date(),
      status: safeText(body.status, "Applied"),
      interviewDate: toDateOrNull(body.interviewDate),
      location: safeText(body.location),
      jobUrl: safeText(body.jobUrl),
      notes: safeText(body.notes),
      updatedAt: new Date(),
    }).where(and(eq(jobApplications.id, id), eq(jobApplications.userId, user.id))).returning();
    return ok({ item });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await readJson(request);
    const id = safeText(body.id);
    if (!id) return badRequest("Application id is required.");
    await db.delete(jobApplications).where(and(eq(jobApplications.id, id), eq(jobApplications.userId, user.id)));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
