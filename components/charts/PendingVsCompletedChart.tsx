"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { SectionMetrics } from "@/types";

export function PendingVsCompletedChart({ sections }: { sections: SectionMetrics[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sections}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="section" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="pending" stackId="a" fill="#c8b76a" radius={[6, 6, 0, 0]} />
          <Bar dataKey="completed" stackId="a" fill="#2e7d2e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
