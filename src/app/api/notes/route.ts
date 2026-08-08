import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { safeText } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const items = await db.select().from(notes).where(eq(notes.userId, user.id)).orderBy(desc(notes.pinned), desc(notes.updatedAt));
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
    const content = safeText(body.content);
    if (!title || !content) return badRequest("Note title and content are required.");
    const [item] = await db.insert(notes).values({ userId: user.id, title, content, category: safeText(body.category, "Personal"), pinned: Boolean(body.pinned) }).returning();
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
    const content = safeText(body.content);
    if (!id || !title || !content) return badRequest("Note id, title and content are required.");
    const [item] = await db.update(notes).set({ title, content, category: safeText(body.category, "Personal"), pinned: Boolean(body.pinned), updatedAt: new Date() }).where(and(eq(notes.id, id), eq(notes.userId, user.id))).returning();
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
    if (!id) return badRequest("Note id is required.");
    await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, user.id)));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
