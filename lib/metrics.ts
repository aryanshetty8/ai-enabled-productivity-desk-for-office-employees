import { DEFAULT_UNDERPERFORMER_THRESHOLD } from "@/lib/constants";
import { daysBetween, median, monthKey } from "@/lib/utils";
import type {
  AnomalyRecord,
  EmployeeAssignment,
  EmployeeMetrics,
  FileRecord,
  SectionMetrics,
  User
} from "@/types";

export function getEffectiveFileStatus(file: FileRecord, now = new Date()) {
  if (file.status !== "completed" && new Date(file.due_date) < now) {
    return "overdue" as const;
  }

  return file.status;
}

function performanceTier(score: number): EmployeeMetrics["performanceTier"] {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "average";
  return "poor";
}

function clampRate(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
}

function getEmployeeFiles(user: User, files: FileRecord[], assignments: EmployeeAssignment[]) {
  const byAssignment = assignments
    .filter((assignment) => assignment.employee_id === user.id)
    .map((assignment) => files.find((file) => file.file_id === assignment.file_id))
    .filter(Boolean) as FileRecord[];

  const byUsername = files.filter((file) => file.assigned_to === user.username);
  const combined = [...byAssignment, ...byUsername];
  const deduped = new Map(combined.map((file) => [file.file_id, file]));

  return Array.from(deduped.values());
}

function buildCompletionRateForWindow(files: FileRecord[], start: Date, end: Date) {
  const relevant = files.filter((file) => {
    const received = new Date(file.received_date);
    return received >= start && received < end;
  });

  if (relevant.length === 0) {
    return 0;
  }

  const completed = relevant.filter((file) => file.completed_date).length;
  return completed / relevant.length;
}

function buildMonthlyCompletions(files: FileRecord[], months = 6) {
  const now = new Date();
  const keys = Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - index - 1), 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });

  return keys.map((key) => ({
    month: key,
    count: files.filter((file) => file.completed_date && monthKey(file.completed_date) === key).length
  }));
}

export function computeEmployeeMetrics(
  files: FileRecord[],
  assignments: EmployeeAssignment[],
  users: User[]
): EmployeeMetrics[] {
  const employees = users.filter((user) => user.role === "employee");
  const now = new Date();
  const last30Days = new Date(now);
  last30Days.setDate(last30Days.getDate() - 30);
  const last60Days = new Date(now);
  last60Days.setDate(last60Days.getDate() - 60);

  const baseMetrics = employees.map((user) => {
    const employeeFiles = getEmployeeFiles(user, files, assignments);
    const normalizedStatuses = employeeFiles.map((file) => getEffectiveFileStatus(file, now));
    const totalAssigned = employeeFiles.length;
    const completedFiles = employeeFiles.filter((file) => file.completed_date);
    const completed = completedFiles.length;
    const pending = normalizedStatuses.filter((status) => status === "pending").length;
    const overdue = normalizedStatuses.filter((status) => status === "overdue").length;
    const inProgress = normalizedStatuses.filter((status) => status === "in_progress").length;
    const completionRate = clampRate(completed, totalAssigned);
    const overdueRate = clampRate(overdue, totalAssigned);
    const onTimeCompleted = completedFiles.filter(
      (file) => file.completed_date && new Date(file.completed_date) <= new Date(file.due_date)
    ).length;
    const onTimeRate = clampRate(onTimeCompleted, completed);
    const avgProcessingDays =
      completed > 0
        ? completedFiles.reduce((sum, file) => sum + daysBetween(file.received_date, file.completed_date ?? file.received_date), 0) /
          completed
        : 0;

    const recentCompletionRate = buildCompletionRateForWindow(employeeFiles, last30Days, now);
    const previousCompletionRate = buildCompletionRateForWindow(employeeFiles, last60Days, last30Days);
    const completedInLast30Days = completedFiles.filter((file) => {
      const completedAt = file.completed_date ? new Date(file.completed_date) : null;
      return completedAt && completedAt >= last30Days;
    }).length;

    return {
      employeeId: user.id,
      username: user.username,
      name: user.name,
      section: user.section,
      totalAssigned,
      completed,
      pending,
      overdue,
      inProgress,
      completionRate,
      overdueRate,
      avgProcessingDays,
      onTimeRate,
      productivityScore: 0,
      performanceTier: "poor" as const,
      recentCompletionRate,
      previousCompletionRate,
      zeroCompletionsIn30Days: completedInLast30Days === 0 && totalAssigned > 0,
      completedInLast30Days,
      monthlyCompletions: buildMonthlyCompletions(employeeFiles)
    };
  });

  const sectionMedians = new Map<string, number>();
  const sections = Array.from(new Set(baseMetrics.map((metric) => metric.section)));

  for (const section of sections) {
    const values = baseMetrics
      .filter((metric) => metric.section === section && metric.avgProcessingDays > 0)
      .map((metric) => metric.avgProcessingDays);
    sectionMedians.set(section, median(values));
  }

  return baseMetrics.map((metric) => {
    const sectionMedian = sectionMedians.get(metric.section) ?? 0;
    const speedBonus = metric.avgProcessingDays > 0 && sectionMedian > 0 && metric.avgProcessingDays < sectionMedian ? 1 : 0;
    const productivityScore =
      metric.completionRate * 40 +
      metric.onTimeRate * 30 +
      (1 - metric.overdueRate) * 20 +
      speedBonus * 10;

    return {
      ...metric,
      productivityScore,
      performanceTier: performanceTier(productivityScore)
    };
  });
}

