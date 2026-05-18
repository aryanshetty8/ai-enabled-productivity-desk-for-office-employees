"use client";

import { useState } from "react";

import { DataTable } from "@/components/admin/DataTable";
import { FileForm } from "@/components/admin/FileForm";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { FileRecord } from "@/types";

export function FileManagement({
  initialFiles,
  assignees
}: {
  initialFiles: FileRecord[];
  assignees: string[];
}) {
  const [files, setFiles] = useState(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileRecord | undefined>(undefined);

  async function refreshFiles() {
    const response = await fetch("/api/files?raw=1");
    if (response.ok) {
      setFiles((await response.json()) as FileRecord[]);
      setSelectedFile(undefined);
    }
  }

  async function removeFile(fileId: string) {
    await fetch(`/api/files/${fileId}`, { method: "DELETE" });
    await refreshFiles();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-forest-900/10 bg-white/70 px-4 py-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-forest-900/45">File Records</p>
            <p className="mt-1 text-sm text-forest-900/70">{files.length} active CSV rows available for admin maintenance</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSelectedFile(undefined);
            }}
          >
            Add File Record
          </Button>
        </div>
        <DataTable
          headers={["File ID", "Title", "Section", "Assigned", "Status", "Due Date", "Actions"]}
          rows={files.map((file) => [
            file.file_id,
            <div key={`${file.file_id}-title`}>
              <p className="font-semibold">{file.file_title}</p>
              <p className="text-xs text-forest-900/55">{file.file_number}</p>
            </div>,
            file.section,
            file.assigned_to,
            file.status,
            formatDate(file.due_date),
            <div key={`${file.file_id}-actions`} className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setSelectedFile(file)}>
                Edit
              </Button>
              <Button type="button" variant="danger" onClick={() => removeFile(file.file_id)}>
                Delete
              </Button>
            </div>
          ])}
        />
      </div>
      <FileForm assignees={assignees} file={selectedFile} onCancel={() => setSelectedFile(undefined)} onSuccess={refreshFiles} />
    </div>
  );
}
