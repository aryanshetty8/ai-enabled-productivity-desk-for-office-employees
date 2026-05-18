import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { readSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await readSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Settings"
        title="System Settings"
        description="Review environment-backed LLM status and persist threshold values to settings.json."
      />
      <SettingsPanel
        initialThreshold={settings.underperformerThreshold}
        initialWindow={settings.reportingWindowDays}
        anthropicConfigured={Boolean(process.env.ANTHROPIC_API_KEY)}
      />
    </div>
  );
}
