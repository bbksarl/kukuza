import { FacadeHttpError, facadeClient } from '@/api/client';
import { shopEnv } from '../../config/env';

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;
  readonly correlationId?: string;

  constructor(message: string, status: number, details?: unknown, correlationId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.correlationId = correlationId;
  }
}

interface RequestJsonOptions extends RequestInit {
  timeoutMs?: number;
}

export const requestJson = async <T>(path: string, options: RequestJsonOptions = {}): Promise<T> => {
  const { timeoutMs = shopEnv.requestTimeoutMs, ...requestInit } = options;

  try {
    return await facadeClient.request<T>(path, {
      ...requestInit,
      timeoutMs,
    });
  } catch (error) {
    if (error instanceof FacadeHttpError) {
      throw new ApiError(error.message, error.status, error.payload, error.correlationId);
    }

    throw error instanceof Error ? error : new Error('Une erreur réseau est survenue.');
  }
};
