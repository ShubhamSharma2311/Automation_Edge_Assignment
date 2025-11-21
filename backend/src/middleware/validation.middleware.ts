import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        error: 'Validation Error',
        message: error.errors?.[0]?.message || 'Invalid request data',
        details: error.errors,
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = await schema.parseAsync(req.query);
      req.query = validatedQuery as any;
      next();
    } catch (error: any) {
      res.status(400).json({
        error: 'Validation Error',
        message: error.errors?.[0]?.message || 'Invalid query parameters',
        details: error.errors,
      });
    }
  };
};
