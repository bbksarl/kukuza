import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../core/language.service';
import { SeoService } from '../core/seo.service';
import { StudioDataService } from './studio-data.service';
import type { Product } from '@/features/shop/types';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './studio-products.component.html',
})
export class StudioProductsComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  private readonly data = inject(StudioDataService);
  readonly products = signal<Product[]>([]);
  readonly search = new FormControl('', { nonNullable: true });
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly busy = signal(false);
  readonly filtered = computed(() =>
    this.products().filter((product) =>
      `${product.name} ${product.reference} ${product.category}`
        .toLowerCase()
        .includes(this.search.value.toLowerCase()),
    ),
  );

  constructor() {
    inject(SeoService).update(
      'Produits boutique | KUKUZA',
      'Gérez les produits de votre boutique.',
      '/shop/produits',
      undefined,
      undefined,
      true,
    );
    void this.data
      .products()
      .then((products) => this.products.set(products))
      .catch(() => this.error.set(true))
      .finally(() => this.loading.set(false));
  }

  async remove(product: Product): Promise<void> {
    this.busy.set(true);
    try {
      await this.data.remove(product.id);
      this.products.update((products) => products.filter((item) => item.id !== product.id));
    } catch {
      this.error.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
