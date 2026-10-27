import { facadeClient } from '@/api/client';
import { productSchema, productPageSchema, categorySchema, brandSchema, type ProductPageDto, type ProductQuery } from '@/api/contracts/catalog';

export type FacadeProductsResponse = ProductPageDto;
export interface CatalogCategory { id: number; name: string }
export interface CatalogCreator extends CatalogCategory { profile_image_url?: string }

export async function getProducts(page = 1, limit = 12, signal?: AbortSignal, filters: ProductQuery = {}): Promise<ProductPageDto> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
  return productPageSchema.parse(await facadeClient.get<unknown>(`/Product?${params}`, { signal }));
}

export async function getProduct(productId: string, signal?: AbortSignal) {
  return productSchema.parse(await facadeClient.get<unknown>(`/Product/${encodeURIComponent(productId)}`, { signal }));
}

export async function getCategories(signal?: AbortSignal): Promise<CatalogCategory[]> {
  return categorySchema.array().parse(await facadeClient.get<unknown>('/Category', { signal }));
}

export async function getCreators(signal?: AbortSignal): Promise<CatalogCreator[]> {
  return brandSchema.array().parse(await facadeClient.get<unknown>('/Brand', { signal })).map((brand) => ({
    id: brand.id, name: brand.name, profile_image_url: brand.profileImageUrl ?? undefined,
  }));
}
