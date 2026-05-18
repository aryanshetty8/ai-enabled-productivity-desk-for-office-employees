import { FileVolumeLineChart } from "@/components/charts/FileVolumeLineChart";
import { PendingVsCompletedChart } from "@/components/charts/PendingVsCompletedChart";
import { PerformanceScatterPlot } from "@/components/charts/PerformanceScatterPlot";
import { ProductivityBarChart } from "@/components/charts/ProductivityBarChart";
import { SectionRadarChart } from "@/components/charts/SectionRadarChart";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { TopPerformersTable } from "@/components/dashboard/TopPerformersTable";
import { UnderperformerAlert } from "@/components/dashboard/UnderperformerAlert";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getDashboardSnapshot, getFileAnalytics, withDerivedStatus } from "@/lib/server-data";
import { formatPercent } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSession();
  const [snapshot, analytics] = await Promise.all([getDashboardSnapshot(session), getFileAnalytics()]);
  const nowMonth = new Date().toISOString().slice(0, 7);
  const totalFilesProcessedThisMonth = analytics.files.filter((file) => file.completed_date?.startsWith(nowMonth)).length;
  const averageCompletionRate =
    snapshot.employees.length > 0
      ? snapshot.employees.reduce((sum, employee) => sum + employee.completionRate, 0) / snapshot.employees.length
      : 0;
  const overdueFiles = withDerivedStatus(analytics.files).filter((file) => file.status === "overdue").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Office Productivity Dashboard"
        description="A consolidated view of file disposal, section performance, employee momentum, and exceptions that require immediate review."
      />

      <section className="data-grid">
        <KPICard label="Total Files Processed" value={String(totalFilesProcessedThisMonth)} hint="Completed in the current month" trend="up" />
        <KPICard label="Avg Completion Rate" value={formatPercent(averageCompletionRate)} hint="Across visible employee records" trend="up" />
        <KPICard label="Overdue Files" value={String(overdueFiles)} hint="Active files beyond due date" trend={overdueFiles > 5 ? "down" : "neutral"} />
        <KPICard label="Active Employees" value={String(snapshot.employees.length)} hint="Users with visible performance metrics" trend="neutral" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Employee Productivity" description="Composite score by employee, colour-coded by tier." />
          <ProductivityBarChart employees={snapshot.employees} />
        </Card>
        <Card>
          <CardHeader title="File Volume Trend" description="Monthly intake versus completed disposal." />
          <FileVolumeLineChart data={analytics.monthlyVolume} />
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Section Score Radar" description="Six-axis comparison of section productivity." />
          <SectionRadarChart sections={snapshot.sections} />
        </Card>
        <Card>
          <CardHeader title="Pending vs Completed" description="Stacked section-level workload picture." />
          <PendingVsCompletedChart sections={snapshot.sections} />
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <UnderperformerAlert employees={snapshot.underperformers} />
        <RecentActivityFeed files={analytics.activity} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <TopPerformersTable employees={snapshot.topPerformers} />
        <Card>
          <CardHeader title="Processing Speed vs Score" description="Quick view of turnaround time against the composite score." />
          <PerformanceScatterPlot employees={snapshot.employees} />
        </Card>
      </section>
    </div>
  );
}
