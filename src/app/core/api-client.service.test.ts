import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ApiClient } from './api-client.service';

describe('ApiClient', () => {
  let api: ApiClient;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ApiClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify({ ignoreCancelled: true });
    TestBed.resetTestingModule();
  });

  it('rejects an absolute API endpoint before sending a request', async () => {
    await expect(api.get('https://other.example/private')).rejects.toThrow('externes');
    http.expectNone(() => true);
  });

  it('returns a parsed JSON response while keeping the transport result untrusted', async () => {
    const response = api.get('/health');
    http.expectOne('/api/health').flush('{"ok":true}');

    await expect(response).resolves.toEqual({ ok: true });
  });

  it('surfaces cancellation as AbortError instead of an empty response', async () => {
    const controller = new AbortController();
    const response = api.get('/slow', { signal: controller.signal });
    const request = http.expectOne('/api/slow');

    controller.abort();

    await expect(response).rejects.toMatchObject({ name: 'AbortError' });
    expect(request.cancelled).toBe(true);
  });
});
