import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { filterFiles, readFiles, withDerivedStatus } from "@/lib/server-data";
import { formatDate } from "@/lib/utils";

export default async function FilesPage({
  searchParams
}: {
  searchParams: {
    section?: string;
    status?: string;
    assigned_to?: string;
    from?: string;
    to?: string;
  };
}) {
  const session = await getSession();
  const files = await readFiles();
  const scopedFiles = session?.role === "employee" ? files.filter((file) => file.assigned_to === session.username) : files;
  const filtered = withDerivedStatus(
    filterFiles(scopedFiles, {
      section: searchParams.section,
      status: searchParams.status,
      assigned_to: searchParams.assigned_to,
      from: searchParams.from,
      to: searchParams.to
    })
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="File Analytics"
        title="File Processing Analytics"
        description="Filter by section, status, assignee, and date window to inspect operational flow in detail."
      />

      <Card className="print-hidden">
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input name="section" defaultValue={searchParams.section} placeholder="Section" className="rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" />
          <input name="status" defaultValue={searchParams.status} placeholder="Status" className="rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" />
          <input name="assigned_to" defaultValue={searchParams.assigned_to} placeholder="Assigned to" className="rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" />
          <input name="from" type="date" defaultValue={searchParams.from} className="rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" />
          <input name="to" type="date" defaultValue={searchParams.to} className="rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" />
          <button className="rounded-xl bg-forest-600 px-4 py-2 text-sm font-semibold text-white">Apply Filters</button>
        </form>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-forest-900/60">
              <tr>
                <th className="pb-3 font-medium">File No.</th>
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Section</th>
                <th className="pb-3 font-medium">Assigned</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Received</th>
                <th className="pb-3 font-medium">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/8">
              {filtered.map((file) => (
                <tr key={file.file_id}>
                  <td className="py-3 font-mono text-xs">{file.file_number}</td>
                  <td className="py-3">{file.file_title}</td>
                  <td className="py-3">{file.section}</td>
                  <td className="py-3">{file.assigned_to}</td>
                  <td className="py-3">{file.status}</td>
                  <td className="py-3">{file.priority}</td>
                  <td className="py-3">{formatDate(file.received_date)}</td>
                  <td className="py-3">{formatDate(file.due_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
