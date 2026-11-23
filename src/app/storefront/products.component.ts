import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, merge, of, Subject, switchMap, tap } from 'rxjs';
import { LanguageService } from '../core/language.service';
import { SeoService } from '../core/seo.service';
import { CatalogDataService } from './catalog-data.service';
import { ProductCardComponent } from './product-card.component';
import { IconComponent } from '../shared/ui/icon.component';
import { getNavTitle, formatFilterLabel, type PortalProduct } from '@/features/portal/data/catalog';
import { getProductSuggestions } from '@/features/portal/utils/productSuggestions';
import { mockProducts } from '@/features/portal/data/catalog/mockProducts';
import type { CatalogCategory } from '@/api/contracts/catalog';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, ProductCardComponent, IconComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly data = inject(CatalogDataService);
  private readonly seo = inject(SeoService);
  readonly catalog = this.route.snapshot.data['catalog'] === true;
  readonly searchPage = this.route.snapshot.data['search'] === true;
  readonly items = signal<PortalProduct[]>(mockProducts.slice(0, 12));
  readonly total = signal(mockProducts.length);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly categories = signal<CatalogCategory[]>([]);
  readonly query = signal('');
  readonly suggestionsOpen = signal(false);
  readonly suggestions = computed(() => getProductSuggestions(this.items(), this.query()));
  readonly activeSuggestion = signal(0);
  readonly params = signal(this.route.snapshot.queryParamMap);
  readonly heading = computed(() => {
    const params = this.params();
    const search = params.get('q');
    if (search) return this.t('catalog.searchResults', { value: search });
    return this.lang.label(
      params.get('gender') ||
        (params.get('filter') ? formatFilterLabel(params.get('filter')) : '') ||
        (params.get('nav') ? getNavTitle(params.get('nav')) : '') ||
        this.t('catalog.allProducts'),
    );
  });
  readonly page = signal(1);
  readonly limit = this.catalog ? 20 : 12;
  readonly totalPages = computed(() => Math.ceil(this.total() / this.limit));
  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1).filter(
      (page) => page === 1 || page === this.totalPages() || Math.abs(page - this.page()) <= 2,
    ),
  );
  private readonly actions = new Subject<{ page: number; append: boolean }>();
  private requested = { page: 1, append: false };

  constructor() {
    if (!this.browser) {
      this.seo.update(
        `${this.heading()} | KUKUZA`,
        'Parcourez le catalogue KUKUZA : mode, accessoires, décoration et produits de créateurs africains.',
        this.catalog ? '/catalog' : '/products',
      );
      return;
    }
    if (this.catalog)
      void this.data
        .categories()
        .then((values) => this.categories.set(values))
        .catch(() => {});
    this.route.queryParamMap
      .pipe(
        tap((params) => {
          this.params.set(params);
          this.query.set(params.get('q') ?? '');
          this.suggestionsOpen.set(false);
          this.items.set(mockProducts.slice(0, 12));
          this.total.set(mockProducts.length);
        }),
        switchMap((params) =>
          merge(of({ page: Math.max(1, Number(params.get('page')) || 1), append: false }), this.actions).pipe(
            tap((request) => {
              this.requested = request;
              this.loading.set(true);
              this.error.set('');
              this.seo.update(
                `${this.heading()} | KUKUZA`,
                'Parcourez le catalogue KUKUZA : mode, accessoires, décoration et produits de créateurs africains.',
                this.catalog ? '/catalog' : '/products',
                undefined,
                undefined,
                params.keys.length > 0,
              );
            }),
            switchMap((request) =>
              this.data
                .products$(request.page, this.limit, {
                  search: params.get('q') ?? undefined,
                  gender: params.get('gender'),
                  nav: params.get('nav'),
                  filter: params.get('filter'),
                  categoryId: params.get('categoryId') ?? undefined,
                })
                .pipe(
                  tap((result) => {
                    this.items.update((items) =>
                      request.append
                        ? [
                            ...items,
                            ...result.items.filter(
                              (item) => !items.some((existing) => existing.id === item.id),
                            ),
                          ]
                        : result.items,
                    );
                    this.total.set(result.total);
                    this.page.set(result.page);
                    this.loading.set(false);
                  }),
                  catchError(() => {
                    this.error.set(this.t('catalog.unavailable'));
                    this.loading.set(false);
                    return of(null);
                  }),
                ),
            ),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
  search(value = this.query()): void {
    this.suggestionsOpen.set(false);
    this.update({ q: value.trim() || null, page: null });
  }
  update(params: Record<string, string | number | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
  more(): void {
    if (!this.loading()) this.actions.next({ page: this.page() + 1, append: true });
  }
  retry(): void {
    if (!this.loading()) this.actions.next(this.requested);
  }
  keydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Tab') {
      this.suggestionsOpen.set(false);
      return;
    }
    if (!this.suggestionsOpen() || !this.suggestions().length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeSuggestion.update(
        (index) =>
          (index + (event.key === 'ArrowDown' ? 1 : -1) + this.suggestions().length) %
          this.suggestions().length,
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.search(this.suggestions()[this.activeSuggestion()]?.name ?? this.query());
    }
  }
}
