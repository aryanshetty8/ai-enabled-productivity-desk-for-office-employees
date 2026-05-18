import Link from "next/link";

import { PerformanceBadge } from "@/components/employees/PerformanceBadge";
import { Card } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";
import type { EmployeeMetrics } from "@/types";

export function EmployeeCard({ employee }: { employee: EmployeeMetrics }) {
  return (
    <Card className="bg-white/90">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href={`/employees/${employee.employeeId}`} className="text-lg font-semibold text-forest-800 hover:text-forest-950">
            {employee.name}
          </Link>
          <p className="text-sm text-forest-900/60">{employee.section}</p>
        </div>
        <PerformanceBadge tier={employee.performanceTier} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-forest-50/80 p-3">
          <p className="text-forest-900/50">Completion</p>
          <p className="mt-1 font-mono text-lg">{formatPercent(employee.completionRate)}</p>
        </div>
        <div className="rounded-2xl bg-forest-50/80 p-3">
          <p className="text-forest-900/50">Score</p>
          <p className="mt-1 font-mono text-lg">{employee.productivityScore.toFixed(1)}</p>
        </div>
      </div>
    </Card>
  );
}
