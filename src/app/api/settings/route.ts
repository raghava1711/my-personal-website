import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { safeText } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const [record] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      bio: users.bio,
      profilePhotoUrl: users.profilePhotoUrl,
      githubUrl: users.githubUrl,
      linkedinUrl: users.linkedinUrl,
      resumeDocumentId: users.resumeDocumentId,
    }).from(users).where(eq(users.id, user.id)).limit(1);
    return ok({ item: record });
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await readJson(request);
    const name = safeText(body.name);
    const email = safeText(body.email).toLowerCase();
    if (!name || !email.includes("@")) return badRequest("Valid name and email are required.");
    const [item] = await db.update(users).set({
      name,
      email,
      phone: safeText(body.phone),
      bio: safeText(body.bio),
      profilePhotoUrl: safeText(body.profilePhotoUrl),
      githubUrl: safeText(body.githubUrl),
      linkedinUrl: safeText(body.linkedinUrl),
      updatedAt: new Date(),
    }).where(eq(users.id, user.id)).returning({ id: users.id, name: users.name, email: users.email, phone: users.phone, bio: users.bio, profilePhotoUrl: users.profilePhotoUrl, githubUrl: users.githubUrl, linkedinUrl: users.linkedinUrl });
    return ok({ item });
  } catch (error) {
    return serverError(error);
  }
}
