import { z } from "zod";

// Example: Schedule schema
export const scheduleSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  day: z.string().min(1, "Day is required"),
  time: z.string().min(1, "Time is required"),
  instructor: z.string().min(1, "Instructor is required"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color"),
});

// Example: Budget schema
export const budgetSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  date: z.string().datetime(),
});
