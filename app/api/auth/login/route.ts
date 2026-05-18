import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { applySessionCookie, signJWT } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas";
import { readUsers } from "@/lib/server-data";
import type { JWTPayload } from "@/types";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const users = await readUsers();
    const user = users.find((entry) => entry.username === body.username);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isBootstrapUser = user.password_hash === "seed_required" && body.password === "forest@123";
    const passwordMatches = isBootstrapUser ? true : await bcrypt.compare(body.password, user.password_hash);

    if (!passwordMatches) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      section: user.section
    };

    const token = await signJWT(payload);
    const response = NextResponse.json({ user: payload });

    return applySessionCookie(response, token);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to login"
      },
      { status: 400 }
    );
  }
}
