import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@/config/environment.generated';
import { runtimeConfig } from '@/config/runtime';

const fallbackSiteUrl = 'https://kukuza.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(
    title: string,
    description: string,
    path: string,
    image = '/assets/logo-display.webp',
    price?: number,
    noIndex = false,
    currency = runtimeConfig.currency,
  ): void {
    const baseUrl = (environment.VITE_SITE_URL || fallbackSiteUrl).replace(/\/$/, '');
    const pageUrl = new URL(path.startsWith('/') ? path : `/${path}`, `${baseUrl}/`).href;
    const imageUrl = new URL(image, `${baseUrl}/`).href;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    });
    this.meta.updateTag({ property: 'og:site_name', content: 'KUKUZA' });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_FR' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    const socialTags: Record<string, string> = {
      'og:title': title,
      'og:description': description,
      'og:url': pageUrl,
      'og:image': imageUrl,
      'og:image:alt': title,
      'og:type': price === undefined ? 'website' : 'product',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': imageUrl,
    };
    for (const [name, content] of Object.entries(socialTags)) {
      const isOpenGraph = name.startsWith('og:');
      this.meta.updateTag(isOpenGraph ? { property: name, content } : { name, content });
    }

    this.updateCanonical(pageUrl);
    this.updateStructuredData({ title, description, pageUrl, imageUrl, price, currency });
  }

  private updateCanonical(url: string): void {
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  private updateStructuredData(data: {
    title: string;
    description: string;
    pageUrl: string;
    imageUrl: string;
    price?: number;
    currency: string;
  }): void {
    let script = this.document.querySelector<HTMLScriptElement>('script[data-kukuza-seo]');
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kukuza-seo', 'true');
      this.document.head.appendChild(script);
    }

    const structuredData =
      data.price === undefined
        ? {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: data.title,
            description: data.description,
            url: data.pageUrl,
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: data.title.replace(' | KUKUZA', ''),
            description: data.description,
            image: data.imageUrl,
            offers: {
              '@type': 'Offer',
              url: data.pageUrl,
              price: data.price,
              priceCurrency: data.currency,
            },
          };
    script.textContent = JSON.stringify(structuredData);
  }
}
