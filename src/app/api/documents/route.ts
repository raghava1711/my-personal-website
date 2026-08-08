import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { documents, folders, users } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { deletePrivateFile, savePrivateFile } from "@/lib/storage";
import { safeText, slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const [docItems, folderItems] = await Promise.all([
      db.select().from(documents).where(eq(documents.userId, user.id)).orderBy(desc(documents.createdAt)),
      db.select().from(folders).where(eq(folders.userId, user.id)).orderBy(folders.name),
    ]);
    const used = docItems.reduce((sum, item) => sum + item.sizeBytes, 0);
    return ok({ items: docItems, folders: folderItems, storage: { usedBytes: used, limitBytes: 10 * 1024 * 1024 * 1024 } });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return badRequest("A file is required.");
    const folderId = safeText(form.get("folderId"));
    const makeResume = form.get("isResume") === "true";
    const saved = await savePrivateFile(user.id, file);
    const [item] = await db.insert(documents).values({
      userId: user.id,
      folderId: folderId || null,
      name: safeText(form.get("name"), file.name) || file.name,
      originalName: file.name,
      mimeType: saved.mimeType,
      extension: saved.extension,
      sizeBytes: saved.sizeBytes,
      storageProvider: "private-local",
      storageKey: saved.storageKey,
      isResume: makeResume,
    }).returning();
    if (makeResume) {
      await db.update(users).set({ resumeDocumentId: item.id, updatedAt: new Date() }).where(eq(users.id, user.id));
    }
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
    if (!id) return badRequest("Document id is required.");
    const [item] = await db.update(documents).set({
      name: safeText(body.name, "Untitled document"),
      folderId: safeText(body.folderId) || null,
      isResume: Boolean(body.isResume),
      updatedAt: new Date(),
    }).where(and(eq(documents.id, id), eq(documents.userId, user.id))).returning();
    if (item?.isResume) {
      await db.update(users).set({ resumeDocumentId: item.id, updatedAt: new Date() }).where(eq(users.id, user.id));
    }
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
    if (!id) return badRequest("Document id is required.");
    const [item] = await db.select().from(documents).where(and(eq(documents.id, id), eq(documents.userId, user.id))).limit(1);
    if (item) {
      await deletePrivateFile(user.id, item.storageKey);
      await db.delete(documents).where(and(eq(documents.id, id), eq(documents.userId, user.id)));
    }
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const body = await readJson(request);
    const name = safeText(body.name);
    if (!name) return badRequest("Folder name is required.");
    const [item] = await db.insert(folders).values({ userId: user.id, name, slug: slugify(name) }).returning();
    return ok({ folder: item }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
