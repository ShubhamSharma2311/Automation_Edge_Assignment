import { Request, Response, NextFunction } from 'express';
import geminiService from '../services/gemini.service';
import generationService from '../services/generation.service';
import languageService from '../services/language.service';
import { GenerateCodeRequest } from '../types';

export class GenerationController {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt, language } = req.body as GenerateCodeRequest;

      // Verify language exists
      const languageExists = await languageService.getLanguageByCode(language);
      if (!languageExists) {
        return res.status(400).json({
          error: 'Invalid Language',
          message: `Language '${language}' is not supported. Please use a valid language code.`,
        });
      }

      // Generate code using Gemini AI
      const generatedCode = await geminiService.generateCode(prompt, languageExists.name);

      // Save to database
      const generation = await generationService.createGeneration({
        prompt,
        language,
        code: generatedCode,
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

      const history = await generationService.getHistory(page, limit);

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
