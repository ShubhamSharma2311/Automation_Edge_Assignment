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
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const history = await generationService.getHistory(page, limit, userId);

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
