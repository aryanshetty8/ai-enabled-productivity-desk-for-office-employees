import { UserManagement } from "@/components/admin/UserManagement";
import { PageHeader } from "@/components/layout/PageHeader";
import { readUsers, sanitizeUsers } from "@/lib/server-data";

export default async function AdminUsersPage() {
  const users = await readUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Users"
        title="Employee And Account Management"
        description="Add, edit, and delete employee or admin accounts persisted in users.csv."
      />
      <UserManagement initialUsers={sanitizeUsers(users)} />
    </div>
  );
}
