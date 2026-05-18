import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const settingsPath = path.join(process.cwd(), "data", "settings.json");

export interface AppSettings {
  underperformerThreshold: number;
  reportingWindowDays: number;
}

const defaults: AppSettings = {
  underperformerThreshold: 40,
  reportingWindowDays: 30
};

export async function readSettings(): Promise<AppSettings> {
  try {
    const content = await readFile(settingsPath, "utf8");
    return { ...defaults, ...(JSON.parse(content) as Partial<AppSettings>) };
  } catch {
    return defaults;
  }
}

export async function writeSettings(settings: AppSettings) {
  await mkdir(path.dirname(settingsPath), { recursive: true });
  await writeFile(settingsPath, JSON.stringify(settings, null, 2), "utf8");
}
