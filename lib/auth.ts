import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

import { SESSION_COOKIE } from "@/lib/constants";
import type { JWTPayload } from "@/types";

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long.");
  }

  return new TextEncoder().encode(secret);
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecret());
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  const result = await jwtVerify(token, getSecret());
  return result.payload as unknown as JWTPayload;
}

export async function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyJWT(token);
  } catch {
    return null;
  }
}

export function applySessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });

  return response;
}
