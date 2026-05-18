"use client";

import { Menu, Search } from "lucide-react";

import { LogoutButton } from "@/components/layout/LogoutButton";
import { Input } from "@/components/ui/input";
import type { JWTPayload } from "@/types";

export function Topbar({ user, onToggleNav }: { user: JWTPayload; onToggleNav: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-forest-900/10 bg-[#eff3e8]/85 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open navigation"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-forest-900/10 bg-white/80 md:hidden"
          onClick={onToggleNav}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="font-serif text-2xl">Forest Department Productivity Desk</p>
          <p className="text-sm text-forest-900/60">Daily tracking, section analytics, and AI-guided summaries.</p>
        </div>
      </div>

      <div className="hidden min-w-[260px] max-w-sm flex-1 items-center gap-2 rounded-2xl border border-forest-900/10 bg-white/75 px-3 py-2 lg:flex">
        <Search className="h-4 w-4 text-forest-900/45" />
        <Input placeholder="Search files, sections, or employees" className="border-0 bg-transparent p-0 focus:border-0" />
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-2xl border border-forest-900/10 bg-white/75 px-4 py-2 text-right sm:block">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-forest-900/60">
            {user.role} · {user.section}
          </p>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
