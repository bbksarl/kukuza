import { afterEach, describe, expect, it, vi } from 'vitest';
import { FacadeClient } from './client';

describe('FacadeClient request cancellation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('keeps the timeout active while reading the response body', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => new Response(new ReadableStream({
      start(controller) {
        init?.signal?.addEventListener('abort', () => controller.error(new DOMException('Timeout', 'AbortError')), { once: true });
      },
    }), { headers: { 'Content-Type': 'application/json' } })));
    const request = new FacadeClient({ timeoutMs: 50 }).get('/slow-body');
    const assertion = expect(request).rejects.toMatchObject({ name: 'AbortError' });
    await vi.advanceTimersByTimeAsync(51);
    await assertion;
  });

  it('propagates cancellation even after response headers arrived', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => new Response(new ReadableStream({
      start(controller) {
        init?.signal?.addEventListener('abort', () => controller.error(new DOMException('Cancelled', 'AbortError')), { once: true });
      },
    })));
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();
    const request = new FacadeClient().get('/slow-body', { signal: controller.signal });
    const assertion = expect(request).rejects.toMatchObject({ name: 'AbortError' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    controller.abort();
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('includes cross-origin session cookies and does not replay failed writes', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"title":"Unavailable"}', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(new FacadeClient({ apiBaseUrl: 'https://api.example.test/api' }).post('/Order/checkout', {})).rejects.toMatchObject({ status: 503 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1].credentials).toBe('include');
  });

  it('propagates the caller AbortSignal to fetch without retrying', async () => {
    const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        reject(new DOMException('La requête a été annulée.', 'AbortError'));
      }, { once: true });
    }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new FacadeClient({ redirectOnAuthFailure: false });
    const controller = new AbortController();
    const request = client.get('/Product', { signal: controller.signal });
    controller.abort();

    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
