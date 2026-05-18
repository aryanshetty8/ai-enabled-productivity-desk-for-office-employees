import { NextResponse } from "next/server";
import { z } from "zod";

import { getSession } from "@/lib/auth";
import { readSettings, writeSettings } from "@/lib/settings";

const settingsSchema = z.object({
  underperformerThreshold: z.number().min(0).max(100),
  reportingWindowDays: z.number().min(7).max(365)
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(await readSettings());
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const payload = settingsSchema.parse(await request.json());
    await writeSettings(payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to save settings"
      },
      { status: 400 }
    );
  }
}
