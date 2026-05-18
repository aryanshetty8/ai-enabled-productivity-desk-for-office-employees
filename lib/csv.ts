import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";

import Papa from "papaparse";

const DATA_DIR = path.join(process.cwd(), "data");

async function resolveDataFile(filename: string) {
  await mkdir(DATA_DIR, { recursive: true });
  return path.join(DATA_DIR, filename);
}

export async function readCSV<T>(filename: string): Promise<T[]> {
  const filePath = await resolveDataFile(filename);

  try {
    const content = await readFile(filePath, "utf8");
    const result = Papa.parse<T>(content, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });

    return result.data.filter((row) => Object.values(row as Record<string, unknown>).some(Boolean));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writeCSV<T>(filename: string, data: T[]): Promise<void> {
  const filePath = await resolveDataFile(filename);
  const tempPath = `${filePath}.tmp`;
  const csv = Papa.unparse(data, {
    quotes: false
  });

  await writeFile(tempPath, csv, "utf8");
  await rename(tempPath, filePath);
}

export async function appendCSVRow<T>(filename: string, row: T): Promise<void> {
  const existing = await readCSV<T>(filename);
  existing.push(row);
  await writeCSV(filename, existing);
}

export async function updateCSVRow<T>(
  filename: string,
  idField: keyof T,
  id: string,
  updates: Partial<T>
): Promise<void> {
  const existing = await readCSV<T>(filename);
  const next = existing.map((row) =>
    String((row as Record<string, unknown>)[String(idField)] ?? "") === id ? { ...row, ...updates } : row
  );
  await writeCSV(filename, next);
}

export async function deleteCSVRow<T>(
  filename: string,
  idField: keyof T,
  id: string
): Promise<void> {
  const existing = await readCSV<T>(filename);
  const next = existing.filter((row) => String((row as Record<string, unknown>)[String(idField)] ?? "") !== id);
  await writeCSV(filename, next);
}
