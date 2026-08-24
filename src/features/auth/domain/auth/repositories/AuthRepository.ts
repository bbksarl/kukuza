import { User } from '../entities/User';
import { Credentials } from '../entities/Credentials';
import { getSafeErrorMessage, getDetailedErrorLog } from '../constants/ApiErrors';
import { logger } from '../../../utils/logger';
import { z } from 'zod';
import type { AuthResult, RegisterData } from '../types';
import { facadeClient, FacadeHttpError } from '@/api/client';
import { getDevelopmentAdmin } from '../../../config/defaultAdmin';
import { getDevelopmentBoutique } from '../../../config/defaultBoutique';

const roleSchema = z.enum(['customer', 'creator', 'admin']);

const sessionResponseSchema = z.object({
  user: z.object({
    id: z.coerce.number(),
    username: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    email: z.string().email(),
    role: roleSchema,
    createdAt: z.string().min(1),
  }),
  redirectUrl: z.string().min(1).optional(),
});

const currentUserResponseSchema = z.object({
  id: z.coerce.number(),
  username: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  email: z.string().email(),
  role: roleSchema,
  createdAt: z.string().min(1),
});

class AuthRepository {
  private mapFacadeError(error: unknown, fallbackMessage: string): Error {
    const facadeError = error instanceof FacadeHttpError ? error : null;
    const backendMessage = facadeError?.details?.message ?? null;
    const safeMessage = getSafeErrorMessage(facadeError?.status ?? 0, backendMessage, fallbackMessage);
    const logMessage = getDetailedErrorLog(facadeError?.status ?? 0, backendMessage);
    logger.warn('Facade request failed', {
      status: facadeError?.status ?? 0,
      correlationId: facadeError?.correlationId,
      error: logMessage,
    });
    return new Error(safeMessage);
  }

  private toAuthResult(data: unknown): AuthResult {
    const parsed = sessionResponseSchema.parse(data);
    const { user } = parsed;
    const name = user.username ?? user.name;

    if (!name) {
      throw new Error('Réponse de session invalide : nom utilisateur manquant');
    }

    return {
      user: new User(user.id, name, user.email, user.role, user.createdAt),
      role: user.role,
      redirectUrl: parsed.redirectUrl,
    };
  }

  async login(credentials: Credentials): Promise<AuthResult> {
    const email = credentials.email.toString();
    const developmentAdmin = getDevelopmentAdmin(email, credentials.password.toString());
    if (developmentAdmin) return developmentAdmin;
    const developmentBoutique = getDevelopmentBoutique(email, credentials.password.toString());
    if (developmentBoutique) return developmentBoutique;

    try {
      const data = await facadeClient.post<unknown>('/auth/login', {
        email,
        password: credentials.password.toString(),
      });
      return this.toAuthResult(data);
    } catch (error) {
      throw this.mapFacadeError(error, 'Authentification échouée');
    }
  }

  async register(userData: RegisterData): Promise<AuthResult> {
    const hasLogo = userData.boutique?.logo instanceof File;
    const body = hasLogo ? this.toRegistrationFormData(userData) : JSON.stringify(userData);
    try {
      return this.toAuthResult(await facadeClient.post<unknown>('/auth/register', body));
    } catch (error) {
      throw this.mapFacadeError(error, 'Inscription échouée');
    }
  }

  async logout(): Promise<void> {
    try {
      await facadeClient.post<void>('/auth/logout');
    } catch (error) {
      throw this.mapFacadeError(error, 'Déconnexion impossible');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const user = currentUserResponseSchema.parse(await facadeClient.get<unknown>('/auth/me'));
      const name = user.username ?? user.name;
      if (!name) {
        throw new Error('Réponse utilisateur invalide : nom utilisateur manquant');
      }
      return new User(user.id, name, user.email, user.role, user.createdAt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Réponse utilisateur invalide');
      }
      throw this.mapFacadeError(error, 'Impossible de récupérer l\'utilisateur');
    }
  }

  private toRegistrationFormData(userData: RegisterData): FormData {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('isBoutique', String(Boolean(userData.isBoutique)));

    if (userData.boutique) {
      Object.entries(userData.boutique).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value != null) {
          formData.append(key, value);
        }
      });
    }

    return formData;
  }

  async getCreator(userId: number): Promise<null> {
    // TODO: Implémenter getCreator si nécessaire pour l'avenir
    // Pour l'instant, non utilisé dans l'auth
    return null;
  }
}

export { AuthRepository };
