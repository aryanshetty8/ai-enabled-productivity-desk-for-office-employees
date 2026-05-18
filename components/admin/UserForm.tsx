"use client";

import { useEffect, useState } from "react";
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
  onCancel,
  onSuccess
}: {
  user?: Partial<User>;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(adminUserSchema),
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

  useEffect(() => {
    form.reset({
      username: user?.username ?? "",
      role: user?.role ?? "employee",
      name: user?.name ?? "",
      section: user?.section ?? "Wildlife",
      designation: user?.designation ?? "",
      joining_date: user?.joining_date ?? "",
      email: user?.email ?? "",
      password: ""
    });
    setError(null);
  }, [form, user]);

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

    form.reset({
      username: "",
      role: "employee",
      name: "",
      section: "Wildlife",
      designation: "",
      joining_date: "",
      email: "",
      password: ""
    });
    onSuccess?.();
  }

  return (
    <Card>
      <CardHeader
        title={user?.id ? "Edit Employee / Account" : "Add Employee / Account"}
        description="Manage employee and admin accounts stored in CSV."
      />
      <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <label className="mb-1 block text-sm font-medium">Username</label>
          <Input {...form.register("username")} />
          {form.formState.errors.username ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.username.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <Input {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input type="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <Input
            type="password"
            placeholder={user?.id ? "Leave blank to keep current password" : "Leave blank to use default password"}
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Designation</label>
          <Input {...form.register("designation")} />
          {form.formState.errors.designation ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.designation.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Joining Date</label>
          <Input type="date" {...form.register("joining_date")} />
          {form.formState.errors.joining_date ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.joining_date.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Role</label>
          <select className="w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" {...form.register("role")}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          {form.formState.errors.role ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.role.message}</p>
          ) : null}
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
          {form.formState.errors.section ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.section.message}</p>
          ) : null}
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
        <div className="md:col-span-2 flex justify-end gap-3">
          {user?.id ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onCancel?.();
              }}
            >
              Cancel Edit
            </Button>
          ) : null}
          <Button type="submit">{user?.id ? "Update User" : "Create User"}</Button>
        </div>
      </form>
    </Card>
  );
}
