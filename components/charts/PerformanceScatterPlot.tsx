"use client";

import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";

import type { EmployeeMetrics } from "@/types";

export function PerformanceScatterPlot({ employees }: { employees: EmployeeMetrics[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid />
          <XAxis name="Avg Processing Days" dataKey="avgProcessingDays" tickLine={false} axisLine={false} />
          <YAxis name="Productivity Score" dataKey="productivityScore" tickLine={false} axisLine={false} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={employees} fill="#236023" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
