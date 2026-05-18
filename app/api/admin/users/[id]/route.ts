import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getSession } from "@/lib/auth";
import { deleteCSVRow, readCSV, updateCSVRow } from "@/lib/csv";
import { adminUserSchema } from "@/lib/schemas";
import { sanitizeUser } from "@/lib/server-data";
import type { User } from "@/types";

const updateSchema = adminUserSchema.partial().extend({
  password: z.string().min(8).optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await readCSV<User>("users.csv");
  const user = users.find((entry) => entry.id === params.id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(sanitizeUser(user));
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const payload = updateSchema.parse(await request.json());
    const updates: Partial<User> = {
      ...(payload.username ? { username: payload.username } : {}),
      ...(payload.role ? { role: payload.role } : {}),
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.section ? { section: payload.section } : {}),
      ...(payload.designation ? { designation: payload.designation } : {}),
      ...(payload.joining_date ? { joining_date: payload.joining_date } : {}),
      ...(payload.email ? { email: payload.email } : {})
    };

    if (payload.password) {
      updates.password_hash = await bcrypt.hash(payload.password, 10);
    }

    await updateCSVRow<User>("users.csv", "id", params.id, updates);
    const users = await readCSV<User>("users.csv");
    const user = users.find((entry) => entry.id === params.id);

    return NextResponse.json(user ? sanitizeUser(user) : { success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to update user"
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

  await deleteCSVRow<User>("users.csv", "id", params.id);
  return NextResponse.json({ success: true });
}
