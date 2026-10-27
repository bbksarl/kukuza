import type { FacadeOptions, FacadeRuntimeConfig } from './types';

const DEFAULT_CONFIG: FacadeRuntimeConfig = {
  apiBaseUrl: '/api',
  timeoutMs: 15_000,
  authPath: '/auth/login',
  forbiddenPath: '/forbidden',
  redirectOnAuthFailure: true,
};

type RuntimeEnv = {
  process?: { env?: Record<string, string | undefined> };
  importMeta?: { env?: Record<string, string | undefined> };
};

const readEnvironment = (key: string): string | undefined => {
  const runtime = globalThis as typeof globalThis & RuntimeEnv;
  const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return runtime.process?.env?.[key] ?? runtime.importMeta?.env?.[key] ?? viteEnv?.[key];
};

const normalizeBaseUrl = (value: string): string => {
  const normalized = value.trim().replace(/\/+$/, '');
  return normalized || DEFAULT_CONFIG.apiBaseUrl;
};

const normalizeTimeout = (value: number): number => (
  Number.isFinite(value) && value > 0 ? value : DEFAULT_CONFIG.timeoutMs
);

export const createFacadeConfig = (options: FacadeOptions = {}): FacadeRuntimeConfig => ({
  apiBaseUrl: normalizeBaseUrl(
    options.apiBaseUrl
      ?? readEnvironment('VITE_API_BASE_URL')
      ?? readEnvironment('KUKUZA_FACADE_API_URL')
      ?? DEFAULT_CONFIG.apiBaseUrl,
  ),
  timeoutMs: normalizeTimeout(options.timeoutMs ?? Number(readEnvironment('VITE_API_TIMEOUT') ?? readEnvironment('KUKUZA_FACADE_TIMEOUT_MS') ?? DEFAULT_CONFIG.timeoutMs)),
  authPath: options.authPath ?? readEnvironment('KUKUZA_AUTH_PATH') ?? DEFAULT_CONFIG.authPath,
  forbiddenPath: options.forbiddenPath ?? readEnvironment('KUKUZA_FORBIDDEN_PATH') ?? DEFAULT_CONFIG.forbiddenPath,
  redirectOnAuthFailure: options.redirectOnAuthFailure ?? true,
});
