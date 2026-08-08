import type { ReactNode } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { requireUser } from "@/lib/auth";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await ensureSeedData();
  const user = await requireUser();
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
