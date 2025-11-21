import { Router } from 'express';
import generationRoutes from './generation.routes';
import languageRoutes from './language.routes';

const router = Router();

// API routes
router.use('/api', generationRoutes);
router.use('/api', languageRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
