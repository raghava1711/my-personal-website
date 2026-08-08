import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { ensureSeedData } from "@/lib/seed";
import { safeText, slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeedData();
    const items = await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
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
    const category = safeText(body.category, "Java");
    const excerpt = safeText(body.excerpt);
    const content = safeText(body.content);
    if (!title || !excerpt || !content) return badRequest("Blog title, excerpt and content are required.");
    const [created] = await db.insert(blogPosts).values({
      userId: user.id,
      title,
      slug: slugify(title),
      category,
      excerpt,
      content,
      thumbnailUrl: safeText(body.thumbnailUrl),
      published: body.published !== false,
      sample: false,
    }).returning();
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
    const excerpt = safeText(body.excerpt);
    const content = safeText(body.content);
    if (!id || !title || !excerpt || !content) return badRequest("Blog id, title, excerpt and content are required.");
    const [updated] = await db.update(blogPosts).set({
      title,
      slug: slugify(title),
      category: safeText(body.category, "Java"),
      excerpt,
      content,
      thumbnailUrl: safeText(body.thumbnailUrl),
      published: body.published !== false,
      sample: false,
      updatedAt: new Date(),
    }).where(eq(blogPosts.id, id)).returning();
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
    if (!id) return badRequest("Blog id is required.");
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
