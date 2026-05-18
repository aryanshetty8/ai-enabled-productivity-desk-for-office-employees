"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SettingsPanel({
  initialThreshold,
  initialWindow,
  anthropicConfigured
}: {
  initialThreshold: number;
  initialWindow: number;
  anthropicConfigured: boolean;
}) {
  const [threshold, setThreshold] = useState(initialThreshold);
  const [windowDays, setWindowDays] = useState(initialWindow);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSave() {
    setStatus(null);
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        underperformerThreshold: threshold,
        reportingWindowDays: windowDays
      })
    });

    const payload = (await response.json()) as { success?: boolean; error?: string };
    setStatus(payload.success ? "Settings saved." : payload.error ?? "Unable to save settings.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader title="LLM Configuration" description="Environment-backed model settings." />
        <div className="space-y-3 text-sm">
          <div className="rounded-2xl bg-forest-50/80 p-4">
            <p className="font-semibold">Anthropic API Key</p>
            <p className="mt-1 text-forest-900/65">{anthropicConfigured ? "Configured in environment." : "Not configured. Local fallback summaries are active."}</p>
          </div>
          <div className="rounded-2xl bg-forest-50/80 p-4">
            <p className="font-semibold">Model</p>
            <p className="mt-1 text-forest-900/65">claude-sonnet-4-20250514</p>
          </div>
        </div>
      </Card>
      <Card>
        <CardHeader title="Performance Thresholds" description="Persisted to data/settings.json." />
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Underperformer Threshold</label>
            <Input type="number" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Reporting Window Days</label>
            <Input type="number" value={windowDays} onChange={(event) => setWindowDays(Number(event.target.value))} />
          </div>
          {status ? <p className="text-sm text-forest-900/70">{status}</p> : null}
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
}
