import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { readUsers, sanitizeUsers } from "@/lib/server-data";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await readUsers();

  if (session.role === "employee") {
    const self = users.find((user) => user.id === session.userId);
    return NextResponse.json(self ? [sanitizeUsers([self])[0]] : []);
  }

  return NextResponse.json(sanitizeUsers(users));
}
