import { Router } from 'express';
import languageController from '../controllers/language.controller';

const router = Router();

// GET /api/languages - Get all supported languages
router.get(
  '/languages',
  (req, res, next) => languageController.getAllLanguages(req, res, next)
);

export default router;
