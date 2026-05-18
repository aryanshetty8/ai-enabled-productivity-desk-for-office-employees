"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

import type { SectionMetrics } from "@/types";

export function SectionRadarChart({ sections }: { sections: SectionMetrics[] }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={sections}>
          <PolarGrid />
          <PolarAngleAxis dataKey="section" />
          <Radar dataKey="sectionScore" fill="#2e7d2e" fillOpacity={0.4} stroke="#1a461a" />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
