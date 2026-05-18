"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import type { SummaryResponse } from "@/types";

export function AISummaryCard({
  type,
  id,
  title,
  description
}: {
  type: "employee" | "section" | "overview";
  id?: string;
  title: string;
  description: string;
}) {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/llm-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to generate summary.");
      }

      setData((await response.json()) as SummaryResponse);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to generate summary.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title={title}
        description={description}
        action={
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate AI Summary"}
          </Button>
        }
      />
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {data ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-900/50">Summary</h4>
            <p className="mt-2 text-sm leading-6 text-forest-900/80">{data.summary}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-900/50">Suggestions</h4>
            <ul className="mt-2 space-y-2 text-sm text-forest-900/80">
              {data.suggestions.map((suggestion) => (
                <li key={suggestion}>- {suggestion}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-900/50">Risk Flags</h4>
            <ul className="mt-2 space-y-2 text-sm text-forest-900/80">
              {data.riskFlags.length > 0 ? data.riskFlags.map((flag) => <li key={flag}>- {flag}</li>) : <li>- No immediate risk flags.</li>}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-sm text-forest-900/60">Generate a grounded summary based on the latest metrics snapshot.</p>
      )}
    </Card>
  );
}
