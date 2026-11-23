import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../core/api-client.service';
import {
  brandSchema,
  categorySchema,
  productPageSchema,
  productSchema,
  type ProductQuery,
} from '@/api/contracts/catalog';
import { normalizeProduct, getPortalProductById, type PortalProduct } from '@/features/portal/data/catalog';
import { runtimeConfig } from '@/config/runtime';

@Injectable({ providedIn: 'root' })
export class CatalogDataService {
  private readonly api = inject(ApiClient);

  async categories(signal?: AbortSignal) {
    return categorySchema.array().parse(await this.api.get('/Category', { signal }));
  }
  async creators(signal?: AbortSignal) {
    return brandSchema
      .array()
      .parse(await this.api.get('/Brand', { signal }))
      .map((brand) => ({
        id: brand.id,
        name: brand.name,
        profile_image_url: brand.profileImageUrl ?? undefined,
      }));
  }
  products(page = 1, limit = 12, filters: ProductQuery = {}, signal?: AbortSignal) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return this.api
      .get(`/Product?${params}`, { signal })
      .then((value) => productPageSchema.parse(value))
      .then((result) => ({ ...result, items: result.items.map(normalizeProduct) }));
  }
  products$(
    page: number,
    limit: number,
    filters: ProductQuery,
  ): Observable<{ items: PortalProduct[]; total: number; page: number; limit: number }> {
    return new Observable((subscriber) => {
      const controller = new AbortController();
      void this.products(page, limit, filters, controller.signal)
        .then((result) => {
          subscriber.next(result);
          subscriber.complete();
        })
        .catch((error) => subscriber.error(error));
      return () => controller.abort();
    });
  }
  product(id: string, signal?: AbortSignal): Promise<PortalProduct> {
    const local = runtimeConfig.enableApiMocks ? getPortalProductById(id) : undefined;
    return local
      ? Promise.resolve(local)
      : this.api
          .get(`/Product/${encodeURIComponent(id)}`, { signal })
          .then((value) => productSchema.parse(value))
          .then(normalizeProduct);
  }
}
