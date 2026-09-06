import type { CreateProductInput, DashboardOverview, Product, SaleItem } from '../../types';
import { shopEnv } from '../../config/env';
import { requestJson } from '../api/httpClient';
import {
  buildMockCreatedProduct,
  getMockDashboardOverview,
  getMockProducts,
  getMockSales,
} from '../../utils/mockData';
import { mapDashboardOverview, mapProduct, mapSaleItem } from './shopMappers';
import {
  getCurrentBoutique,
  getMarketplaceProducts,
  saveMarketplaceProduct,
  type MarketplaceProductRecord,
} from '@/services/products/marketplaceProductStore';

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

const createProductPayload = (input: CreateProductInput): FormData => {
  const payload = new FormData();
  payload.append('name', input.name);
  payload.append('category', input.category);
  payload.append('price', String(input.price));
  payload.append('quantity', String(input.quantity));
  payload.append('ageRange', input.ageRange);
  payload.append('gender', input.gender);

  input.images.forEach((image) => {
    payload.append('images', image);
  });

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
    createdAt: productWithBoutique.createdAt.toISOString(),
    updatedAt: productWithBoutique.updatedAt.toISOString(),
  };

  saveMarketplaceProduct(record);
  return productWithBoutique;
};

export const shopService = {
  async getDashboardOverview(): Promise<DashboardOverview> {
    return withFallback(
      'getDashboardOverview',
      async () => {
        const response = await requestJson<unknown>('/dashboard');
        return mapDashboardOverview(response);
      },
      () => getMockDashboardOverview()
    );
  },

  async getProducts(): Promise<Product[]> {
    return withFallback(
      'getProducts',
      async () => {
        const response = await requestJson<unknown>('/products');
        const remoteProducts = extractList(response).map(mapProduct);
        const localProducts = getMarketplaceProducts().map(mapProduct);
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
        const response = await requestJson<unknown>('/sales');
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
        const response = await requestJson<unknown>('/products', {
          method: 'POST',
          body: createProductPayload(input),
        });

        return saveProductForMarketplace(mapProduct(extractProduct(response)));
      },
      () => saveProductForMarketplace(buildMockCreatedProduct(input))
    );
  },
};
