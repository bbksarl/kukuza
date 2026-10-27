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

const abortWithReason = (controller: AbortController, signal: AbortSignal): void => {
  try {
    controller.abort(signal.reason);
  } catch {
    controller.abort();
  }
};

const mergeAbortSignals = (timeoutSignal: AbortSignal, requestSignal?: AbortSignal): {
  signal: AbortSignal;
  cleanup: () => void;
} => {
  if (!requestSignal) return { signal: timeoutSignal, cleanup: () => undefined };

  const controller = new AbortController();
  const abort = () => abortWithReason(controller, requestSignal);

  if (requestSignal.aborted) {
    abort();
    return { signal: controller.signal, cleanup: () => undefined };
  }

  const onTimeout = () => {
    try {
      controller.abort(timeoutSignal.reason);
    } catch {
      controller.abort();
    }
  };

  requestSignal.addEventListener('abort', abort, { once: true });
  timeoutSignal.addEventListener('abort', onTimeout, { once: true });

  return {
    signal: controller.signal,
    cleanup: () => {
      requestSignal.removeEventListener('abort', abort);
      timeoutSignal.removeEventListener('abort', onTimeout);
    },
  };
};

const parseBody = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('json')) return JSON.parse(text) as T;
  // Certains contrôleurs Spring renvoient encore du JSON en text/plain.
  // On tente le décodage sans convertir arbitrairement les vrais textes.
  if (contentType.startsWith('text/plain')) {
    try {
      return JSON.parse(text) as T;
    } catch {
      // Le corps reste un texte valide.
    }
  }
  return text as T;
};

export class FacadeClient {
  readonly config: FacadeRuntimeConfig;
  private readonly getAccessToken: () => string | null;
  private readonly execute: (context: FacadeMiddlewareContext) => Promise<Response>;

  constructor(options: FacadeOptions = {}) {
    this.config = createFacadeConfig(options);
    this.getAccessToken = options.getAccessToken ?? (() => {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem('kukuza-auth-token');
    });
    this.execute = buildMiddlewareChain(this.config, async (context) => fetch(context.url, context.init));
  }

  async request<T>(path: string, options: FacadeRequestOptions = {}): Promise<T> {
    const { timeoutMs = this.config.timeoutMs, skipRedirect, retrySafeRequest, body, ...requestInit } = options;
    const url = this.toUrl(path);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const mergedSignal = mergeAbortSignals(controller.signal, requestInit.signal ?? undefined);
    const headers = new Headers(requestInit.headers);
    headers.set('Accept', 'application/json');
    if (!headers.has('Authorization')) {
      const token = this.getAccessToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);
    }
    if (body != null && !isFormData(body) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const correlationId = this.createCorrelationId();
      const response = await this.execute({
        url,
        correlationId,
        skipRedirect,
        retrySafeRequest,
        init: {
          ...requestInit,
          body: serializeBody(body),
          headers,
          credentials: requestInit.credentials ?? 'include',
          signal: mergedSignal.signal,
        },
      });
      await throwForResponse(response, correlationId);
      return await parseBody<T>(response);
    } finally {
      clearTimeout(timeoutId);
      mergedSignal.cleanup();
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
