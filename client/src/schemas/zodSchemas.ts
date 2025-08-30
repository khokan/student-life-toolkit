import { z } from "zod";

// Example: Schedule schema
export const scheduleSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  day: z.string().min(1, "Day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  instructor: z.string().min(1, "Instructor is required"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color"),
});

// Example: Budget schema
export const budgetSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
      message: "Date must be in YYYY-MM-DDTHH:mm format",
    })
    .transform((val) => val + ":00"), // append seconds to make ISO string
});

export const plannerSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
    message: "Deadline must be in YYYY-MM-DDTHH:mm format",
  }),
  slots: z
    .array(
      z.object({
        day: z.string().min(1, "Day required"),
        startTime: z.string().min(1, "Start time required"),
        endTime: z.string().min(1, "End time required"),
      })
    )
    .min(1, "At least one slot is required"),
});

export const examSchema = z.object({
  type: z.enum(["mcq", "short", "tf"]),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  prompt: z.string().min(1),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
});
