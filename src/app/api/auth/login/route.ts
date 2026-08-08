import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";
import { badRequest, ok, readJson, serverError } from "@/lib/api";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeedData();
    const body = await readJson(request);
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    if (!email || !password) return badRequest("Email and password are required.");

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await createSession(user.id);
    return ok({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return serverError(error);
  }
}
