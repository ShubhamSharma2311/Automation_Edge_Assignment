import prisma from '../config/database';
import { Language } from '../types';

export class LanguageService {
  async getAllLanguages(): Promise<Language[]> {
    try {
      const languages = await prisma.language.findMany({
        orderBy: {
          name: 'asc',
        },
      });

      return languages.map((lang) => ({
        id: lang.id,
        name: lang.name,
        code: lang.code,
      }));
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw new Error('Failed to fetch languages');
    }
  }

  async getLanguageByCode(code: string): Promise<Language | null> {
    try {
      const language = await prisma.language.findUnique({
        where: { code },
      });

      if (!language) return null;

      return {
        id: language.id,
        name: language.name,
        code: language.code,
      };
    } catch (error) {
      console.error('Error fetching language:', error);
      throw new Error('Failed to fetch language');
    }
  }
}

export default new LanguageService();
