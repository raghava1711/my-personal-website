import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { learningTopics } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { clampProgress, safeText, toDateOrNull } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const items = await db.select().from(learningTopics).where(eq(learningTopics.userId, user.id)).orderBy(desc(learningTopics.updatedAt));
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
    const topic = safeText(body.topic);
    if (!topic) return badRequest("Learning topic is required.");
    const [item] = await db.insert(learningTopics).values({ userId: user.id, topic, progress: clampProgress(body.progress), status: safeText(body.status, "Learning"), notes: safeText(body.notes), targetDate: toDateOrNull(body.targetDate) }).returning();
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
    const topic = safeText(body.topic);
    if (!id || !topic) return badRequest("Topic id and name are required.");
    const [item] = await db.update(learningTopics).set({ topic, progress: clampProgress(body.progress), status: safeText(body.status, "Learning"), notes: safeText(body.notes), targetDate: toDateOrNull(body.targetDate), updatedAt: new Date() }).where(and(eq(learningTopics.id, id), eq(learningTopics.userId, user.id))).returning();
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
    if (!id) return badRequest("Topic id is required.");
    await db.delete(learningTopics).where(and(eq(learningTopics.id, id), eq(learningTopics.userId, user.id)));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
