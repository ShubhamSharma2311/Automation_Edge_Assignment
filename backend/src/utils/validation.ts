import { z } from 'zod';

export const generateCodeSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters long')
    .max(1000, 'Prompt must be less than 1000 characters'),
  languageId: z.number().int().positive('Language ID must be a positive integer'),
});

export const historyQuerySchema = z.object({
  page: z.string().optional().transform(val => {
    const num = val ? parseInt(val, 10) : 1;
    return isNaN(num) || num < 1 ? 1 : num;
  }),
  limit: z.string().optional().transform(val => {
    const num = val ? parseInt(val, 10) : 10;
    return isNaN(num) || num < 1 ? 10 : Math.min(num, 50);
  }),
}).passthrough();

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be less than 100 characters'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be less than 100 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
