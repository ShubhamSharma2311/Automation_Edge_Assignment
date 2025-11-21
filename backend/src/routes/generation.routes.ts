import { Router } from 'express';
import generationController from '../controllers/generation.controller';
import { validateRequest, validateQuery } from '../middleware/validation.middleware';
import { generateCodeSchema, historyQuerySchema } from '../utils/validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/generate:
 *   post:
 *     summary: Generate code using AI (Protected)
 *     tags: [Code Generation]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *               - languageId
 *             properties:
 *               prompt:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: Create a function to reverse a string
 *               languageId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *                 description: ID of the programming language (use /api/languages to get list)
 *     responses:
 *       201:
 *         description: Code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Generation'
 *       400:
 *         description: Invalid request or language not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/generate',
  authenticate,
  validateRequest(generateCodeSchema),
  (req, res, next) => generationController.generate(req, res, next)
);

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get user's code generation history (Protected)
 *     tags: [Code Generation]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: History retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Generation'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalItems:
 *                       type: integer
 *                       example: 48
 *                     itemsPerPage:
 *                       type: integer
 *                       example: 10
 *                     hasNext:
 *                       type: boolean
 *                       example: true
 *                     hasPrevious:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/history',
  authenticate,
  (req, res, next) => generationController.getHistory(req, res, next)
);

export default router;
