export interface GenerateCodeRequest {
  prompt: string;
  language: string;
}

export interface GenerateCodeResponse {
  id: number;
  prompt: string;
  language: string;
  code: string;
  timestamp: Date;
}

export interface HistoryQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedHistory {
  data: GenerateCodeResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface Language {
  id: number;
  name: string;
  code: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
