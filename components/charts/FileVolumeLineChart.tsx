"use client";

import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function FileVolumeLineChart({
  data
}: {
  data: Array<{ month: string; received: number; completed: number }>;
}) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="received" stroke="#8b6914" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="completed" stroke="#2e7d2e" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
