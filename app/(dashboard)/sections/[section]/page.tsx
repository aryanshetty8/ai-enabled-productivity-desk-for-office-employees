import { notFound } from "next/navigation";

import { PendingVsCompletedChart } from "@/components/charts/PendingVsCompletedChart";
import { AISummaryCard } from "@/components/dashboard/AISummaryCard";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getSectionDetail } from "@/lib/server-data";
import { deslugify, formatPercent } from "@/lib/utils";

export default async function SectionDetailPage({ params }: { params: { section: string } }) {
  const session = await getSession();
  const sectionName = deslugify(params.section);
  const detail = await getSectionDetail(sectionName);

  if (!detail.section) {
    notFound();
  }

  if (session?.role === "employee" && session.section.toLowerCase() !== detail.section.section.toLowerCase()) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Section Detail"
        title={detail.section.section}
        description="Detailed section scorecard, employee ranking, comparison view, and AI-generated management commentary."
      />

      <section className="data-grid">
        <Card>
          <p className="text-sm text-forest-900/55">Section Score</p>
          <p className="mt-2 font-mono text-3xl">{detail.section.sectionScore.toFixed(1)}</p>
        </Card>
        <Card>
          <p className="text-sm text-forest-900/55">Completion Rate</p>
          <p className="mt-2 font-mono text-3xl">{formatPercent(detail.section.completionRate)}</p>
        </Card>
        <Card>
          <p className="text-sm text-forest-900/55">On-time Rate</p>
          <p className="mt-2 font-mono text-3xl">{formatPercent(detail.section.onTimeRate)}</p>
        </Card>
        <Card>
          <p className="text-sm text-forest-900/55">Files Per Employee</p>
          <p className="mt-2 font-mono text-3xl">{detail.section.filesPerEmployee.toFixed(1)}</p>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h3 className="text-xl font-semibold">Section Comparison</h3>
          <p className="mt-1 text-sm text-forest-900/60">Pending versus completed distribution across all sections.</p>
          <div className="mt-4">
            <PendingVsCompletedChart sections={detail.comparisons} />
          </div>
        </Card>
        <AISummaryCard
          type="section"
          id={detail.section.section}
          title="AI Section Summary"
          description="Generate a section-level management summary from current metrics."
        />
      </section>

      <EmployeeTable employees={detail.employees} />
    </div>
  );
}
