import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { appendCSVRow } from "@/lib/csv";
import { filterFiles, readFiles, withDerivedStatus } from "@/lib/server-data";
import { fileSchema } from "@/lib/schemas";
import type { FileRecord } from "@/types";

function nextFileId(files: FileRecord[]) {
  const next = files.length + 1;
  return `F${String(next).padStart(3, "0")}`;
}

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files = await readFiles();
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("raw") === "1";
  const scopedFiles =
    session.role === "employee" ? files.filter((file) => file.assigned_to === session.username) : files;
  const filtered = filterFiles(scopedFiles, {
    section: searchParams.get("section"),
    status: searchParams.get("status"),
    assigned_to: searchParams.get("assigned_to"),
    from: searchParams.get("from"),
    to: searchParams.get("to")
  });

  if (raw && session.role === "admin") {
    return NextResponse.json(filtered);
  }

  return NextResponse.json(withDerivedStatus(filtered));
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const currentFiles = await readFiles();
    const payload = fileSchema.parse(await request.json());
    const row: FileRecord = {
      ...payload,
      file_id: payload.file_id || nextFileId(currentFiles),
      completed_date: payload.completed_date || "",
      remarks: payload.remarks || ""
    };

    await appendCSVRow("forest_eoffice_data.csv", row);
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create file record"
      },
      { status: 400 }
    );
  }
}
