import { Router } from 'express';
import generationController from '../controllers/generation.controller';
import { validateRequest, validateQuery } from '../middleware/validation.middleware';
import { generateCodeSchema, historyQuerySchema } from '../utils/validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/generate - Generate code (protected route)
router.post(
  '/generate',
  authenticate,
  validateRequest(generateCodeSchema),
  (req, res, next) => generationController.generate(req, res, next)
);

// GET /api/history - Get generation history with pagination (protected route)
router.get(
  '/history',
  authenticate,
  validateQuery(historyQuerySchema),
  (req, res, next) => generationController.getHistory(req, res, next)
);

export default router;
