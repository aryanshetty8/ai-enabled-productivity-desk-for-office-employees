"use client";

import { useEffect, useState } from "react";

import type { JWTPayload } from "@/types";

export function useCurrentUser() {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me")
      .then(async (response) => {
        const payload = (await response.json()) as { user?: JWTPayload | null };
        if (active) {
          setUser(payload.user ?? null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { user, loading };
}
