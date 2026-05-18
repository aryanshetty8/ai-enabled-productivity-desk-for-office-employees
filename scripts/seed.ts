import { mkdir, writeFile } from "fs/promises";
import path from "path";

import bcrypt from "bcryptjs";
import Papa from "papaparse";

import type { EmployeeAssignment, FileRecord, User } from "../types";

const FILE_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
const FILE_TYPES = [
  "Permit",
  "Proposal",
  "Inspection Report",
  "Complaint",
  "Notice",
  "Budget",
  "Circular",
  "Correspondence"
] as const;
const SECTIONS = [
  "Wildlife",
  "Plantation",
  "Administration",
  "Finance",
  "Enforcement",
  "Research"
] as const;

const dataDir = path.join(process.cwd(), "data");

const baseUsers: Array<Omit<User, "password_hash">> = [
  {
    id: "1",
    username: "admin",
    role: "admin",
    name: "Admin User",
    section: "Administration",
    designation: "System Admin",
    joining_date: "2020-01-01",
    email: "admin@forest.gov.in"
  },
  {
    id: "2",
    username: "ramesh",
    role: "employee",
    name: "Ramesh Kumar",
    section: "Wildlife",
    designation: "Forest Ranger",
    joining_date: "2021-03-15",
    email: "ramesh@forest.gov.in"
  },
  {
    id: "3",
    username: "sita",
    role: "employee",
    name: "Sita Devi",
    section: "Plantation",
    designation: "Jr. Officer",
    joining_date: "2022-06-01",
    email: "sita@forest.gov.in"
  },
  {
    id: "4",
    username: "ajay",
    role: "employee",
    name: "Ajay Sharma",
    section: "Administration",
    designation: "Clerk",
    joining_date: "2020-09-10",
    email: "ajay@forest.gov.in"
  },
  {
    id: "5",
    username: "pooja",
    role: "employee",
    name: "Pooja Nair",
    section: "Finance",
    designation: "Accountant",
    joining_date: "2021-11-20",
    email: "pooja@forest.gov.in"
  },
  {
    id: "6",
    username: "vikram",
    role: "employee",
    name: "Vikram Sen",
    section: "Research",
    designation: "Research Associate",
    joining_date: "2023-02-11",
    email: "vikram@forest.gov.in"
  },
  {
    id: "7",
    username: "meera",
    role: "employee",
    name: "Meera Das",
    section: "Enforcement",
    designation: "Beat Officer",
    joining_date: "2022-04-08",
    email: "meera@forest.gov.in"
  }
];

const titlesBySection: Record<string, string[]> = {
  Wildlife: ["Transit Permit Review", "Rescue Memo", "Patrolling Report", "Census Circular", "Camera Trap Proposal"],
  Plantation: ["Drive Proposal", "Survival Report", "Nursery Note", "Seedling Approval", "Stock Inspection"],
  Administration: ["Attendance File", "Movement Note", "Procurement File", "Service Book Update", "Inspection Pending Note"],
  Finance: ["Budget Approval", "Arrear Clarification", "Account Reconciliation", "Advance Settlement", "Grant Ledger"],
  Enforcement: ["Seizure Case", "Encroachment Dossier", "Field Complaint", "Patrol Action Memo", "Court Reply Notice"],
  Research: ["Plot Access Request", "Grant Statement", "Collaboration Approval", "Sampling Note", "Study Review Memo"]
};

function pick<T>(items: readonly T[], index: number) {
  return items[index % items.length];
}

function addDays(value: Date, amount: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + amount);
  return next;
}

function iso(value: Date) {
  return value.toISOString().slice(0, 10);
}

