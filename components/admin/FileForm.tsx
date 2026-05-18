"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FILE_PRIORITIES, FILE_STATUSES, FILE_TYPES, SECTIONS } from "@/lib/constants";
import { fileSchema } from "@/lib/schemas";
import type { FileRecord } from "@/types";

type FormValues = z.input<typeof fileSchema>;

const blankRecord: FormValues = {
  file_number: "",
  file_title: "",
  file_type: FILE_TYPES[0],
  section: SECTIONS[0],
  received_date: "",
  due_date: "",
  completed_date: "",
  status: "pending",
  priority: "medium",
  assigned_to: "",
  remarks: ""
};

export function FileForm({
  assignees,
  file,
  onCancel,
  onSuccess
}: {
  assignees: string[];
  file?: FileRecord;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      ...blankRecord,
      assigned_to: assignees[0] ?? ""
    }
  });

  useEffect(() => {
    form.reset(
      file
        ? {
            file_id: file.file_id,
            file_number: file.file_number,
            file_title: file.file_title,
            file_type: file.file_type,
            section: file.section,
            received_date: file.received_date,
            due_date: file.due_date,
            completed_date: file.completed_date ?? "",
            status: file.status,
            priority: file.priority,
            assigned_to: file.assigned_to,
            remarks: file.remarks ?? ""
          }
        : {
            ...blankRecord,
            assigned_to: assignees[0] ?? ""
          }
    );
    setError(null);
  }, [assignees, file, form]);

  async function handleSubmit(values: FormValues) {
    setError(null);
    const endpoint = file?.file_id ? `/api/files/${file.file_id}` : "/api/files";
    const method = file?.file_id ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Unable to save file record");
      return;
    }

    form.reset({
      ...blankRecord,
      assigned_to: assignees[0] ?? ""
    });
    onSuccess?.();
  }

  return (
    <Card>
      <CardHeader
        title={file?.file_id ? "Edit File Record" : "Add File Record"}
        description="Create or update rows in forest_eoffice_data.csv."
      />
      <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <label className="mb-1 block text-sm font-medium">File Number</label>
          <Input {...form.register("file_number")} />
          {form.formState.errors.file_number ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.file_number.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">File Title</label>
          <Input {...form.register("file_title")} />
          {form.formState.errors.file_title ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.file_title.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">File Type</label>
          <select className="w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" {...form.register("file_type")}>
            {FILE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Section</label>
          <select className="w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" {...form.register("section")}>
            {SECTIONS.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Received Date</label>
          <Input type="date" {...form.register("received_date")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Due Date</label>
          <Input type="date" {...form.register("due_date")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Completed Date</label>
          <Input type="date" {...form.register("completed_date")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Assigned To</label>
          <select className="w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" {...form.register("assigned_to")}>
            {assignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select className="w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" {...form.register("status")}>
            {FILE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Priority</label>
          <select className="w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm" {...form.register("priority")}>
            {FILE_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Remarks</label>
          <Input {...form.register("remarks")} />
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
        <div className="md:col-span-2 flex justify-end gap-3">
          {file?.file_id ? (
            <Button type="button" variant="ghost" onClick={() => onCancel?.()}>
              Cancel Edit
            </Button>
          ) : null}
          <Button type="submit">{file?.file_id ? "Update File" : "Create File"}</Button>
        </div>
      </form>
    </Card>
  );
}
