import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <DashboardShell user={session}>{children}</DashboardShell>;
}
