import { UserManagement } from "@/components/admin/UserManagement";
import { PageHeader } from "@/components/layout/PageHeader";
import { readUsers, sanitizeUsers } from "@/lib/server-data";

export default async function AdminUsersPage() {
  const users = await readUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Users"
        title="User Management"
        description="Full CRUD management for accounts persisted in users.csv."
      />
      <UserManagement initialUsers={sanitizeUsers(users)} />
    </div>
  );
}
