import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { codingProblems } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { safeText, toDateOrNull } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const items = await db.select().from(codingProblems).where(eq(codingProblems.userId, user.id)).orderBy(desc(codingProblems.solvedAt));
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
    const problem = safeText(body.problem);
    if (!problem) return badRequest("Problem name is required.");
    const [item] = await db.insert(codingProblems).values({
      userId: user.id,
      platform: safeText(body.platform, "LeetCode"),
      problem,
      difficulty: safeText(body.difficulty, "Easy"),
      category: safeText(body.category, "DSA"),
      solvedAt: toDateOrNull(body.solvedAt),
      status: safeText(body.status, "Solved"),
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
    const problem = safeText(body.problem);
    if (!id || !problem) return badRequest("Problem id and name are required.");
    const [item] = await db.update(codingProblems).set({
      platform: safeText(body.platform, "LeetCode"),
      problem,
      difficulty: safeText(body.difficulty, "Easy"),
      category: safeText(body.category, "DSA"),
      solvedAt: toDateOrNull(body.solvedAt),
      status: safeText(body.status, "Solved"),
      notes: safeText(body.notes),
      updatedAt: new Date(),
    }).where(and(eq(codingProblems.id, id), eq(codingProblems.userId, user.id))).returning();
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
    if (!id) return badRequest("Problem id is required.");
    await db.delete(codingProblems).where(and(eq(codingProblems.id, id), eq(codingProblems.userId, user.id)));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
