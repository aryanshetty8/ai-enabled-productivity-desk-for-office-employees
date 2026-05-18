import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { getEmployeeMetricById, sanitizeUser } from "@/lib/server-data";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const detail = await getEmployeeMetricById(params.id);

  if (!detail.user || !detail.metric) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  if (session.role === "employee" && session.userId !== detail.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    profile: sanitizeUser(detail.user),
    metrics: detail.metric,
    files: detail.files
  });
}
