import { useEffect } from 'react';

type SeoPageType = 'website' | 'product';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: SeoPageType;
  noIndex?: boolean;
  product?: {
    name: string;
    description?: string;
    image?: string;
    price?: number;
    boutiqueName?: string;
  };
}

const DEFAULT_SITE_URL = 'https://kukuza.com';

const getSiteUrl = () => {
  const configuredUrl = import.meta.env.VITE_SITE_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return DEFAULT_SITE_URL;
};

const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

export default function Seo({
  title,
  description,
  path = '/',
  image = '/assets/logo.png',
  type = 'website',
  noIndex = false,
  product,
}: SeoProps) {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const canonicalUrl = `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type === 'product' ? 'product' : 'website');
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('property', 'og:image:alt', title);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const structuredData = product && type === 'product'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description || description,
          image: imageUrl,
          brand: product.boutiqueName ? { '@type': 'Brand', name: product.boutiqueName } : undefined,
          offers: product.price == null ? undefined : {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: 'EUR',
            price: product.price,
            availability: 'https://schema.org/InStock',
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description,
          url: canonicalUrl,
          inLanguage: 'fr-FR',
        };

    let script = document.head.querySelector<HTMLScriptElement>('script[data-kukuza-seo]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.kukuzaSeo = 'true';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [description, image, noIndex, path, product, title, type]);

  return null;
}
