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

export const createFacadeConfig = (options: FacadeOptions = {}): FacadeRuntimeConfig => ({
  apiBaseUrl: normalizeBaseUrl(options.apiBaseUrl ?? readEnvironment('KUKUZA_FACADE_API_URL') ?? DEFAULT_CONFIG.apiBaseUrl),
  timeoutMs: options.timeoutMs ?? Number(readEnvironment('KUKUZA_FACADE_TIMEOUT_MS') ?? DEFAULT_CONFIG.timeoutMs),
  authPath: options.authPath ?? readEnvironment('KUKUZA_AUTH_PATH') ?? DEFAULT_CONFIG.authPath,
  forbiddenPath: options.forbiddenPath ?? readEnvironment('KUKUZA_FORBIDDEN_PATH') ?? DEFAULT_CONFIG.forbiddenPath,
  redirectOnAuthFailure: options.redirectOnAuthFailure ?? true,
});
