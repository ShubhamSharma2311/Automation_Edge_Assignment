import prisma from '../config/database';
import { GenerateCodeRequest, GenerateCodeResponse, PaginatedHistory } from '../types';

export class GenerationService {
  async createGeneration(data: { prompt: string; languageId: number; code: string; userId: number }): Promise<GenerateCodeResponse> {
    try {
      // Create the generation with language relationship and userId
      const generation = await prisma.generation.create({
        data: {
          prompt: data.prompt,
          code: data.code,
          languageId: data.languageId,
          userId: data.userId,
        },
        include: {
          language: true,
        },
      });

      return {
        id: generation.id,
        prompt: generation.prompt,
        language: generation.language.slug,
        code: generation.code,
        timestamp: generation.createdAt,
      };
    } catch (error) {
      console.error('Error creating generation:', error);
      throw error;
    }
  }

  async getHistory(page: number = 1, limit: number = 10, userId?: number): Promise<PaginatedHistory> {
    try {
      // Ensure valid pagination parameters
      const validPage = Math.max(1, page);
      const validLimit = Math.min(Math.max(1, limit), 50); // Max 50 items per page
      const skip = (validPage - 1) * validLimit;

      // Build where clause - filter by userId if provided
      const where = userId ? { userId } : {};

      // Get total count
      const totalItems = await prisma.generation.count({ where });

      // Get paginated data
      const generations = await prisma.generation.findMany({
        where,
        skip,
        take: validLimit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          language: true,
        },
      });

      const totalPages = Math.ceil(totalItems / validLimit);

      const data: GenerateCodeResponse[] = generations.map((gen) => ({
        id: gen.id,
        prompt: gen.prompt,
        language: gen.language.slug,
        code: gen.code,
        timestamp: gen.createdAt,
      }));

      return {
        data,
        pagination: {
          currentPage: validPage,
          totalPages,
          totalItems,
          itemsPerPage: validLimit,
          hasNext: validPage < totalPages,
          hasPrevious: validPage > 1,
        },
      };
    } catch (error) {
      console.error('Error fetching history:', error);
      throw new Error('Failed to fetch generation history');
    }
  }
}

export default new GenerationService();
