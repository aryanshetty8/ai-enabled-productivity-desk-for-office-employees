import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/server-data";
import { formatPercent, slugify } from "@/lib/utils";

export default async function SectionsPage() {
  const session = await getSession();
  const snapshot = await getDashboardSnapshot(session);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sections"
        title="Section Performance"
        description="Review section completion, on-time delivery, workload distribution, and compare scores across the office."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {snapshot.sections.map((section) => (
          <Link key={section.section} href={`/sections/${slugify(section.section)}`}>
            <Card className="h-full bg-white/90 transition hover:-translate-y-1 hover:border-forest-500/20">
              <p className="text-sm uppercase tracking-[0.18em] text-forest-900/45">{section.section}</p>
              <p className="mt-4 font-mono text-4xl">{section.sectionScore.toFixed(1)}</p>
              <div className="mt-5 space-y-2 text-sm text-forest-900/70">
                <p>Completion: {formatPercent(section.completionRate)}</p>
                <p>On time: {formatPercent(section.onTimeRate)}</p>
                <p>Files per employee: {section.filesPerEmployee.toFixed(1)}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
