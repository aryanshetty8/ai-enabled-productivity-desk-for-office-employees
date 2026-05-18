import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "admin") {
    redirect("/dashboard");
  }

  return <DashboardShell user={session}>{children}</DashboardShell>;
}
