import type { FacadeErrorPayload } from './types';

export class FacadeHttpError extends Error {
  readonly status: number;
  readonly payload: unknown;
  readonly correlationId: string;

  constructor(status: number, message: string, payload: unknown, correlationId: string) {
    super(message);
    this.name = 'FacadeHttpError';
    this.status = status;
    this.payload = payload;
    this.correlationId = correlationId;
  }

  get details(): FacadeErrorPayload | null {
    if (!this.payload || typeof this.payload !== 'object') return null;
    return this.payload as FacadeErrorPayload;
  }
}

export class FacadeRedirectError extends Error {
  readonly location: string;

  constructor(location: string) {
    super(`Redirection façade vers ${location}`);
    this.name = 'FacadeRedirectError';
    this.location = location;
  }
}
