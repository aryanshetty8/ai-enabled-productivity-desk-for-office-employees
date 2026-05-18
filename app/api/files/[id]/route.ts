import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { deleteCSVRow, readCSV, updateCSVRow } from "@/lib/csv";
import { fileSchema } from "@/lib/schemas";
import { withDerivedStatus } from "@/lib/server-data";
import type { FileRecord } from "@/types";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files = await readCSV<FileRecord>("forest_eoffice_data.csv");
  const file = withDerivedStatus(files).find((entry) => entry.file_id === params.id);

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  if (session.role === "employee" && file.assigned_to !== session.username) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(file);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const payload = fileSchema.partial().parse(await request.json());
    await updateCSVRow<FileRecord>("forest_eoffice_data.csv", "file_id", params.id, payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to update file record"
      },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteCSVRow<FileRecord>("forest_eoffice_data.csv", "file_id", params.id);
  return NextResponse.json({ success: true });
}
