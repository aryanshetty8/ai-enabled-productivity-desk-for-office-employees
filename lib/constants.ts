import type { Role } from "@/types";

export const APP_NAME = "Forest eOffice";
export const SESSION_COOKIE = "forest_session";

export const ROLES: Role[] = ["admin", "employee"];
export const FILE_STATUSES = ["pending", "in_progress", "completed", "overdue", "escalated"] as const;
export const FILE_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export const SECTIONS = [
  "Wildlife",
  "Plantation",
  "Administration",
  "Finance",
  "Enforcement",
  "Research"
] as const;

export const FILE_TYPES = [
  "Permit",
  "Proposal",
  "Inspection Report",
  "Complaint",
  "Notice",
  "Budget",
  "Circular",
  "Correspondence"
];

export const PERFORMANCE_COLORS = {
  excellent: "#16a34a",
  good: "#2563eb",
  average: "#d97706",
  poor: "#dc2626"
} as const;

export const DEFAULT_UNDERPERFORMER_THRESHOLD = 40;
