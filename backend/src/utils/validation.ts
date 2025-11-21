import { z } from 'zod';

export const generateCodeSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters long')
    .max(1000, 'Prompt must be less than 1000 characters'),
  language: z.string().min(1, 'Language is required'),
});

export const historyQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 50, 'Limit must be between 1 and 50'),
});
