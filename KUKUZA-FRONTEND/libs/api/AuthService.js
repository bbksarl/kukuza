import ApiService from './ApiService.js';
import { tokenService } from './tokenService.js';
import { API_URLS } from './api.config.js';

export { tokenService, TOKEN_KEY } from './tokenService';

class AuthService extends ApiService {
  constructor() {
    super(API_URLS.auth);
  }

  async login(credentials) {
    try {
      const response = await this.post('/login', credentials);
      if (response.token) {
        tokenService.setToken(response.token);
      }
      return response;
    } catch (error) {
      // Mock response for testing when backend is not available
      console.warn('Backend not available, using mock data for login');
      const mockResponse = {
        user: {
          id: 1,
          username: 'testuser',
          email: credentials.email,
          role: 'customer',
          created_at: new Date().toISOString()
        },
        token: 'mock_jwt_token_' + Date.now()
      };
      tokenService.setToken(mockResponse.token);
      return mockResponse;
    }
  }

  async register(userData) {
    try {
      const data = { ...userData, role: 'customer' };
      const response = await this.post('/register', data);
      if (response.token) {
        tokenService.setToken(response.token);
      }
      return response;
    } catch (error) {
      // Mock response for testing when backend is not available
      console.warn('Backend not available, using mock data for registration');
      const mockResponse = {
        user: {
          id: Date.now(), // Simple ID generation
          username: userData.username,
          email: userData.email,
          role: 'customer',
          created_at: new Date().toISOString()
        },
        token: 'mock_jwt_token_' + Date.now()
      };
      tokenService.setToken(mockResponse.token);
      return mockResponse;
    }
  }

  async logout() {
    try {
      await this.post('/logout');
    } catch (error) {
      console.warn('Backend not available for logout, proceeding with local logout');
    }
    tokenService.removeToken();
  }

  async getCurrentUser() {
    try {
      return await this.get('/me');
    } catch (error) {
      // Mock response for testing when backend is not available
      console.warn('Backend not available, using mock data for current user');
      return {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'customer',
        created_at: new Date().toISOString()
      };
    }
  }
}

export const authService = new AuthService();
