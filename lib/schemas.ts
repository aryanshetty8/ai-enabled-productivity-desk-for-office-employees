import { z } from "zod";

import { FILE_PRIORITIES, FILE_STATUSES, SECTIONS } from "@/lib/constants";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required.")
});

export const fileSchema = z.object({
  file_id: z.string().optional(),
  file_number: z.string().min(1),
  file_title: z.string().min(3),
  file_type: z.string().min(2),
  section: z.enum(SECTIONS),
  received_date: z.string().min(1),
  due_date: z.string().min(1),
  completed_date: z.string().optional().or(z.literal("")),
  status: z.enum(FILE_STATUSES),
  priority: z.enum(FILE_PRIORITIES),
  assigned_to: z.string().min(1),
  remarks: z.string().optional().or(z.literal(""))
});

export const summarySchema = z.object({
  type: z.enum(["employee", "section", "overview"]),
  id: z.string().optional()
});

export const chatSchema = z.object({
  context: z.enum(["employee", "section", "overview"]).optional(),
  messages: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
        timestamp: z.string()
      })
    )
    .min(1)
});

export const adminUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8).optional(),
  role: z.enum(["admin", "employee"]),
  name: z.string().min(2),
  section: z.enum(SECTIONS),
  designation: z.string().min(2),
  joining_date: z.string().min(1),
  email: z.string().email()
});
