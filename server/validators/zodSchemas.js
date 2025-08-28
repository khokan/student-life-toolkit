const { z } = require('zod');


const scheduleCreate = z.object({
subject: z.string().min(1, 'Subject required'),
day: z.string().min(1),
startTime: z.string().min(1),
endTime: z.string().min(1),
instructor: z.string().optional(),
color: z.string().regex(/^#/).optional()
});


const budgetCreate = z.object({
type: z.enum(['income','expense']),
amount: z.number().nonnegative('Amount must be positive'),
category: z.string().optional(),
note: z.string().optional(),
});


const questionCreate = z.object({
type: z.enum(['mcq','short','tf']),
difficulty: z.enum(['easy','medium','hard']).optional(),
prompt: z.string().min(1),
options: z.array(z.string()).optional(),
answer: z.string().optional()
});


const taskCreate = z.object({
subject: z.string().min(1),
topic: z.string().optional(),
priority: z.enum(['low','med','high']).optional(),
deadline: z.string().optional(),
slots: z.number().int().positive().optional()
});


module.exports = { scheduleCreate };