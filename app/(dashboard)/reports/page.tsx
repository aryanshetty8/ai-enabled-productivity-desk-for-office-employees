import Papa from "papaparse";

import { ReportActions } from "@/components/dashboard/ReportActions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/server-data";
import { formatPercent } from "@/lib/utils";

export default async function ReportsPage() {
  const session = await getSession();
  const snapshot = await getDashboardSnapshot(session);
  const employeeCsv = Papa.unparse(snapshot.employees);
  const sectionCsv = Papa.unparse(snapshot.sections);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Exportable Reports"
        description="Generate print-friendly summaries and export current employee and section metrics to CSV."
        action={<ReportActions employeeCsv={employeeCsv} sectionCsv={sectionCsv} />}
      />

      <Card>
        <h3 className="text-xl font-semibold">Employee Productivity Snapshot</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-forest-900/60">
              <tr>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Section</th>
                <th className="pb-3 font-medium">Completion</th>
                <th className="pb-3 font-medium">On Time</th>
                <th className="pb-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/8">
              {snapshot.employees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td className="py-3">{employee.name}</td>
                  <td className="py-3">{employee.section}</td>
                  <td className="py-3">{formatPercent(employee.completionRate)}</td>
                  <td className="py-3">{formatPercent(employee.onTimeRate)}</td>
                  <td className="py-3 font-mono">{employee.productivityScore.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
