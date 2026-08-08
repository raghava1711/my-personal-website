import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { ensureSeedData } from "@/lib/seed";
import { parseTags, safeText, slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeedData();
    const items = await db.select().from(projects).orderBy(desc(projects.createdAt));
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
    const description = safeText(body.description);
    if (!title || !description) return badRequest("Project title and description are required.");
    const [created] = await db
      .insert(projects)
      .values({
        userId: user.id,
        title,
        slug: slugify(title),
        description,
        technologies: parseTags(body.technologies),
        githubUrl: safeText(body.githubUrl),
        liveUrl: safeText(body.liveUrl),
        imageUrl: safeText(body.imageUrl),
        featured: Boolean(body.featured),
        sample: false,
      })
      .returning();
    return ok({ item: created }, { status: 201 });
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
    const description = safeText(body.description);
    if (!id || !title || !description) return badRequest("Project id, title and description are required.");
    const [updated] = await db
      .update(projects)
      .set({
        title,
        slug: slugify(title),
        description,
        technologies: parseTags(body.technologies),
        githubUrl: safeText(body.githubUrl),
        liveUrl: safeText(body.liveUrl),
        imageUrl: safeText(body.imageUrl),
        featured: Boolean(body.featured),
        sample: false,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    return ok({ item: updated });
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
    if (!id) return badRequest("Project id is required.");
    await db.delete(projects).where(eq(projects.id, id));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
