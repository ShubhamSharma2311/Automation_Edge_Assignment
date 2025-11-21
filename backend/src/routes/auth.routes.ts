import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { signupSchema, loginSchema } from '../utils/validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post(
  '/signup',
  validateRequest(signupSchema),
  authController.signup
);

/**
 * POST /api/auth/login
 * Login an existing user
 */
router.post(
  '/login',
  validateRequest(loginSchema),
  authController.login
);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get(
  '/me',
  authenticate,
  authController.getCurrentUser
);

export default router;
