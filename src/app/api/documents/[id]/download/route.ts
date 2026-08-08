import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { notFound, requireApiUser, serverError } from "@/lib/api";
import { canPreview, readPrivateFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    const { id } = await context.params;
    const [doc] = await db.select().from(documents).where(and(eq(documents.id, id), eq(documents.userId, user.id))).limit(1);
    if (!doc) return notFound("Document not found.");
    const { buffer } = await readPrivateFile(user.id, doc.storageKey);
    const preview = new URL(request.url).searchParams.get("preview") === "1";
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(buffer.length),
        "Content-Disposition": `${preview && canPreview(doc.extension) ? "inline" : "attachment"}; filename="${encodeURIComponent(doc.originalName)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return serverError(error);
  }
}
