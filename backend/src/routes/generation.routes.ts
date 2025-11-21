import { Router } from 'express';
import generationController from '../controllers/generation.controller';
import { validateRequest, validateQuery } from '../middleware/validation.middleware';
import { generateCodeSchema, historyQuerySchema } from '../utils/validation';

const router = Router();

// POST /api/generate - Generate code
router.post(
  '/generate',
  validateRequest(generateCodeSchema),
  (req, res, next) => generationController.generate(req, res, next)
);

// GET /api/history - Get generation history with pagination
router.get(
  '/history',
  validateQuery(historyQuerySchema),
  (req, res, next) => generationController.getHistory(req, res, next)
);

export default router;
