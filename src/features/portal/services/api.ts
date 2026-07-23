import { facadeClient } from '@/api/client';

export interface FacadeProductsResponse {
  items: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
}

export interface CatalogCategory {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

export interface CatalogCreator {
  id: string | number;
  name: string;
  profile_image_url?: string;
  [key: string]: unknown;
}

export async function getProducts(page = 1, limit = 12): Promise<FacadeProductsResponse | null> {
  try {
    return await facadeClient.get<FacadeProductsResponse>(
      `/catalog/products?page=${encodeURIComponent(String(page))}&limit=${encodeURIComponent(String(limit))}`,
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[api] getProducts failed', err);
    return null;
  }
}

export async function getCategories(): Promise<CatalogCategory[] | null> {
  try {
    return await facadeClient.get<CatalogCategory[]>('/catalog/categories');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[api] getCategories failed', err);
    return null;
  }
}

export async function getCreators(): Promise<CatalogCreator[] | null> {
  try {
    return await facadeClient.get<CatalogCreator[]>('/catalog/creators');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[api] getCreators failed', err);
    return null;
  }
}
