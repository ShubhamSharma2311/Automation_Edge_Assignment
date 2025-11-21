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
  private languagesCache: Language[] | null = null;
  private pendingLanguagesRequest: Promise<Language[]> | null = null;
  private pendingGenerateRequests: Map<string, Promise<Generation>> = new Map();

  async getLanguages(): Promise<Language[]> {
    // Return cached languages if available
    if (this.languagesCache) {
      return this.languagesCache;
    }
    
    // Check if there's already a pending request
    if (this.pendingLanguagesRequest) {
      return this.pendingLanguagesRequest;
    }

    // Create new request
    this.pendingLanguagesRequest = api.get('/api/languages').then((response) => {
      this.languagesCache = response.data.data;
      this.pendingLanguagesRequest = null;
      return this.languagesCache!;
    }).catch((error) => {
      this.pendingLanguagesRequest = null;
      throw error;
    });

    return this.pendingLanguagesRequest;
  }

  async generateCode(data: GenerateCodeRequest): Promise<Generation> {
    // Create unique key for this request
    const requestKey = `${data.languageId}-${data.prompt.substring(0, 50)}`;
    
    // Check if there's already a pending identical request
    if (this.pendingGenerateRequests.has(requestKey)) {
      return this.pendingGenerateRequests.get(requestKey)!;
    }

    // Create new request
    const request = api.post('/api/generate', data).then((response) => {
      this.pendingGenerateRequests.delete(requestKey);
      return response.data.data;
    }).catch((error) => {
      this.pendingGenerateRequests.delete(requestKey);
      throw error;
    });

    this.pendingGenerateRequests.set(requestKey, request);
    return request;
  }

  async getHistory(page: number = 1, limit: number = 10): Promise<HistoryResponse> {
    console.log('Getting history with params:', { page, limit });
    const response = await api.get('/api/history', {
      params: { page, limit },
    });
    console.log('History API response:', response.data);
    return response.data;
  }
}

export default new GenerationService();
