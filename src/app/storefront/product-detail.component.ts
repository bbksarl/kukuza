import { Location } from '@angular/common';
import { RESPONSE_INIT } from '@angular/core';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, merge, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { LanguageService } from '../core/language.service';
import { SeoService } from '../core/seo.service';
import { IconComponent } from '../shared/ui/icon.component';
import { CatalogDataService } from './catalog-data.service';
import { CartService, FavoritesService } from './cart.service';
import { getBestSellerBySlug, type BestSellerItem } from '@/features/portal/data/bestSellers';
import type { PortalProduct } from '@/features/portal/data/catalog';
import { ApiError } from '@/app/core/api-error';
import { ReviewsComponent } from './reviews.component';

@Component({
  standalone: true,
  imports: [RouterLink, IconComponent, ReviewsComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  readonly location = inject(Location);
  readonly cart = inject(CartService);
  readonly favorites = inject(FavoritesService);
  readonly route = inject(ActivatedRoute);
  private readonly data = inject(CatalogDataService);
  private readonly seo = inject(SeoService);
  private readonly response = inject(RESPONSE_INIT, { optional: true });
  readonly catalog = this.route.snapshot.data['catalog'] === true;
  readonly best = this.route.snapshot.data['bestSeller'] === true;
  readonly product = signal<PortalProduct | null>(null);
  readonly bestSeller = signal<BestSellerItem | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly selectedSize = signal('');
  readonly selectedColor = signal('');
  readonly added = signal(false);
  readonly image = computed(
    () =>
      this.bestSeller()?.colors.find((color) => color.hex === this.selectedColor())?.image ??
      this.product()?.image_url ??
      '/assets/logo-display.webp',
  );
  readonly favoriteId = computed(() => `${this.best ? 'best-seller' : 'product'}:${this.product()?.id}`);
  readonly retry = new Subject<void>();

  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) =>
          merge(of(undefined), this.retry).pipe(
            tap(() => {
              this.loading.set(true);
              this.error.set('');
              this.product.set(null);
              this.added.set(false);
            }),
            switchMap(() => {
              const controller = new AbortController();
              const bestSeller = this.best ? getBestSellerBySlug(params.get('slug') ?? '') : undefined;
              this.bestSeller.set(bestSeller);
              const request = this.best
                ? bestSeller
                  ? of(this.fromBestSeller(bestSeller))
                  : new Observable<PortalProduct>((subscriber) =>
                      subscriber.error(new ApiError(404, 'Produit introuvable')),
                    )
                : new Observable<PortalProduct>((subscriber) => {
                    void this.data
                      .product(params.get('productId') ?? '', controller.signal)
                      .then((value) => {
                        subscriber.next(value);
                        subscriber.complete();
                      })
                      .catch((error) => subscriber.error(error));
                    return () => controller.abort();
                  });
              return request.pipe(
                tap((product) => {
                  this.product.set(product);
                  this.selectedSize.set(product.sizes[0] ?? '');
                  this.selectedColor.set(bestSeller?.colors[0]?.hex ?? '');
                  this.loading.set(false);
                }),
                catchError((error: unknown) => {
                  this.loading.set(false);
                  if (error instanceof ApiError && this.response) {
                    if (error.status === 404) this.response.status = 404;
                    else if (error.status >= 500) this.response.status = 503;
                  }
                  this.error.set(
                    error instanceof ApiError && error.status === 404
                      ? this.t('product.notFound')
                      : this.t('catalog.unavailable'),
                  );
                  return of(null);
                }),
              );
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe();
    effect(() => {
      const product = this.product();
      if (!product) return;
      this.seo.update(
        `${this.bestSeller() ? this.t(this.bestSeller()!.titleKey) : product.name} | KUKUZA`,
        product.description || `Découvrez ${product.name} sur KUKUZA.`,
        this.best
          ? `/best-sellers/${this.bestSeller()?.slug}`
          : this.catalog
            ? `/catalog/product/${product.id}`
            : `/products/${product.id}`,
        this.image(),
        product.price,
        false,
        this.bestSeller()?.currency,
      );
    });
  }
  private fromBestSeller(item: BestSellerItem): PortalProduct {
    return {
      id: item.id,
      name: this.t(item.titleKey),
      description: this.t(item.descriptionKey),
      price: item.price,
      image_url: item.src,
      brand: 'KUKUZA',
      creator_name: 'KUKUZA',
      category: 'vetements',
      subcategory: this.t(item.categoryKey),
      sizes: item.sizes,
      tags: [],
      collections: [],
      recency: 'Cette semaine',
    };
  }
  add(): void {
    const product = this.product();
    if (!product) return;
    this.cart.add(
      {
        id: this.best
          ? `best-seller:${product.id}:${this.selectedColor()}:${this.selectedSize()}`
          : `product:${product.id}:${this.selectedSize() || 'default'}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: this.image(),
        size: this.selectedSize() || undefined,
        color: this.selectedColor() || undefined,
      },
      1,
    );
    this.added.set(true);
  }
  favorite(): void {
    const product = this.product();
    if (product)
      this.favorites.toggle({
        id: this.favoriteId(),
        name: product.name,
        price: product.price,
        currency: this.bestSeller()?.currency,
        image: this.image(),
        href: this.best ? `/best-sellers/${this.bestSeller()?.slug}` : `/products/${product.id}`,
      });
  }
  fallback(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/assets/logo-display.webp')) image.src = '/assets/logo-display.webp';
  }
}
