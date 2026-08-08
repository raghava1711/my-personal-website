import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { certificates } from "@/db/schema";
import { badRequest, ok, readJson, requireApiUser, serverError } from "@/lib/api";
import { ensureSeedData } from "@/lib/seed";
import { safeText, toDateOrNull } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeedData();
    const items = await db.select().from(certificates).orderBy(desc(certificates.issuedAt));
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
    const name = safeText(body.name);
    const issuer = safeText(body.issuer);
    if (!name || !issuer) return badRequest("Certificate name and issuer are required.");
    const [created] = await db.insert(certificates).values({
      userId: user.id,
      name,
      issuer,
      issuedAt: toDateOrNull(body.issuedAt),
      imageUrl: safeText(body.imageUrl),
      certificateUrl: safeText(body.certificateUrl),
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
    const name = safeText(body.name);
    const issuer = safeText(body.issuer);
    if (!id || !name || !issuer) return badRequest("Certificate id, name and issuer are required.");
    const [updated] = await db.update(certificates).set({
      name,
      issuer,
      issuedAt: toDateOrNull(body.issuedAt),
      imageUrl: safeText(body.imageUrl),
      certificateUrl: safeText(body.certificateUrl),
      sample: false,
      updatedAt: new Date(),
    }).where(eq(certificates.id, id)).returning();
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
    if (!id) return badRequest("Certificate id is required.");
    await db.delete(certificates).where(eq(certificates.id, id));
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
