import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/server-data";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await getDashboardSnapshot(session);
  return NextResponse.json(snapshot);
}
