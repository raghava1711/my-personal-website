import { desc } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { safeText } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const items = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    return ok({ items });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const name = safeText(body.name);
    const email = safeText(body.email).toLowerCase();
    const subject = safeText(body.subject);
    const message = safeText(body.message);
    if (!name || !email.includes("@") || !subject || message.length < 10) {
      return badRequest("Please provide a valid name, email, subject, and message of at least 10 characters.");
    }
    const [created] = await db.insert(contactMessages).values({ name, email, subject, message }).returning();
    return ok({ ok: true, item: created }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
