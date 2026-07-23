import { FacadeHttpError, FacadeRedirectError } from './errors';
import type { FacadeRedirectEvent, FacadeRuntimeConfig } from './types';

export interface FacadeMiddlewareContext {
  url: string;
  init: RequestInit;
  correlationId: string;
  skipRedirect?: boolean;
}

export type FacadeNext = (context: FacadeMiddlewareContext) => Promise<Response>;
export type FacadeMiddleware = (context: FacadeMiddlewareContext, next: FacadeNext) => Promise<Response>;

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

const wait = (durationMs: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, durationMs));

export const correlationMiddleware: FacadeMiddleware = async (context, next) => {
  const headers = new Headers(context.init.headers);
  headers.set('X-Correlation-ID', context.correlationId);
  return next({ ...context, init: { ...context.init, headers } });
};

export const sessionMiddleware: FacadeMiddleware = async (context, next) => {
  return next({
    ...context,
    init: {
      ...context.init,
      credentials: context.init.credentials ?? 'include',
    },
  });
};

export const retryMiddleware: FacadeMiddleware = async (context, next) => {
  const method = (context.init.method ?? 'GET').toUpperCase();
  const shouldRetry = SAFE_METHODS.has(method);
  const maxAttempts = shouldRetry ? 2 : 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await next(context);
      if (attempt < maxAttempts && RETRYABLE_STATUS.has(response.status)) {
        const retryAfter = Number(response.headers.get('Retry-After'));
        await wait(Number.isFinite(retryAfter) ? retryAfter * 1000 : 150 * attempt);
        continue;
      }
      return response;
    } catch (error) {
      if (attempt >= maxAttempts) throw error;
      await wait(150 * attempt);
    }
  }

  throw new Error('La requête façade a échoué après plusieurs tentatives.');
};

const safeSameOriginPath = (value: string | null, fallback: string): string => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
};

const getReturnPath = (): string => {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

const redirect = (event: FacadeRedirectEvent): never => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<FacadeRedirectEvent>('kukuza:facade-redirect', { detail: event }));
    window.location.assign(event.location);
  }
  throw new FacadeRedirectError(event.location);
};

export const redirectMiddleware = (config: FacadeRuntimeConfig): FacadeMiddleware => async (context, next) => {
  const response = await next(context);
  if (response.ok || !config.redirectOnAuthFailure || context.skipRedirect) return response;

  const currentPath = typeof window === 'undefined' ? '' : window.location.pathname;
  if (response.status === 401 && !currentPath.startsWith(config.authPath)) {
    const returnUrl = encodeURIComponent(getReturnPath());
    return redirect({
      kind: 'authentication',
      status: response.status,
      location: `${config.authPath}?returnUrl=${returnUrl}`,
      correlationId: context.correlationId,
    });
  }

  if (response.status === 403 && currentPath !== config.forbiddenPath) {
    const headerLocation = safeSameOriginPath(
      response.headers.get('X-Facade-Redirect') ?? response.headers.get('X-Redirect-To'),
      config.forbiddenPath,
    );
    return redirect({
      kind: 'forbidden',
      status: response.status,
      location: headerLocation,
      correlationId: context.correlationId,
    });
  }

  return response;
};

export const buildMiddlewareChain = (config: FacadeRuntimeConfig, transport: FacadeNext): FacadeNext => {
  const middleware: FacadeMiddleware[] = [correlationMiddleware, sessionMiddleware, retryMiddleware, redirectMiddleware(config)];
  return middleware.reduceRight<FacadeNext>((next, current) => (context) => current(context, next), transport);
};

export const throwForResponse = async (response: Response, correlationId: string): Promise<void> => {
  if (response.ok) return;
  const raw = await response.text();
  let payload: unknown = raw || null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    // Le BFF peut répondre avec du texte ; le payload brut est conservé.
  }

  const message = typeof payload === 'object' && payload !== null && 'message' in payload && typeof payload.message === 'string'
    ? payload.message
    : `Erreur façade HTTP ${response.status}`;
  throw new FacadeHttpError(response.status, message, payload, correlationId);
};
