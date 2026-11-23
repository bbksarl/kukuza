import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { afterEach, describe, expect, it } from 'vitest';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('sets canonical, social and structured product metadata consistently', () => {
    TestBed.configureTestingModule({
      providers: [SeoService, Meta, Title, { provide: DOCUMENT, useValue: document }],
    });
    const seo = TestBed.inject(SeoService);

    seo.update(
      'Robe | KUKUZA',
      'Une robe de créateur.',
      '/products/15',
      '/assets/robe.webp',
      35000,
      false,
      'XOF',
    );

    expect(document.title).toBe('Robe | KUKUZA');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://kukuza.com/products/15',
    );
    expect(document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')).toBe(
      'Robe | KUKUZA',
    );
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    );

    const data = JSON.parse(document.querySelector('script[data-kukuza-seo]')?.textContent ?? '{}');
    expect(data.offers).toEqual({
      '@type': 'Offer',
      url: 'https://kukuza.com/products/15',
      price: 35000,
      priceCurrency: 'XOF',
    });
  });

  it('marks account pages as non-indexable', () => {
    TestBed.configureTestingModule({
      providers: [SeoService, Meta, Title, { provide: DOCUMENT, useValue: document }],
    });

    TestBed.inject(SeoService).update(
      'Administration | KUKUZA',
      'Espace privé.',
      '/admin',
      undefined,
      undefined,
      true,
    );

    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow');
  });
});
