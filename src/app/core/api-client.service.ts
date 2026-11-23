import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, fromEvent, mergeMap, takeUntil, throwError, timeout, TimeoutError } from 'rxjs';
import { environment } from '@/config/environment.generated';
import { runtimeConfig } from '@/config/runtime';
import { DemoApiClient } from '@/api/demoClient';
import { ApiError } from './api-error';
import { API_BASE_URL } from './api-base-url';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  skipRedirect?: boolean;
  timeoutMs?: number;
};

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly demo = runtimeConfig.enableApiMocks ? new DemoApiClient() : null;
  private readonly baseUrl = String(
    inject(API_BASE_URL, { optional: true }) ?? environment.VITE_API_BASE_URL ?? '/api',
  ).replace(/\/$/, '');

  async request(path: string, options: ApiRequestOptions = {}): Promise<unknown> {
    if (/^https?:\/\//i.test(path)) {
      throw new Error('Les endpoints externes ne sont pas autorisés.');
    }
    if (this.demo) return this.demo.request(path, options);

    const signal = options.signal;
    if (signal?.aborted) throw new DOMException('La requête a été annulée.', 'AbortError');

    const headers = this.createHeaders(options);
    const request = this.http.request<string>(options.method ?? 'GET', this.url(path), {
      body: this.serializeBody(options.body),
      headers,
      credentials: options.credentials ?? 'same-origin',
      responseType: 'text' as 'json',
    });
    const cancellable = signal
      ? request.pipe(
          takeUntil(fromEvent(signal, 'abort').pipe(mergeMap(() => throwError(() => this.abortError())))),
        )
      : request;

    try {
      const response = await firstValueFrom(cancellable.pipe(timeout(this.timeoutFor(options))));
      return this.parseBody(response);
    } catch (error) {
      if (error instanceof HttpErrorResponse) throw this.toApiError(error);
      if (error instanceof TimeoutError) throw new ApiError(408, 'La requête a expiré.');
      throw error;
    }
  }

  get(path: string, options: ApiRequestOptions = {}): Promise<unknown> {
    return this.request(path, { ...options, method: 'GET' });
  }

  post(path: string, body?: unknown, options: ApiRequestOptions = {}): Promise<unknown> {
    return this.request(path, { ...options, method: 'POST', body });
  }

  put(path: string, body?: unknown, options: ApiRequestOptions = {}): Promise<unknown> {
    return this.request(path, { ...options, method: 'PUT', body });
  }

  patch(path: string, body?: unknown, options: ApiRequestOptions = {}): Promise<unknown> {
    return this.request(path, { ...options, method: 'PATCH', body });
  }

  delete(path: string, options: ApiRequestOptions = {}): Promise<unknown> {
    return this.request(path, { ...options, method: 'DELETE' });
  }

  private url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }

  private createHeaders(options: ApiRequestOptions): HttpHeaders {
    let headers = new HttpHeaders(options.headers as Record<string, string> | undefined).set(
      'Accept',
      'application/json',
    );
    if (
      options.body != null &&
      !(options.body instanceof FormData) &&
      typeof options.body !== 'string' &&
      !headers.has('Content-Type')
    ) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  private serializeBody(body: unknown): BodyInit | null | undefined {
    if (
      body == null ||
      body instanceof FormData ||
      typeof body === 'string' ||
      body instanceof Blob ||
      body instanceof URLSearchParams
    )
      return body;
    return JSON.stringify(body);
  }

  private timeoutFor(options: ApiRequestOptions): number {
    return options.timeoutMs ?? (Number(environment.VITE_API_TIMEOUT) || 15_000);
  }

  private abortError(): DOMException {
    return new DOMException('La requête a été annulée.', 'AbortError');
  }

  private parseBody(body: string | null): unknown {
    if (!body) return undefined;
    try {
      return JSON.parse(body) as unknown;
    } catch {
      return body;
    }
  }

  private toApiError(error: HttpErrorResponse): ApiError {
    const payload = typeof error.error === 'string' ? this.parseBody(error.error) : error.error;
    const detail =
      payload && typeof payload === 'object'
        ? ((payload as Record<string, unknown>)['message'] ??
          (payload as Record<string, unknown>)['detail'] ??
          (payload as Record<string, unknown>)['title'])
        : undefined;
    return new ApiError(
      error.status,
      String(detail ?? `Erreur HTTP ${error.status}`),
      payload,
      error.headers.get('X-Correlation-ID') ?? undefined,
    );
  }
}
