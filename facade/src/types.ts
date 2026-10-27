export type FacadeRedirectKind = 'authentication' | 'forbidden';

export interface FacadeOptions {
  apiBaseUrl?: string;
  timeoutMs?: number;
  authPath?: string;
  forbiddenPath?: string;
  redirectOnAuthFailure?: boolean;
  getAccessToken?: () => string | null;
}

export interface FacadeRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeoutMs?: number;
  skipRedirect?: boolean;
  retrySafeRequest?: boolean;
}

export interface FacadeErrorPayload {
  message?: string;
  code?: string;
  correlationId?: string;
  [key: string]: unknown;
}

export interface FacadeRedirectEvent {
  kind: FacadeRedirectKind;
  status: number;
  location: string;
  correlationId: string;
}

export interface FacadeRuntimeConfig {
  apiBaseUrl: string;
  timeoutMs: number;
  authPath: string;
  forbiddenPath: string;
  redirectOnAuthFailure: boolean;
}
