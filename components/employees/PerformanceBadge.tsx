import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EmployeeMetrics } from "@/types";

const tierStyles: Record<EmployeeMetrics["performanceTier"], string> = {
  excellent: "bg-emerald-100 text-emerald-700",
  good: "bg-blue-100 text-blue-700",
  average: "bg-amber-100 text-amber-700",
  poor: "bg-red-100 text-red-700"
};

export function PerformanceBadge({ tier }: { tier: EmployeeMetrics["performanceTier"] }) {
  return <Badge className={cn(tierStyles[tier])}>{tier}</Badge>;
}
