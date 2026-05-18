import Link from "next/link";

import { PerformanceBadge } from "@/components/employees/PerformanceBadge";
import { Card, CardHeader } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";
import type { EmployeeMetrics } from "@/types";

export function TopPerformersTable({ employees }: { employees: EmployeeMetrics[] }) {
  return (
    <Card>
      <CardHeader title="Top Performers" description="Current leaders by productivity score." />
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-forest-900/55">
            <tr>
              <th className="pb-3 font-medium">Employee</th>
              <th className="pb-3 font-medium">Section</th>
              <th className="pb-3 font-medium">Completion</th>
              <th className="pb-3 font-medium">Score</th>
              <th className="pb-3 font-medium">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-900/8">
            {employees.map((employee) => (
              <tr key={employee.employeeId}>
                <td className="py-3">
                  <Link href={`/employees/${employee.employeeId}`} className="font-semibold text-forest-700 hover:text-forest-900">
                    {employee.name}
                  </Link>
                </td>
                <td className="py-3">{employee.section}</td>
                <td className="py-3">{formatPercent(employee.completionRate)}</td>
                <td className="py-3 font-mono">{employee.productivityScore.toFixed(1)}</td>
                <td className="py-3">
                  <PerformanceBadge tier={employee.performanceTier} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
