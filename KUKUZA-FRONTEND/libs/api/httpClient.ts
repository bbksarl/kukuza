/**
 * HTTP Client centralisé avec interceptors
 * Utilisé par tous les microfronts
 *
 * Fonctionnalités:
 * - Interceptor: Bearer token automatique
 * - Interceptor: Timeout avec AbortController
 * - Retry logic avec exponential backoff
 * - Gestion d'erreurs centralisée
 */

import { tokenService } from './tokenService';
import { API_BASE_URL, HTTP_CONFIG } from './api.config';

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
}

export interface HttpResponse<T> {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
}

class HttpClient {
  private readonly timeout: number;
  private readonly retries: number;

  constructor(timeout: number = HTTP_CONFIG.timeout, retries: number = HTTP_CONFIG.retries) {
    this.timeout = timeout;
    this.retries = retries;
  }

  /**
   * Interceptor: Ajouter Bearer token automatiquement
   */
  private addAuthHeader(options: RequestOptions): RequestOptions {
    const token = tokenService.getToken();
    if (!token || options.skipAuth) {
      return options;
    }

    return {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    };
  }

  /**
   * Interceptor: Ajouter Content-Type si absent
   */
  private addContentTypeHeader(options: RequestOptions): RequestOptions {
    const method = options.method || 'GET';
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (!options.headers || !('Content-Type' in options.headers)) {
        return {
          ...options,
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
          },
        };
      }
    }
    return options;
  }

  /**
   * Créer timeout avec AbortController
   */
  private createTimeoutController(timeout: number): {
    controller: AbortController;
    timeoutId: NodeJS.Timeout;
  } {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    return { controller, timeoutId };
  }

  /**
   * Retry logic avec exponential backoff
   */
  private async retryWithBackoff<T>(
    fetchFn: () => Promise<T>,
    retries: number,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await fetchFn();
    } catch (error) {
      if (attempt > retries) {
        throw error;
      }

      const delay = 100 * Math.pow(2, attempt);
      console.warn(`Request failed, retrying in ${delay}ms (attempt ${attempt}/${retries})`);
      
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.retryWithBackoff(fetchFn, retries, attempt + 1);
    }
  }

  /**
   * Requête HTTP avec tous les interceptors
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const timeout = options.timeout ?? this.timeout;
    const retries = options.retries ?? this.retries;

    let finalOptions = { ...options };
    finalOptions = this.addContentTypeHeader(finalOptions);
    finalOptions = this.addAuthHeader(finalOptions);

    const performRequest = async (): Promise<Response> => {
      const { controller, timeoutId } = this.createTimeoutController(timeout);

      try {
        const response = await fetch(url, {
          ...finalOptions,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
      }
    };

    try {
      const response = await this.retryWithBackoff(performRequest, retries);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}`,
        }));

        console.error(`Request failed: ${endpoint}`, {
          status: response.status,
          error: errorData,
        });

        return {
          ok: false,
          status: response.status,
          data: null as any,
          error: errorData.message || `Erreur ${response.status}`,
        };
      }

      const data = await response.json().catch(() => ({}));
      return {
        ok: true,
        status: response.status,
        data: data as T,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error(`Request failed: ${endpoint}`, error);

      return {
        ok: false,
        status: 0,
        data: null as any,
        error: errorMessage,
      };
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

let httpClientInstance: HttpClient;

export const getHttpClient = (): HttpClient => {
  if (!httpClientInstance) {
    httpClientInstance = new HttpClient(HTTP_CONFIG.timeout, HTTP_CONFIG.retries);
  }
  return httpClientInstance;
};

export { HttpClient };
export const httpClient = getHttpClient();
