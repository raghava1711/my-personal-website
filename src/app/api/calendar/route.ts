import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { calendarEvents } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { safeText, toDateOrNull } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const items = await db.select().from(calendarEvents).where(eq(calendarEvents.userId, user.id)).orderBy(asc(calendarEvents.eventDate));
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
    const eventDate = toDateOrNull(body.eventDate);
    if (!title || !eventDate) return badRequest("Event title and date are required.");
    const [item] = await db.insert(calendarEvents).values({ userId: user.id, title, eventType: safeText(body.eventType, "Personal"), eventDate, eventTime: safeText(body.eventTime), description: safeText(body.description) }).returning();
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
    const eventDate = toDateOrNull(body.eventDate);
    if (!id || !title || !eventDate) return badRequest("Event id, title and date are required.");
    const [item] = await db.update(calendarEvents).set({ title, eventType: safeText(body.eventType, "Personal"), eventDate, eventTime: safeText(body.eventTime), description: safeText(body.description), updatedAt: new Date() }).where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, user.id))).returning();
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
    if (!id) return badRequest("Event id is required.");
    await db.delete(calendarEvents).where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, user.id)));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
