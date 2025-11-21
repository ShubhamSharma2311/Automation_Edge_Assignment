import api from './api';

export interface Language {
  id: number;
  name: string;
  code: string;
}

export interface GenerateCodeRequest {
  prompt: string;
  languageId: number;
}

export interface Generation {
  id: number;
  prompt: string;
  language: string;
  code: string;
  timestamp: string;
}

export interface HistoryResponse {
  success: boolean;
  data: Generation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

class GenerationService {
  async getLanguages(): Promise<Language[]> {
    const response = await api.get('/api/languages');
    return response.data.data;
  }

  async generateCode(data: GenerateCodeRequest): Promise<Generation> {
    const response = await api.post('/api/generate', data);
    return response.data.data;
  }

  async getHistory(page: number = 1, limit: number = 10): Promise<HistoryResponse> {
    const response = await api.get('/api/history', {
      params: { page, limit },
    });
    return response.data;
  }
}

export default new GenerationService();
