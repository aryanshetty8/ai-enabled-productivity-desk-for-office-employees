"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminUserSchema } from "@/lib/schemas";
import type { User } from "@/types";
import { z } from "zod";

type FormValues = z.input<typeof adminUserSchema> & {
  password?: string;
};

export function UserForm({
  user,
  onSuccess
}: {
  user?: Partial<User>;
  onSuccess?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const schema = user?.id
    ? adminUserSchema.partial().extend({ password: z.string().min(8).optional() })
    : adminUserSchema;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username ?? "",
      role: user?.role ?? "employee",
      name: user?.name ?? "",
      section: user?.section ?? "Wildlife",
      designation: user?.designation ?? "",
      joining_date: user?.joining_date ?? "",
      email: user?.email ?? "",
      password: ""
    }
  });

  async function handleSubmit(values: FormValues) {
    setError(null);
    const endpoint = user?.id ? `/api/admin/users/${user.id}` : "/api/admin/users";
    const method = user?.id ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Unable to save user");
      return;
    }

    form.reset();
    onSuccess?.();
  }

  return (
    <Card>
      <CardHeader title={user?.id ? "Edit User" : "Add User"} description="Manage employee and admin accounts stored in CSV." />
      <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <label className="mb-1 block text-sm font-medium">Username</label>
          <Input {...form.register("username")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <Input {...form.register("name")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input type="email" {...form.register("email")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <Input type="password" placeholder={user?.id ? "Leave blank to keep current password" : "Minimum 8 characters"} {...form.register("password")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Designation</label>
          <Input {...form.register("designation")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Joining Date</label>
          <Input type="date" {...form.register("joining_date")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Role</label>
          <select className="w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" {...form.register("role")}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Section</label>
          <select className="w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" {...form.register("section")}>
            <option value="Wildlife">Wildlife</option>
            <option value="Plantation">Plantation</option>
            <option value="Administration">Administration</option>
            <option value="Finance">Finance</option>
            <option value="Enforcement">Enforcement</option>
            <option value="Research">Research</option>
          </select>
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit">{user?.id ? "Update User" : "Create User"}</Button>
        </div>
      </form>
    </Card>
  );
}
