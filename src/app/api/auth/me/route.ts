import { getCurrentUser } from "@/lib/auth";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return ok({ user });
}
