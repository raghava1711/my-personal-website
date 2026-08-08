import { destroyAllUserSessions } from "@/lib/auth";
import { ok, requireApiUser, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { user, response } = await requireApiUser();
    if (!user) return response;
    await destroyAllUserSessions(user.id);
    return ok({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
