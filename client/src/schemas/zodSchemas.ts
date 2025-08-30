import { refine, z } from "zod";

// Example: Schedule schema

export const scheduleSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  instructor: z.string().min(1, "Instructor is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  colorCode: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, "Invalid color code")
    .optional()
    .default("#2196F3"),
});

// Example: Budget schema
export const budgetSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  date: z.date(),
  // .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
  //   message: "Date must be in YYYY-MM-DDTHH:mm format",
  // })
  // .transform((val) => val + ":00"), // append seconds to make ISO string
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

export const examSchema = z
  .object({
    type: z.enum(["mcq", "short", "tf"]),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    prompt: z.string().min(1, "Question prompt is required"),
    options: z.array(z.string().min(1)).max(4), // up to 4
    answer: z.string().min(1, "Correct answer is required"),
  })
  .refine(
    (data) => {
      if (data.type === "mcq") {
        return data.options.length >= 2 && data.options.includes(data.answer);
      }
      return true;
    },
    {
      message:
        "MCQ must have at least 2 options, and the answer must be one of them",
      path: ["answer"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "tf") {
        return data.answer === "true" || data.answer === "false";
      }
      return true;
    },
    {
      message: "True/False answer must be 'true' or 'false'",
      path: ["answer"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "short") {
        return data.answer && data.answer.length > 0;
      }
      return true;
    },
    {
      message: "Short answer must not be empty",
      path: ["answer"],
    }
  );
