import { z } from 'zod';

export const generateCodeSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters long')
    .max(1000, 'Prompt must be less than 1000 characters'),
  language: z.string().min(1, 'Language is required'),
});

export const historyQuerySchema = z.object({
  page: z.coerce.number().positive().optional().default(1),
  limit: z.coerce.number().positive().max(50).optional().default(10),
});
