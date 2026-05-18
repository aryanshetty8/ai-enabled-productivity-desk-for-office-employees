import { notFound, redirect } from "next/navigation";

import { MonthlyCompletionChart } from "@/components/charts/MonthlyCompletionChart";
import { AISummaryCard } from "@/components/dashboard/AISummaryCard";
import { PerformanceBadge } from "@/components/employees/PerformanceBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getEmployeeMetricById, sanitizeUser, withDerivedStatus } from "@/lib/server-data";
import { formatDate, formatPercent } from "@/lib/utils";

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const detail = await getEmployeeMetricById(params.id);

  if (!detail.user || !detail.metric) {
    notFound();
  }

  if (session?.role === "employee" && session.userId !== detail.user.id) {
    redirect("/employees");
  }

  const profile = sanitizeUser(detail.user);
  const metric = detail.metric;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={profile.section}
        title={profile.name}
        description={`${profile.designation} · Joined ${formatDate(profile.joining_date)} · ${profile.email}`}
        action={<PerformanceBadge tier={metric.performanceTier} />}
      />

      <section className="data-grid">
        <Card>
          <p className="text-sm text-forest-900/55">Completion Rate</p>
          <p className="mt-2 font-mono text-3xl">{formatPercent(metric.completionRate)}</p>
        </Card>
        <Card>
          <p className="text-sm text-forest-900/55">On-time Rate</p>
          <p className="mt-2 font-mono text-3xl">{formatPercent(metric.onTimeRate)}</p>
        </Card>
        <Card>
          <p className="text-sm text-forest-900/55">Overdue Rate</p>
          <p className="mt-2 font-mono text-3xl">{formatPercent(metric.overdueRate)}</p>
        </Card>
        <Card>
          <p className="text-sm text-forest-900/55">Avg Processing Days</p>
          <p className="mt-2 font-mono text-3xl">{metric.avgProcessingDays.toFixed(1)}</p>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <h3 className="text-xl font-semibold">Monthly Completions</h3>
          <p className="mt-1 text-sm text-forest-900/60">Six-month completion trend for the selected employee.</p>
          <div className="mt-4">
            <MonthlyCompletionChart data={metric.monthlyCompletions} />
          </div>
        </Card>
        <AISummaryCard
          type="employee"
          id={metric.employeeId}
          title="AI Performance Summary"
          description="Generate a concise management note with actions and risk flags."
        />
      </section>

      <Card>
        <h3 className="mb-4 text-xl font-semibold">Assigned Files</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-forest-900/60">
              <tr>
                <th className="pb-3 font-medium">File Number</th>
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/8">
              {withDerivedStatus(detail.files).map((file) => (
                <tr key={file.file_id}>
                  <td className="py-3 font-mono text-xs">{file.file_number}</td>
                  <td className="py-3">{file.file_title}</td>
                  <td className="py-3">{file.status}</td>
                  <td className="py-3">{file.priority}</td>
                  <td className="py-3">{formatDate(file.due_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
