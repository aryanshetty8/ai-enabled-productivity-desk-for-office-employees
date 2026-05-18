"use client";

import { useState } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import type { JWTPayload } from "@/types";

export function DashboardShell({
  user,
  children
}: {
  user: JWTPayload;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:pl-64">
        <Topbar user={user} onToggleNav={() => setSidebarOpen((value) => !value)} />
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
