import { CSVUploader } from "@/components/admin/CSVUploader";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { readFiles } from "@/lib/server-data";

export default async function AdminDataPage() {
  const files = await readFiles();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Data"
        title="Data Manager"
        description="Preview CSV inputs and inspect the active file records currently loaded from forest_eoffice_data.csv."
      />
      <CSVUploader />
      <DataTable
        headers={["File ID", "Title", "Section", "Assigned", "Status", "Priority"]}
        rows={files.slice(0, 20).map((file) => [file.file_id, file.file_title, file.section, file.assigned_to, file.status, file.priority])}
      />
    </div>
  );
}
