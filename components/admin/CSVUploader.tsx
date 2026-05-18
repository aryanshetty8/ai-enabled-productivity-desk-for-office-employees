"use client";

import { useState } from "react";

import { Card, CardHeader } from "@/components/ui/card";

export function CSVUploader() {
  const [preview, setPreview] = useState<string[]>([]);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setPreview(text.split(/\r?\n/).slice(0, 6));
  }

  return (
    <Card>
      <CardHeader
        title="CSV Preview"
        description="Preview a CSV before replacing a data source. Import confirmation flow can be wired to an admin route next."
      />
      <input type="file" accept=".csv" onChange={handleChange} className="block w-full text-sm" />
      {preview.length > 0 ? (
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-forest-900 p-4 text-xs text-white">{preview.join("\n")}</pre>
      ) : null}
    </Card>
  );
}
