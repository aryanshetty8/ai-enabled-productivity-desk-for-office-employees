import Link from "next/link";

import { Card, CardHeader } from "@/components/ui/card";
import type { EmployeeMetrics } from "@/types";

export function UnderperformerAlert({ employees }: { employees: EmployeeMetrics[] }) {
  return (
    <Card className="border-red-200 bg-red-50/75">
      <CardHeader
        title="Underperformer Alert"
        description="Employees below the preferred productivity threshold."
      />

      <div className="space-y-3">
        {employees.length === 0 ? <p className="text-sm text-red-900/70">No underperformers flagged in the current dataset.</p> : null}
        {employees.map((employee) => {
          const topIssue =
            employee.overdue > 0
              ? `${Math.round(employee.overdueRate * 100)}% overdue rate`
              : employee.zeroCompletionsIn30Days
                ? "No recent completions"
                : "Low completion momentum";

          return (
            <div key={employee.employeeId} className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-white/80 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-red-950">{employee.name}</p>
                <p className="text-sm text-red-900/70">
                  Score {employee.productivityScore.toFixed(1)} · {topIssue}
                </p>
              </div>
              <Link
                href={`/employees/${employee.employeeId}`}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                View Profile
              </Link>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
