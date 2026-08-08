import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await readJson(request);
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    if (newPassword.length < 8) return badRequest("New password must be at least 8 characters.");

    const [record] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!record || !(await verifyPassword(currentPassword, record.passwordHash))) {
      return Response.json({ error: "Current password is incorrect." }, { status: 403 });
    }

    await db.update(users).set({ passwordHash: await hashPassword(newPassword), updatedAt: new Date() }).where(eq(users.id, user.id));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
