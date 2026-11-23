import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../core/language.service';
import { SeoService } from '../core/seo.service';
import { CatalogDataService } from './catalog-data.service';
import type { PortalProduct } from '@/features/portal/data/catalog';
import type { CatalogCreator } from '@/api/contracts/catalog';
import { bestSellers } from '@/features/portal/data/bestSellers';
import { outfits } from '@/features/portal/data/outfits';
import { mockProducts } from '@/features/portal/data/catalog/mockProducts';

const fallbackProducts = mockProducts.slice(0, 12);
const fallbackCreators: CatalogCreator[] = Array.from(
  new Map(
    mockProducts.map((product, index) => [
      product.brand,
      {
        id: index + 1,
        name: product.brand,
        profile_image_url: `/assets/boutiques/shop${(index % 6) + 1}-display.webp`,
      },
    ]),
  ).values(),
);

@Component({ standalone: true, imports: [RouterLink], templateUrl: './home.component.html' })
export class HomeComponent {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly reducedMotion = signal(this.browser && matchMedia('(prefers-reduced-motion: reduce)').matches);
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  private readonly data = inject(CatalogDataService);
  readonly genderFilters = [
    { label: 'catalog.men', value: 'Homme' },
    { label: 'catalog.women', value: 'Femme' },
    { label: 'catalog.children', value: 'Enfant' },
  ];
  readonly products = signal<PortalProduct[]>(fallbackProducts);
  readonly creators = signal<CatalogCreator[]>(fallbackCreators);
  readonly bestSellers = bestSellers;
  readonly outfits = outfits;
  readonly outfitIndex = signal(0);
  readonly paused = signal(false);
  constructor() {
    inject(SeoService).update(
      'KUKUZA — La marketplace africaine des créateurs',
      'Découvrez des produits premium, des créateurs africains et des boutiques indépendantes sur KUKUZA.',
      '/',
    );
    const destroy = inject(DestroyRef);
    if (this.browser) {
      const controller = new AbortController();
      destroy.onDestroy(() => controller.abort());
      void Promise.allSettled([
        this.data.products(1, 12, {}, controller.signal).then((value) => this.products.set(value.items)),
        this.data.creators(controller.signal).then((value) => this.creators.set(value)),
      ]);
    }
    if (this.browser) {
      const timer = setInterval(() => {
        if (!this.paused() && !this.reducedMotion())
          this.outfitIndex.update((value) => (value + 1) % outfits.length);
      }, 3000);
      destroy.onDestroy(() => clearInterval(timer));
    }
    afterNextRender(() => {
      const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
      const updateMotionPreference = () => {
        this.reducedMotion.set(motionPreference.matches);
      };
      motionPreference.addEventListener('change', updateMotionPreference);
      destroy.onDestroy(() => motionPreference.removeEventListener('change', updateMotionPreference));
      updateMotionPreference();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) {
              entry.target.classList.add('fade-in');
              observer.unobserve(entry.target);
            }
        },
        { threshold: 0.05 },
      );
      document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
      destroy.onDestroy(() => observer.disconnect());
    });
  }
}
