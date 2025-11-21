import api from './api';

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
  };
  message: string;
}

class AuthService {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/auth/me');
    return response.data.data;
  }
}

export default new AuthService();
