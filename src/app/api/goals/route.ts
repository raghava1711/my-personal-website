import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { goals } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { clampProgress, safeText, toDateOrNull } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const items = await db.select().from(goals).where(eq(goals.userId, user.id)).orderBy(desc(goals.updatedAt));
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
    const title = safeText(body.title);
    if (!title) return badRequest("Goal title is required.");
    const [item] = await db.insert(goals).values({ userId: user.id, title, description: safeText(body.description), progress: clampProgress(body.progress), deadline: toDateOrNull(body.deadline), status: safeText(body.status, "Active") }).returning();
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
    const title = safeText(body.title);
    if (!id || !title) return badRequest("Goal id and title are required.");
    const [item] = await db.update(goals).set({ title, description: safeText(body.description), progress: clampProgress(body.progress), deadline: toDateOrNull(body.deadline), status: safeText(body.status, "Active"), updatedAt: new Date() }).where(and(eq(goals.id, id), eq(goals.userId, user.id))).returning();
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
    if (!id) return badRequest("Goal id is required.");
    await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, user.id)));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
