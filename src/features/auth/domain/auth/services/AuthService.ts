import { AuthRepository } from '../repositories/AuthRepository';
import { Credentials } from '../entities/Credentials';
import { User } from '../entities/User';
import { logger } from '../../../utils/logger';
import { errorMonitor } from '../../../utils/errorMonitor';
import { validatePasswordStrength } from '../../../utils/passwordSecurity';
import type { AuthResult, RegisterData } from '../types';

interface AuthServiceInterface {
  login(credentialsData: { email: string; password: string }): Promise<AuthResult>;
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
    return new Error(errorMessage || fallbackMessage || 'Une erreur est survenue');
  }

  private normalizeLoginData(credentialsData: { email: string; password: string }): {
    email: string;
    password: string;
  } {
    return {
      email: credentialsData.email.trim().toLowerCase(),
      password: credentialsData.password,
    };
  }

  private normalizeRegisterData(userData: RegisterData): RegisterData {
    return {
      ...userData,
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      name: userData.name.trim(),
    };
  }

  async login(credentialsData: { email: string; password: string }): Promise<AuthResult> {
    try {
      const normalizedData = this.normalizeLoginData(credentialsData);
      const credentials = new Credentials(normalizedData.email, normalizedData.password);
      const result = await this.repository.login(credentials);
      return result;
    } catch (error) {
      throw this.handleServiceError(error, 'AuthService', 'login', 'Échec de la connexion');
    }
  }

  async register(userData: RegisterData): Promise<AuthResult> {
    try {
      const normalizedData = this.normalizeRegisterData(userData);

      const passwordStrength = validatePasswordStrength(normalizedData.password);
      if (!passwordStrength.isStrong) {
        throw new Error(`Mot de passe faible. ${passwordStrength.feedback.join('. ')}`);
      }

      return await this.repository.register(normalizedData);
    } catch (error) {
      throw this.handleServiceError(error, 'AuthService', 'register', 'Échec de l\'inscription');
    }
  }

  async logout(): Promise<void> {
    try {
      logger.info('User logout');
      await this.repository.logout();
      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout error', error instanceof Error ? error : new Error('Unknown logout error'));
    } finally {
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const user = await this.repository.getCurrentUser();
      return user;
    } catch (error) {
      throw this.handleServiceError(
        error,
        'AuthService',
        'getCurrentUser',
        'Échec de récupération de l\'utilisateur'
      );
    }
  }
}

export { AuthService };
export default AuthService;
