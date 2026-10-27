import type { CreateProductInput, DashboardOverview, Product, SaleItem } from '../../types';
import { shopEnv } from '../../config/env';
import { requestJson } from '../api/httpClient';
import {
  buildMockCreatedProduct,
  getMockDashboardOverview,
  getMockProducts,
  getMockSales,
} from '../../utils/mockData';
import { mapAnalyticsResponse, mapProduct, mapSaleItem } from './shopMappers';
import { analyticsCacheService } from '../analytics/AnalyticsCacheService';
import {
  getCurrentBoutique,
  getMarketplaceProducts,
  saveMarketplaceProduct,
  type MarketplaceProductRecord,
} from '@/services/products/marketplaceProductStore';
import { getStoredBrandId, getStoredUserId } from '@/core/auth/sessionStorage';

export interface ShopCategory {
  id: number;
  name: string;
  parentId?: number | null;
}

const endpoint = (template: string, values: Record<string, number | string>): string => {
  return Object.entries(values).reduce(
    (path, [key, value]) => path.replace(`{${key}}`, encodeURIComponent(String(value))),
    template,
  );
};

const withFallback = async <T>(
  operation: string,
  request: () => Promise<T>,
  fallback: () => T
): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    if (shopEnv.enableApiMocks) {
      console.warn(`[shopService] Falling back to mock data for ${operation}.`, error);
      return fallback();
    }

    throw error;
  }
};

const createProductPayload = async (input: CreateProductInput, brandId: number): Promise<FormData> => {
  let categoryId: number | undefined;
  try {
    const categories = await requestJson<unknown>(endpoint(shopEnv.endpoints.brandCategories, { brandId }));
    const categoryList = extractList(categories) as Array<Record<string, unknown>>;
    const category = categoryList.find((item) => String(item.name ?? '').toLowerCase() === input.category.toLowerCase());
    if (category?.id != null) categoryId = Number(category.id);
  } catch {
    throw new Error('Impossible de charger les catégories de cette marque.');
  }

  if (categoryId == null) throw new Error('La catégorie sélectionnée est invalide pour cette marque.');

  const payload = new FormData();
  payload.append('name', input.name);
  payload.append('price', String(input.price));
  payload.append('stock', String(input.quantity));
  payload.append('gender', input.gender);
  payload.append('ageRange', input.ageRange);
  if (categoryId != null) payload.append('categoryId', String(categoryId));
  input.images.forEach((image) => payload.append('images', image));
  return payload;
};

const extractList = (response: unknown): unknown[] => {
  if (Array.isArray(response)) return response;

  const source = (response ?? {}) as Record<string, unknown>;
  if (Array.isArray(source.data)) return source.data;
  if (Array.isArray(source.products)) return source.products;
  if (Array.isArray(source.items)) return source.items;
  return [];
};

const extractProduct = (response: unknown): unknown => {
  const source = (response ?? {}) as Record<string, unknown>;
  return source.product ?? source.data ?? response;
};

const getCurrentBrandId = async (): Promise<number> => {
  const userId = getStoredUserId();
  const brands = await requestJson<unknown>('/Brand');
  const brandList = extractList(brands) as Array<Record<string, unknown>>;
  const ownedBrands = brandList.filter((item) => userId != null && Number(item.userId) === userId);
  const storedBrandId = getStoredBrandId();
  const brand = storedBrandId != null
    ? ownedBrands.find((item) => Number(item.id) === storedBrandId)
    : ownedBrands.length === 1 ? ownedBrands[0] : undefined;
  if (ownedBrands.length > 1 && !storedBrandId) {
    throw new Error('Plusieurs boutiques sont associées à cet utilisateur. Sélectionnez une boutique.');
  }
  const brandId = Number(brand?.id);
  if (!Number.isFinite(brandId)) throw new Error('Aucune boutique associée à cet utilisateur.');
  return brandId;
};

const saveProductForMarketplace = (product: Product): Product => {
  const boutique = getCurrentBoutique();
  const productWithBoutique: Product = {
    ...product,
    boutiqueId: product.boutiqueId ?? boutique.id,
    boutiqueName: product.boutiqueName ?? boutique.name,
  };

  const record: MarketplaceProductRecord = {
    ...productWithBoutique,
    image_url: productWithBoutique.image,
    boutiqueId: productWithBoutique.boutiqueId,
    boutiqueName: productWithBoutique.boutiqueName,
    creatorId: productWithBoutique.boutiqueId,
    creatorName: productWithBoutique.boutiqueName,
    creator_name: productWithBoutique.boutiqueName,
    brand: productWithBoutique.boutiqueName,
    stock: productWithBoutique.stock,
    gender: productWithBoutique.gender,
    ageRange: productWithBoutique.ageRange,
    createdAt: productWithBoutique.createdAt.toISOString(),
    updatedAt: productWithBoutique.updatedAt.toISOString(),
  };

  if (shopEnv.enableApiMocks) saveMarketplaceProduct(record);
  return productWithBoutique;
};

export const shopService = {
  async getCategories(): Promise<ShopCategory[]> {
    const brandId = await getCurrentBrandId();
    const response = await requestJson<unknown>(endpoint(shopEnv.endpoints.brandCategories, { brandId }));
    return extractList(response)
      .map((item) => item as Record<string, unknown>)
      .map((item) => ({
        id: Number(item.id),
        name: String(item.name ?? ''),
        parentId: item.parentId == null ? null : Number(item.parentId),
      }))
      .filter((category) => Number.isInteger(category.id) && category.name.length > 0);
  },

  async getDashboardOverview(): Promise<DashboardOverview> {
    return withFallback(
      'getDashboardOverview',
      async () => {
        const brandId = await getCurrentBrandId();
        const today = new Date();
        const response = await analyticsCacheService.getCachedOrCompute(brandId, {
          type: 'month',
          year: today.getFullYear(),
          month: today.getMonth() + 1,
        });
        return mapAnalyticsResponse(response);
      },
      () => getMockDashboardOverview()
    );
  },

  async getProducts(): Promise<Product[]> {
    return withFallback(
      'getProducts',
      async () => {
        const brandId = await getCurrentBrandId();
        const response = await requestJson<unknown>(endpoint(shopEnv.endpoints.brandProducts, { brandId }));
        const remoteProducts = extractList(response).map(mapProduct);
        const localProducts = shopEnv.enableApiMocks ? getMarketplaceProducts().map(mapProduct) : [];
        const remoteIds = new Set(remoteProducts.map((product) => product.id));
        return [
          ...localProducts.filter((product) => !remoteIds.has(product.id)),
          ...remoteProducts,
        ];
      },
      () => [
        ...getMarketplaceProducts().map(mapProduct),
        ...getMockProducts(),
      ]
    );
  },

  async getSales(): Promise<SaleItem[]> {
    return withFallback(
      'getSales',
      async () => {
        const response = await requestJson<unknown>('/OrderItem');
        const list = Array.isArray(response)
          ? response
          : Array.isArray((response as { data?: unknown[] })?.data)
            ? (response as { data: unknown[] }).data
            : [];

        return list.map(mapSaleItem);
      },
      () => getMockSales()
    );
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    return withFallback(
      'createProduct',
      async () => {
        const brandId = await getCurrentBrandId();
        const response = await requestJson<unknown>(endpoint(shopEnv.endpoints.brandProducts, { brandId }), {
          method: 'POST',
          body: await createProductPayload(input, brandId),
        });

        return saveProductForMarketplace(mapProduct(extractProduct(response)));
      },
      () => saveProductForMarketplace(buildMockCreatedProduct(input))
    );
  },
};
