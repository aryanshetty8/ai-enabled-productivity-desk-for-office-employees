"use client";

import { Button } from "@/components/ui/button";

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ReportActions({
  employeeCsv,
  sectionCsv
}: {
  employeeCsv: string;
  sectionCsv: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => download("employee-metrics.csv", employeeCsv)}>
        Export Employees CSV
      </Button>
      <Button variant="secondary" onClick={() => download("section-metrics.csv", sectionCsv)}>
        Export Sections CSV
      </Button>
      <Button variant="ghost" onClick={() => window.print()}>
        Print View
      </Button>
    </div>
  );
}
