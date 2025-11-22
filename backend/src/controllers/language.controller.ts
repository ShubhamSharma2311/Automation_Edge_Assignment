import { Request, Response, NextFunction } from 'express';
import languageService from '../services/language.service';

export class LanguageController {
  async getAllLanguages(req: Request, res: Response, next: NextFunction) {
    try {
      const languages = await languageService.getAllLanguages();

      res.status(200).json({
        success: true,
        data: languages,
      });
    } catch (error) {
      console.error('Error in getAllLanguages controller:', error);
      next(error);
    }
  }

  async seedLanguages(req: Request, res: Response, next: NextFunction) {
    try {
      const languages = await languageService.seedLanguages();

      res.status(200).json({
        success: true,
        message: 'Languages seeded successfully',
        data: languages,
      });
    } catch (error) {
      console.error('Error in seedLanguages controller:', error);
      next(error);
    }
  }
}

export default new LanguageController();
