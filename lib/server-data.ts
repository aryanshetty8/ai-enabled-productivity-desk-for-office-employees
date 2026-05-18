import { readCSV } from "@/lib/csv";
import {
  computeEmployeeMetrics,
  computeSectionMetrics,
  detectAnomalies,
  getEffectiveFileStatus,
  getTopPerformers,
  getUnderperformers
} from "@/lib/metrics";
import { monthKey } from "@/lib/utils";
import type {
  DashboardSnapshot,
  EmployeeAssignment,
  EmployeeMetrics,
  FileRecord,
  JWTPayload,
  SectionMetrics,
  User
} from "@/types";

export async function readUsers() {
  return await readCSV<User>("users.csv");
}

export async function readFiles() {
  return await readCSV<FileRecord>("forest_eoffice_data.csv");
}

export async function readAssignments() {
  return await readCSV<EmployeeAssignment>("employee_files.csv");
}

export function sanitizeUser<T extends User>(user: T) {
  const { password_hash, ...rest } = user;
  return rest;
}

export function sanitizeUsers(users: User[]) {
  return users.map(sanitizeUser);
}

export async function getDashboardSnapshot(session?: JWTPayload | null): Promise<DashboardSnapshot> {
  const [users, files, assignments] = await Promise.all([readUsers(), readFiles(), readAssignments()]);
  const employeeMetrics = computeEmployeeMetrics(files, assignments, users);
  const sectionMetrics = computeSectionMetrics(files, users);

  if (session?.role === "employee") {
    const self = employeeMetrics.filter((metric) => metric.username === session.username);
    const sectionOnly = sectionMetrics.filter((metric) => metric.section === session.section);

    return {
      employees: self,
      sections: sectionOnly,
      underperformers: getUnderperformers(self),
      topPerformers: getTopPerformers(self, 1),
      anomalies: detectAnomalies(self)
    };
  }

  return {
    employees: employeeMetrics,
    sections: sectionMetrics,
    underperformers: getUnderperformers(employeeMetrics),
    topPerformers: getTopPerformers(employeeMetrics),
    anomalies: detectAnomalies(employeeMetrics)
  };
}

export async function getEmployeeMetricById(id: string) {
  const [users, files, assignments] = await Promise.all([readUsers(), readFiles(), readAssignments()]);
  const employeeMetrics = computeEmployeeMetrics(files, assignments, users);
  const user = users.find((entry) => entry.id === id || entry.username === id);
  const metric = employeeMetrics.find((entry) => entry.employeeId === id || entry.username === id);
  const employeeFiles = files.filter((file) => file.assigned_to === (user?.username ?? id));

  return {
    user,
    metric,
    files: employeeFiles
  };
}

export async function getSectionDetail(section: string) {
  const [users, files, assignments] = await Promise.all([readUsers(), readFiles(), readAssignments()]);
  const employeeMetrics = computeEmployeeMetrics(files, assignments, users);
  const sectionMetrics = computeSectionMetrics(files, users);
  const selectedSection = sectionMetrics.find((entry) => entry.section.toLowerCase() === section.toLowerCase());

  return {
    section: selectedSection,
    employees: employeeMetrics
      .filter((entry) => entry.section.toLowerCase() === section.toLowerCase())
      .sort((a, b) => b.productivityScore - a.productivityScore),
    files: files.filter((file) => file.section.toLowerCase() === section.toLowerCase()),
    comparisons: sectionMetrics
  };
}

export function getRecentActivity(files: FileRecord[]) {
  return [...files]
    .filter((file) => file.completed_date)
    .sort((a, b) => new Date(b.completed_date ?? 0).getTime() - new Date(a.completed_date ?? 0).getTime())
    .slice(0, 10);
}

export function getMonthlyFileVolumes(files: FileRecord[]) {
  const allKeys = Array.from(
    new Set(
      files.flatMap((file) => [
        monthKey(file.received_date),
        file.completed_date ? monthKey(file.completed_date) : ""
      ])
    )
  )
    .filter(Boolean)
    .sort();

  return allKeys.map((key) => ({
    month: key,
    received: files.filter((file) => monthKey(file.received_date) === key).length,
    completed: files.filter((file) => file.completed_date && monthKey(file.completed_date) === key).length
  }));
}

export async function getFileAnalytics() {
  const files = await readFiles();

  return {
    files,
    activity: getRecentActivity(files),
    monthlyVolume: getMonthlyFileVolumes(files)
  };
}

export async function getCurrentSectionMetrics(
  section: string,
  session?: JWTPayload | null
): Promise<SectionMetrics | undefined> {
  const snapshot = await getDashboardSnapshot(session);
  return snapshot.sections.find((entry) => entry.section.toLowerCase() === section.toLowerCase());
}

export async function getCurrentEmployeeMetrics(
  id: string,
  session?: JWTPayload | null
): Promise<EmployeeMetrics | undefined> {
  const snapshot = await getDashboardSnapshot(session);
  return snapshot.employees.find((entry) => entry.employeeId === id || entry.username === id);
}

export function filterFiles(
  files: FileRecord[],
  filters: {
    section?: string | null;
    status?: string | null;
    assigned_to?: string | null;
    from?: string | null;
    to?: string | null;
  }
) {
  return files.filter((file) => {
    if (filters.section && file.section !== filters.section) return false;
    if (filters.status && getEffectiveFileStatus(file) !== filters.status) return false;
    if (filters.assigned_to && file.assigned_to !== filters.assigned_to) return false;
    if (filters.from && new Date(file.received_date) < new Date(filters.from)) return false;
    if (filters.to && new Date(file.received_date) > new Date(filters.to)) return false;
    return true;
  });
}

export function withDerivedStatus(files: FileRecord[]) {
  return files.map((file) => ({
    ...file,
    status: getEffectiveFileStatus(file)
  }));
}
