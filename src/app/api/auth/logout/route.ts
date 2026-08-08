import { destroyCurrentSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await destroyCurrentSession();
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
