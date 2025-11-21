import { Request, Response, NextFunction } from 'express';
import geminiService from '../services/gemini.service';
import generationService from '../services/generation.service';
import languageService from '../services/language.service';
import { GenerateCodeRequest } from '../types';

export class GenerationController {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt, languageId } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      // Verify language exists
      const language = await languageService.getLanguageById(languageId);
      if (!language) {
        return res.status(400).json({
          error: 'Invalid Language',
          message: `Language with ID '${languageId}' not found. Please use a valid language ID.`,
        });
      }

      // Generate code using Gemini AI
      const generatedCode = await geminiService.generateCode(prompt, language.name);

      // Save to database with userId
      const generation = await generationService.createGeneration({
        prompt,
        languageId,
        code: generatedCode,
        userId,
      });

      res.status(201).json({
        success: true,
        data: generation,
      });
    } catch (error: any) {
      console.error('Error in generate controller:', error);
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      // Parse and validate query parameters manually
      const pageParam = req.query.page as string | undefined;
      const limitParam = req.query.limit as string | undefined;
      
      const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;
      const limit = limitParam ? Math.min(50, Math.max(1, parseInt(limitParam, 10) || 5)) : 5;

      console.log('Fetching history for user:', userId, 'page:', page, 'limit:', limit);

      const history = await generationService.getHistory(page, limit, userId);

      console.log('History fetched:', history);

      res.status(200).json({
        success: true,
        ...history,
      });
    } catch (error) {
      console.error('Error in getHistory controller:', error);
      next(error);
    }
  }
}

export default new GenerationController();