function fileStatusForUser(username: string, monthIndex: number, itemIndex: number): FileRecord["status"] {
  const patternKey = `${username}-${monthIndex % 4}-${itemIndex % 5}`;

  if (username === "ramesh") return itemIndex % 6 === 0 ? "in_progress" : "completed";
  if (username === "sita") return itemIndex % 4 === 0 ? "pending" : itemIndex % 5 === 0 ? "in_progress" : "completed";
  if (username === "ajay") return itemIndex % 2 === 0 ? "pending" : itemIndex % 3 === 0 ? "in_progress" : "escalated";
  if (username === "pooja") return monthIndex < 3 ? (itemIndex % 3 === 0 ? "pending" : "completed") : "completed";
  if (username === "meera") return itemIndex % 4 === 0 ? "pending" : itemIndex % 5 === 0 ? "escalated" : "completed";
  if (username === "vikram") return patternKey.length % 3 === 0 ? "in_progress" : "completed";
  return "completed";
}

async function main() {
  await mkdir(dataDir, { recursive: true });

  const passwordHash = await bcrypt.hash("forest@123", 10);
  const users: User[] = baseUsers.map((user) => ({ ...user, password_hash: passwordHash }));
  const employees = users.filter((user) => user.role === "employee");

  const files: FileRecord[] = [];
  const assignments: EmployeeAssignment[] = [];
  const today = new Date();
  const start = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);
  let fileCounter = 1;
  let assignmentCounter = 1;

  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    for (let employeeIndex = 0; employeeIndex < employees.length; employeeIndex += 1) {
      const employee = employees[employeeIndex];
      const volume = employee.username === "ajay" ? 3 : employee.username === "ramesh" ? 4 : 3;

      for (let itemIndex = 0; itemIndex < volume; itemIndex += 1) {
        const received = addDays(new Date(start.getFullYear(), start.getMonth() + monthIndex, 1), 2 + itemIndex * 3 + employeeIndex);
        const due = addDays(received, 7 + ((itemIndex + employeeIndex) % 6));
        const status = fileStatusForUser(employee.username, monthIndex, itemIndex);
        const isCompleted = status === "completed";
        const delayed =
          employee.username === "sita"
            ? itemIndex % 2 === 0
            : employee.username === "ajay"
              ? true
              : employee.username === "pooja" && monthIndex < 3;
        const completedDate = isCompleted ? iso(addDays(received, delayed ? 12 : 5 + ((monthIndex + itemIndex) % 3))) : "";
        const titleSeed = pick(titlesBySection[employee.section], monthIndex + itemIndex);

        const file: FileRecord = {
          file_id: `F${String(fileCounter).padStart(3, "0")}`,
          file_number: `/DFO/${today.getFullYear()}/${String(fileCounter).padStart(3, "0")}`,
          file_title: `${titleSeed} ${monthIndex + 1}/${itemIndex + 1}`,
          file_type: pick(FILE_TYPES, fileCounter),
          section: employee.section,
          received_date: iso(received),
          due_date: iso(due),
          completed_date: completedDate,
          status,
          priority: pick(FILE_PRIORITIES, fileCounter + employeeIndex),
          assigned_to: employee.username,
          remarks: status === "completed" ? "Closed" : "Pending action"
        };

        files.push(file);
        assignments.push({
          assignment_id: `A${String(assignmentCounter).padStart(3, "0")}`,
          employee_id: employee.id,
          file_id: file.file_id,
          assigned_date: file.received_date,
          role_in_file: "primary",
          status
        });

        fileCounter += 1;
        assignmentCounter += 1;
      }
    }
  }

  await writeFile(path.join(dataDir, "users.csv"), Papa.unparse(users), "utf8");
  await writeFile(path.join(dataDir, "forest_eoffice_data.csv"), Papa.unparse(files), "utf8");
  await writeFile(path.join(dataDir, "employee_files.csv"), Papa.unparse(assignments), "utf8");
  await writeFile(
    path.join(dataDir, "settings.json"),
    JSON.stringify({ underperformerThreshold: 40, reportingWindowDays: 30 }, null, 2),
    "utf8"
  );

  console.log(`Seeded ${users.length} users, ${files.length} files, and ${assignments.length} assignments.`);
  console.log("Default password for all users: forest@123");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
