export type Role = "admin" | "employee";
export type FileStatus = "pending" | "in_progress" | "completed" | "overdue" | "escalated";
export type Priority = "low" | "medium" | "high" | "urgent";
export type Section =
  | "Wildlife"
  | "Plantation"
  | "Administration"
  | "Finance"
  | "Enforcement"
  | "Research";

export interface User {
  id: string;
  username: string;
  password_hash: string;
  role: Role;
  name: string;
  section: Section;
  designation: string;
  joining_date: string;
  email: string;
}

export interface FileRecord {
  file_id: string;
  file_number: string;
  file_title: string;
  file_type: string;
  section: Section;
  received_date: string;
  due_date: string;
  completed_date?: string;
  status: FileStatus;
  priority: Priority;
  assigned_to: string;
  remarks?: string;
}

export interface EmployeeAssignment {
  assignment_id: string;
  employee_id: string;
  file_id: string;
  assigned_date: string;
  role_in_file: "primary" | "secondary";
  status: FileStatus;
}

export interface EmployeeMetrics {
  employeeId: string;
  username: string;
  name: string;
  section: Section;
  totalAssigned: number;
  completed: number;
  pending: number;
  overdue: number;
  inProgress: number;
  completionRate: number;
  overdueRate: number;
  avgProcessingDays: number;
  onTimeRate: number;
  productivityScore: number;
  performanceTier: "excellent" | "good" | "average" | "poor";
  recentCompletionRate: number;
  previousCompletionRate: number;
  zeroCompletionsIn30Days: boolean;
  completedInLast30Days: number;
  monthlyCompletions: Array<{ month: string; count: number }>;
}

export interface SectionMetrics {
  section: Section;
  totalFiles: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  avgProcessingDays: number;
  employeeCount: number;
  filesPerEmployee: number;
  sectionScore: number;
  onTimeRate: number;
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: Role;
  name: string;
  section: Section;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DashboardSnapshot {
  employees: EmployeeMetrics[];
  sections: SectionMetrics[];
  underperformers: AnomalyRecord["employee"][];
  topPerformers: EmployeeMetrics[];
  anomalies: AnomalyRecord[];
}

export interface AnomalyRecord {
  employee: EmployeeMetrics;
  reason: string;
}

export interface SummaryResponse {
  summary: string;
  suggestions: string[];
  riskFlags: string[];
}
