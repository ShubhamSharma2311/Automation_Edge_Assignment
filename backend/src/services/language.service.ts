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
        code: lang.slug,
      }));
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw new Error('Failed to fetch languages');
    }
  }

  async getLanguageByCode(code: string): Promise<Language | null> {
    try {
      const language = await prisma.language.findUnique({
        where: { slug: code },
      });

      if (!language) return null;

      return {
        id: language.id,
        name: language.name,
        code: language.slug,
      };
    } catch (error) {
      console.error('Error fetching language:', error);
      throw new Error('Failed to fetch language');
    }
  }

  async getLanguageById(id: number): Promise<Language | null> {
    try {
      const language = await prisma.language.findUnique({
        where: { id },
      });

      if (!language) return null;

      return {
        id: language.id,
        name: language.name,
        code: language.slug,
      };
    } catch (error) {
      console.error('Error fetching language by ID:', error);
      throw new Error('Failed to fetch language');
    }
  }

  async seedLanguages(): Promise<Language[]> {
    try {
      const languages = [
        { name: 'Python', slug: 'python' },
        { name: 'JavaScript', slug: 'javascript' },
        { name: 'TypeScript', slug: 'typescript' },
        { name: 'Java', slug: 'java' },
        { name: 'C++', slug: 'cpp' },
        { name: 'C#', slug: 'csharp' },
        { name: 'Go', slug: 'go' },
        { name: 'Rust', slug: 'rust' },
      ];

      const seededLanguages = [];
      for (const language of languages) {
        const result = await prisma.language.upsert({
          where: { slug: language.slug },
          update: {},
          create: language,
        });
        seededLanguages.push({
          id: result.id,
          name: result.name,
          code: result.slug,
        });
      }

      return seededLanguages;
    } catch (error) {
      console.error('Error seeding languages:', error);
      throw new Error('Failed to seed languages');
    }
  }
}

export default new LanguageService();
