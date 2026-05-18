"use client";

import { useState } from "react";

import { DataTable } from "@/components/admin/DataTable";
import { UserForm } from "@/components/admin/UserForm";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";

type SafeUser = Omit<User, "password_hash">;

export function UserManagement({ initialUsers }: { initialUsers: SafeUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<SafeUser | undefined>(undefined);

  async function refreshUsers() {
    const response = await fetch("/api/admin/users");
    if (response.ok) {
      setUsers((await response.json()) as SafeUser[]);
      setSelectedUser(undefined);
    }
  }

  async function removeUser(id: string) {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    await refreshUsers();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-forest-900/10 bg-white/70 px-4 py-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-forest-900/45">Accounts</p>
            <p className="mt-1 text-sm text-forest-900/70">
              {users.filter((user) => user.role === "employee").length} employees and{" "}
              {users.filter((user) => user.role === "admin").length} admins
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSelectedUser(undefined);
            }}
          >
            Add Employee
          </Button>
        </div>
        <DataTable
          headers={["Name", "Username", "Role", "Section", "Designation", "Actions"]}
          rows={users.map((user) => [
            <div key={`${user.id}-name`}>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-forest-900/55">{user.email}</p>
            </div>,
            user.username,
            user.role,
            user.section,
            user.designation,
            <div key={`${user.id}-actions`} className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setSelectedUser(user)}>
                Edit
              </Button>
              <Button type="button" variant="danger" onClick={() => removeUser(user.id)}>
                Delete
              </Button>
            </div>
          ])}
        />
      </div>
      <UserForm user={selectedUser} onCancel={() => setSelectedUser(undefined)} onSuccess={refreshUsers} />
    </div>
  );
}
