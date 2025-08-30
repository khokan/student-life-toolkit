const { z } = require("zod");

const scheduleCreate = z.object({
  subject: z.string().min(1, "Subject is required"),
  instructor: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  colorCode: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, "Must be a valid hex color like #FF5733")
    .optional()
    .default("#2196F3"),
});

const budgetCreate = z.object({
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type must be income or expense" }),
  }),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be positive"),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/, {
    message: "Date must be in YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss format",
  }),
});

const examCreate = z.object({
  type: z.enum(["mcq", "short", "tf"]),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  prompt: z.string().min(1),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
});

const plannerCreate = z.object({
  subject: z.string().min(1),
  topic: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.string().optional(),
  slots: z
    .array(
      z.object({
        day: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
});

module.exports = { scheduleCreate, budgetCreate, examCreate, plannerCreate };
