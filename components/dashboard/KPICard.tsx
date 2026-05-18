import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KPICard({
  label,
  value,
  hint,
  trend = "neutral"
}: {
  label: string;
  value: string;
  hint: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card className="overflow-hidden bg-white/90">
      <p className="text-sm uppercase tracking-[0.18em] text-forest-900/45">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-3xl font-semibold text-forest-900">{value}</p>
          <p className="mt-2 text-sm text-forest-900/60">{hint}</p>
        </div>
        <div
          className={cn(
            "rounded-2xl p-3",
            trend === "up" ? "bg-emerald-50 text-emerald-600" : trend === "down" ? "bg-red-50 text-red-600" : "bg-forest-50 text-forest-700"
          )}
        >
          {trend === "up" ? <ArrowUpRight className="h-5 w-5" /> : trend === "down" ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
        </div>
      </div>
    </Card>
  );
}
