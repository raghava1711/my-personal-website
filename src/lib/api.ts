import { getCurrentUser, unauthorized } from "@/lib/auth";

export async function requireApiUser() {
  const user = await getCurrentUser();
  if (!user) return { user: null, response: unauthorized() } as const;
  return { user, response: null } as const;
}

export async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {} as Record<string, unknown>;
  }
}

export function ok(data: unknown = { ok: true }, init?: ResponseInit) {
  return Response.json(data, init);
}

export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return Response.json({ error: message }, { status: 404 });
}

export function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected server error";
  return Response.json({ error: message }, { status: 500 });
}
