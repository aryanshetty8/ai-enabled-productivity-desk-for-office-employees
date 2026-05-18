import { FileManagement } from "@/components/admin/FileManagement";
import { CSVUploader } from "@/components/admin/CSVUploader";
import { PageHeader } from "@/components/layout/PageHeader";
import { readFiles, readUsers } from "@/lib/server-data";

export default async function AdminDataPage() {
  const [files, users] = await Promise.all([readFiles(), readUsers()]);
  const assignees = users.filter((user) => user.role === "employee").map((user) => user.username);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Data"
        title="Data Manager"
        description="Preview CSV inputs and add, edit, or delete file records stored in forest_eoffice_data.csv."
      />
      <CSVUploader />
      <FileManagement initialFiles={files} assignees={assignees} />
    </div>
  );
}
