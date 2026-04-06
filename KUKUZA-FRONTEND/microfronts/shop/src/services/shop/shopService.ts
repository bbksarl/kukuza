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
        const list = Array.isArray(response)
          ? response
          : Array.isArray((response as { data?: unknown[] })?.data)
            ? (response as { data: unknown[] }).data
            : [];

        return list.map(mapProduct);
      },
      () => getMockProducts()
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

        return mapProduct(response);
      },
      () => buildMockCreatedProduct(input)
    );
  },
};
