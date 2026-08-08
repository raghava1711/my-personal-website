import { eq } from "drizzle-orm";
import { db } from "@/db";
import { documents, users } from "@/db/schema";
import { readPrivateFile } from "@/lib/storage";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeedData();
  const [owner] = await db.select().from(users).limit(1);
  if (owner?.resumeDocumentId) {
    const [doc] = await db.select().from(documents).where(eq(documents.id, owner.resumeDocumentId)).limit(1);
    if (doc) {
      try {
        const { buffer } = await readPrivateFile(doc.userId, doc.storageKey);
        return new Response(new Uint8Array(buffer), {
          headers: {
            "Content-Type": doc.mimeType,
            "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.originalName)}"`,
            "Cache-Control": "private, no-store",
          },
        });
      } catch {
        // Fall through to generated placeholder if the local object is missing.
      }
    }
  }

  const placeholder = `Raghavendra\nSoftware Engineer | Java Backend Developer\n\nThis is a generated placeholder resume. Upload your real resume from Dashboard > Documents or Settings and mark it as the active resume.\n`;
  return new Response(placeholder, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": "attachment; filename=raghavendra-resume-placeholder.txt",
    },
  });
}
