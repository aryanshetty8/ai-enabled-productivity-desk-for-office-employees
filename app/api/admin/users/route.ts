import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { appendCSVRow, readCSV } from "@/lib/csv";
import { adminUserSchema } from "@/lib/schemas";
import { sanitizeUsers } from "@/lib/server-data";
import type { User } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await readCSV<User>("users.csv");
  return NextResponse.json(sanitizeUsers(users));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await readCSV<User>("users.csv");
    const payload = adminUserSchema.parse(await request.json());

    if (users.some((user) => user.username === payload.username)) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(payload.password ?? "forest@123", 10);
    const nextId = String(Math.max(0, ...users.map((user) => Number(user.id) || 0)) + 1);
    const nextUser: User = {
      id: nextId,
      username: payload.username,
      password_hash: passwordHash,
      role: payload.role,
      name: payload.name,
      section: payload.section,
      designation: payload.designation,
      joining_date: payload.joining_date,
      email: payload.email
    };

    await appendCSVRow("users.csv", nextUser);
    return NextResponse.json(nextUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create user"
      },
      { status: 400 }
    );
  }
}