export function computeSectionMetrics(files: FileRecord[], users: User[]): SectionMetrics[] {
  const employeeUsers = users.filter((user) => user.role === "employee");
  const now = new Date();
  const sections = Array.from(new Set(employeeUsers.map((user) => user.section)));

  return sections.map((section) => {
    const sectionFiles = files.filter((file) => file.section === section);
    const normalizedStatuses = sectionFiles.map((file) => getEffectiveFileStatus(file, now));
    const totalFiles = sectionFiles.length;
    const completedFiles = sectionFiles.filter((file) => file.completed_date);
    const completed = completedFiles.length;
    const pending = normalizedStatuses.filter((status) => status === "pending").length;
    const overdue = normalizedStatuses.filter((status) => status === "overdue").length;
    const employeeCount = employeeUsers.filter((user) => user.section === section).length;
    const completionRate = clampRate(completed, totalFiles);
    const sectionOverdueRate = clampRate(overdue, totalFiles);
    const sectionOnTimeRate = clampRate(
      completedFiles.filter((file) => file.completed_date && new Date(file.completed_date) <= new Date(file.due_date)).length,
      completed
    );
    const avgProcessingDays =
      completed > 0
        ? completedFiles.reduce((sum, file) => sum + daysBetween(file.received_date, file.completed_date ?? file.received_date), 0) /
          completed
        : 0;
    const sectionScore = completionRate * 50 + sectionOnTimeRate * 30 + (1 - sectionOverdueRate) * 20;

    return {
      section,
      totalFiles,
      completed,
      pending,
      overdue,
      completionRate,
      avgProcessingDays,
      employeeCount,
      filesPerEmployee: employeeCount > 0 ? totalFiles / employeeCount : totalFiles,
      sectionScore,
      onTimeRate: sectionOnTimeRate
    };
  });
}

export function getUnderperformers(
  metrics: EmployeeMetrics[],
  threshold = DEFAULT_UNDERPERFORMER_THRESHOLD
): EmployeeMetrics[] {
  return metrics
    .filter((metric) => metric.productivityScore < threshold || metric.performanceTier === "poor")
    .sort((a, b) => a.productivityScore - b.productivityScore);
}

export function getTopPerformers(metrics: EmployeeMetrics[], n = 5): EmployeeMetrics[] {
  return [...metrics].sort((a, b) => b.productivityScore - a.productivityScore).slice(0, n);
}

export function detectAnomalies(metrics: EmployeeMetrics[]): AnomalyRecord[] {
  const results: AnomalyRecord[] = [];

  for (const employee of metrics) {
    const completionDrop = employee.previousCompletionRate - employee.recentCompletionRate;
    if (completionDrop >= 0.35) {
      results.push({
        employee,
        reason: `Completion rate dropped by ${Math.round(completionDrop * 100)} points in the last 30 days.`
      });
    }

    if (employee.overdue >= Math.max(3, Math.ceil(employee.totalAssigned * 0.4))) {
      results.push({
        employee,
        reason: `Overdue file load is unusually high at ${employee.overdue} files.`
      });
    }

    if (employee.zeroCompletionsIn30Days) {
      results.push({
        employee,
        reason: "No files have been completed in the last 30 days."
      });
    }
  }

  return results;
}
