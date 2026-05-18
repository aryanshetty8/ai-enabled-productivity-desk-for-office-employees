import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { generateSummary } from "@/lib/llm";
import { summarySchema } from "@/lib/schemas";
import { getCurrentEmployeeMetrics, getCurrentSectionMetrics, getDashboardSnapshot } from "@/lib/server-data";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = summarySchema.parse(await request.json());
    const snapshot = await getDashboardSnapshot(session);

    if (body.type === "employee") {
      const employee = body.id ? await getCurrentEmployeeMetrics(body.id, session) : snapshot.employees[0];
      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }
      return NextResponse.json(await generateSummary({ type: "employee", snapshot, employee }));
    }

    if (body.type === "section") {
      const section = body.id ? await getCurrentSectionMetrics(body.id, session) : snapshot.sections[0];
      if (!section) {
        return NextResponse.json({ error: "Section not found" }, { status: 404 });
      }
      return NextResponse.json(await generateSummary({ type: "section", snapshot, section }));
    }

    return NextResponse.json(await generateSummary({ type: "overview", snapshot }));
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to generate summary"
      },
      { status: 400 }
    );
  }
}
