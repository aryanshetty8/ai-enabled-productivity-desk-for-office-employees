"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PERFORMANCE_COLORS } from "@/lib/constants";
import type { EmployeeMetrics } from "@/types";

export function ProductivityBarChart({ employees }: { employees: EmployeeMetrics[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={employees}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-12} textAnchor="end" height={70} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="productivityScore" radius={[10, 10, 0, 0]}>
            {employees.map((employee) => (
              <Cell key={employee.employeeId} fill={PERFORMANCE_COLORS[employee.performanceTier]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
