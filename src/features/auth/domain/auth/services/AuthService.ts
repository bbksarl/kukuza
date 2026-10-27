import { AuthRepository } from '../repositories/AuthRepository';
import { Credentials } from '../entities/Credentials';
import { User } from '../entities/User';
import { logger } from '../../../utils/logger';
import { errorMonitor } from '../../../utils/errorMonitor';
import { registerInputSchema } from '../schemas';
import type { AuthResult, RegisterData } from '../types';

interface AuthServiceInterface {
  login(credentialsData: { username?: string; email?: string; password: string }): Promise<AuthResult>;
  register(userData: RegisterData): Promise<AuthResult>;
}

class AuthService implements AuthServiceInterface {
  constructor(private readonly repository: AuthRepository = new AuthRepository()) {}

  private handleServiceError(
    error: unknown,
    component: string,
    action: string,
    fallbackMessage?: string
  ): Error {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errorMonitor.trackError(error instanceof Error ? error : new Error(errorMessage), {
      component,
      action,
    });
    logger.error(`${action} failed`, error instanceof Error ? error : new Error(errorMessage));
    return error instanceof Error ? error : new Error(errorMessage || fallbackMessage || 'Une erreur est survenue');
  }

  private normalizeLoginData(credentialsData: { username?: string; email?: string; password: string }): {
    username: string;
    password: string;
  } {
    return {
      username: (credentialsData.username ?? credentialsData.email ?? '').trim(),
      password: credentialsData.password,
    };
  }

  private normalizeRegisterData(userData: RegisterData): RegisterData {
    return {
      ...userData,
      username: userData.username?.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      name: userData.name.trim(),
    };
  }

  async login(credentialsData: { username?: string; email?: string; password: string }): Promise<AuthResult> {
    try {
      const normalizedData = this.normalizeLoginData(credentialsData);

      const credentials = new Credentials(normalizedData.username, normalizedData.password);
      const result = await this.repository.login(credentials);
      return result;
    } catch (error) {
      throw this.handleServiceError(error, 'AuthService', 'login', 'Échec de la connexion');
    }
  }

  async register(userData: RegisterData): Promise<AuthResult> {
    try {
      const normalizedData = this.normalizeRegisterData(userData);

      registerInputSchema.parse({ ...normalizedData, username: normalizedData.username ?? normalizedData.name });

      return await this.repository.register(normalizedData);
    } catch (error) {
      throw this.handleServiceError(error, 'AuthService', 'register', 'Échec de l\'inscription');
    }
  }

  async logout(): Promise<void> {
    await this.repository.logout();
  }

  async getCurrentUser(): Promise<User> {
    return this.repository.getCurrentUser();
  }
}

export { AuthService };
export default AuthService;
