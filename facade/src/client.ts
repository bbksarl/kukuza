import { buildMiddlewareChain, throwForResponse, type FacadeMiddlewareContext } from './middleware';
import { createFacadeConfig } from './config';
import type { FacadeOptions, FacadeRequestOptions, FacadeRuntimeConfig } from './types';

const serializeBody = (body: unknown): BodyInit | undefined => {
  if (body == null) return undefined;
  if (typeof body === 'string' || body instanceof FormData || body instanceof Blob || body instanceof URLSearchParams) {
    return body;
  }
  return JSON.stringify(body);
};

const isFormData = (body: unknown): body is FormData => typeof FormData !== 'undefined' && body instanceof FormData;

const parseBody = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return JSON.parse(text) as T;
  return text as T;
};

export class FacadeClient {
  readonly config: FacadeRuntimeConfig;
  private readonly execute: (context: FacadeMiddlewareContext) => Promise<Response>;

  constructor(options: FacadeOptions = {}) {
    this.config = createFacadeConfig(options);
    this.execute = buildMiddlewareChain(this.config, async (context) => fetch(context.url, context.init));
  }

  async request<T>(path: string, options: FacadeRequestOptions = {}): Promise<T> {
    const { timeoutMs = this.config.timeoutMs, skipRedirect, retrySafeRequest: _retrySafeRequest, body, ...requestInit } = options;
    const url = this.toUrl(path);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
    const headers = new Headers(requestInit.headers);
    headers.set('Accept', 'application/json');
    if (body != null && !isFormData(body) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const correlationId = this.createCorrelationId();
      const response = await this.execute({
        url,
        correlationId,
        skipRedirect,
        init: {
          ...requestInit,
          body: serializeBody(body),
          headers,
          credentials: requestInit.credentials ?? 'include',
          signal: controller.signal,
        },
      });
      await throwForResponse(response, correlationId);
      return parseBody<T>(response);
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  get<T>(path: string, options: FacadeRequestOptions = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options: FacadeRequestOptions = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  put<T>(path: string, body?: unknown, options: FacadeRequestOptions = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  patch<T>(path: string, body?: unknown, options: FacadeRequestOptions = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  delete<T>(path: string, options: FacadeRequestOptions = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  private toUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      throw new Error('La façade refuse les URLs externes. Utilisez un endpoint BFF relatif.');
    }
    return `${this.config.apiBaseUrl}/${path.replace(/^\/+/, '')}`;
  }

  private createCorrelationId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export const facadeClient = new FacadeClient();
 