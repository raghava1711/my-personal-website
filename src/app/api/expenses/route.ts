import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { safeText, toDateOrNull } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const items = await db.select().from(expenses).where(eq(expenses.userId, user.id)).orderBy(desc(expenses.spentAt));
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
    const name = safeText(body.name);
    const amount = Number(body.amount);
    if (!name || Number.isNaN(amount) || amount < 0) return badRequest("Valid expense name and amount are required.");
    const [item] = await db.insert(expenses).values({ userId: user.id, name, amount: String(amount), category: safeText(body.category, "Other"), spentAt: toDateOrNull(body.spentAt) ?? new Date(), notes: safeText(body.notes) }).returning();
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
    const name = safeText(body.name);
    const amount = Number(body.amount);
    if (!id || !name || Number.isNaN(amount) || amount < 0) return badRequest("Valid expense id, name and amount are required.");
    const [item] = await db.update(expenses).set({ name, amount: String(amount), category: safeText(body.category, "Other"), spentAt: toDateOrNull(body.spentAt) ?? new Date(), notes: safeText(body.notes), updatedAt: new Date() }).where(and(eq(expenses.id, id), eq(expenses.userId, user.id))).returning();
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
    if (!id) return badRequest("Expense id is required.");
    await db.delete(expenses).where(and(eq(expenses.id, id), eq(expenses.userId, user.id)));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
