"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bot, FileText, LayoutDashboard, Settings, Shield, Users2, Trees } from "lucide-react";

import { cn } from "@/lib/utils";
import type { JWTPayload } from "@/types";

const primaryLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users2 },
  { href: "/sections", label: "Sections", icon: Trees },
  { href: "/files", label: "File Analytics", icon: FileText },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/chatbot", label: "Chatbot", icon: Bot }
];

const adminLinks = [
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function Sidebar({
  user,
  open,
  onClose
}: {
  user: JWTPayload;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <button
        aria-label="Close navigation"
        className={cn("fixed inset-0 z-30 bg-forest-900/30 md:hidden", open ? "block" : "hidden")}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-forest-900/10 bg-forest-900 px-4 py-5 text-white transition md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-khaki text-xl text-forest-900">T</div>
          <div>
            <p className="font-serif text-2xl leading-none">Forest eOffice</p>
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">Monitoring Suite</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/8 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">{user.role}</p>
          <p className="mt-1 text-sm font-semibold">{user.name}</p>
          <p className="text-sm text-white/65">{user.section}</p>
        </div>

        <nav className="space-y-1">
          {primaryLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                  active ? "bg-white text-forest-900" : "text-white/75 hover:bg-white/10 hover:text-white"
                )}
                onClick={onClose}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {user.role === "admin" ? (
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="mb-2 px-3 text-xs uppercase tracking-[0.18em] text-white/50">Administration</p>
            <div className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                      active ? "bg-khaki text-forest-900" : "text-white/75 hover:bg-white/10 hover:text-white"
                    )}
                    onClick={onClose}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
