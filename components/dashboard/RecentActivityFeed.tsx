import { Card, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { FileRecord } from "@/types";

export function RecentActivityFeed({ files }: { files: FileRecord[] }) {
  return (
    <Card>
      <CardHeader title="Recent Activity" description="Latest completed or updated file movements." />
      <div className="space-y-3">
        {files.map((file) => (
          <div key={file.file_id} className="rounded-2xl border border-forest-900/8 bg-forest-50/60 p-4">
            <p className="font-semibold">{file.file_title}</p>
            <p className="mt-1 text-sm text-forest-900/65">
              {file.section} · {file.assigned_to} · {file.status}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-forest-900/45">
              {file.completed_date ? `Completed ${formatDate(file.completed_date)}` : `Received ${formatDate(file.received_date)}`}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
