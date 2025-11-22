import { Router } from 'express';
import languageController from '../controllers/language.controller';

const router = Router();

/**
 * @swagger
 * /api/languages:
 *   get:
 *     summary: Get all supported programming languages
 *     tags: [Languages]
 *     responses:
 *       200:
 *         description: List of all supported languages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 languages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Language'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/languages',
  (req, res, next) => languageController.getAllLanguages(req, res, next)
);

/**
 * @swagger
 * /api/languages/seed:
 *   post:
 *     summary: Seed languages into database (admin use)
 *     tags: [Languages]
 *     responses:
 *       200:
 *         description: Languages seeded successfully
 */
router.post(
  '/languages/seed',
  (req, res, next) => languageController.seedLanguages(req, res, next)
);

export default router;
