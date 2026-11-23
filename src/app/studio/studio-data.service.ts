import { inject, Injectable } from '@angular/core';
import { z } from 'zod';
import { ApiClient } from '../core/api-client.service';
import { shopBrandSchema, shopCategorySchema, shopListSchema, parseShopResponse } from '@/api/contracts/shop';
import { getStoredBrandId, getStoredUserId } from '@/core/auth/sessionStorage';
import { shopEnv } from '@/features/shop/config/env';
import { mapAnalyticsResponse, mapProduct, mapSaleItem } from '@/features/shop/services/shop/shopMappers';
import {
  buildMockCreatedProduct,
  deleteMockProduct,
  getMockCategories,
  getMockDashboardOverview,
  getMockProducts,
  getMockSales,
  saveMockProductOverride,
} from '@/features/shop/utils/mockData';
import type {
  CreateProductInput,
  DashboardOverview,
  Product,
  ProductEditInput,
  SaleItem,
} from '@/features/shop/types';

type Category = z.infer<typeof shopCategorySchema>;

const endpoint = (template: string, values: Record<string, number | string>): string =>
  Object.entries(values).reduce(
    (path, [key, value]) => path.replace(`{${key}}`, encodeURIComponent(String(value))),
    template,
  );

const extractList = (response: unknown): unknown[] => parseShopResponse(shopListSchema, response);

const extractProduct = (response: unknown): unknown => {
  if (!response || typeof response !== 'object' || Array.isArray(response)) return response;
  const record = response as Record<string, unknown>;
  return record['product'] ?? record['data'] ?? response;
};

@Injectable({ providedIn: 'root' })
export class StudioDataService {
  private readonly api = inject(ApiClient);

  private async brandId(): Promise<number> {
    const userId = getStoredUserId();
    const brands = parseShopResponse(shopBrandSchema.array(), extractList(await this.api.get('/Brand')));
    const owned = brands.filter((brand) => userId != null && brand.userId === userId);
    const storedId = getStoredBrandId();
    const brand =
      storedId != null
        ? owned.find((item) => item.id === storedId)
        : owned.length === 1
          ? owned[0]
          : undefined;

    if (owned.length > 1 && storedId == null) {
      throw new Error('Plusieurs boutiques sont associées à cet utilisateur. Sélectionnez une boutique.');
    }
    if (!brand) throw new Error('Aucune boutique associée à cet utilisateur.');
    return brand.id;
  }

  async categories(): Promise<Category[]> {
    if (shopEnv.enableApiMocks) return getMockCategories();
    const id = await this.brandId();
    return this.categoriesFor(id);
  }

  private async categoriesFor(brandId: number): Promise<Category[]> {
    const response = await this.api.get(endpoint(shopEnv.endpoints.brandCategories, { brandId }));
    return parseShopResponse(shopCategorySchema.array(), extractList(response));
  }

  async overview(): Promise<DashboardOverview> {
    if (shopEnv.enableApiMocks) return getMockDashboardOverview();

    const id = await this.brandId();
    const now = new Date();
    const params = new URLSearchParams({
      period: 'month',
      year: String(now.getFullYear()),
      month: String(now.getMonth() + 1),
    });
    const path = `${shopEnv.endpoints.brandMetrics.replace('{brandId}', encodeURIComponent(String(id)))}?${params}`;
    return mapAnalyticsResponse(await this.api.get(path));
  }

  async products(): Promise<Product[]> {
    if (shopEnv.enableApiMocks) return getMockProducts();

    const id = await this.brandId();
    const response = await this.api.get(endpoint(shopEnv.endpoints.brandProducts, { brandId: id }));
    return extractList(response).map(mapProduct);
  }

  async sales(): Promise<SaleItem[]> {
    if (shopEnv.enableApiMocks) return getMockSales();
    return extractList(await this.api.get('/OrderItem')).map(mapSaleItem);
  }

  async create(input: CreateProductInput): Promise<Product> {
    if (shopEnv.enableApiMocks) return buildMockCreatedProduct(input);

    const brandId = await this.brandId();
    const categories = await this.categoriesFor(brandId);
    const categoryId = categories.find(
      (category) => category.name.toLowerCase() === input.category.toLowerCase(),
    )?.id;
    if (categoryId == null) throw new Error('La catégorie sélectionnée est invalide pour cette marque.');

    const form = new FormData();
    form.set('name', input.name);
    form.set('price', String(input.price));
    form.set('stock', String(input.quantity));
    form.set('gender', input.gender);
    form.set('ageRange', input.ageRange);
    form.set('categoryId', String(categoryId));
    input.images.forEach((image) => form.append('images', image));

    const response = await this.api.post(endpoint(shopEnv.endpoints.brandProducts, { brandId }), form);
    return mapProduct(extractProduct(response));
  }

  async remove(productId: string): Promise<void> {
    if (productId.startsWith('demo-product-')) {
      deleteMockProduct(productId);
      return;
    }
    if (shopEnv.enableApiMocks && productId.startsWith('product-')) return;
    await this.api.delete(endpoint(shopEnv.endpoints.product, { productId }));
  }

  async update(product: Product, changes: ProductEditInput): Promise<Product> {
    if (shopEnv.enableApiMocks) return this.updateMockProduct(product, changes);

    const brandId = await this.brandId();
    const categories = await this.categoriesFor(brandId);
    const category = categories.find((item) => item.name.toLowerCase() === changes.category.toLowerCase());
    if (!category) throw new Error('La catégorie sélectionnée est invalide pour cette marque.');

    const form = new FormData();
    form.set('name', changes.name);
    form.set('price', String(changes.price));
    form.set('stock', String(changes.quantity));
    form.set('categoryId', String(category.id));
    if (changes.gender) form.set('gender', changes.gender);
    if (changes.ageRange) form.set('ageRange', changes.ageRange);
    if (changes.image) form.append('images', changes.image);

    const response = await this.api.patch(
      endpoint(shopEnv.endpoints.product, { productId: product.id }),
      form,
    );
    return response == null ? product : mapProduct(extractProduct(response));
  }

  private async updateMockProduct(product: Product, changes: ProductEditInput): Promise<Product> {
    const image = changes.image ? await this.toDataUrl(changes.image) : product.image;
    const { image: _file, ...fields } = changes;
    const updated: Product = {
      ...product,
      ...fields,
      image,
      stock: changes.quantity,
      updatedAt: new Date(),
      status: changes.quantity === 0 ? 'out_of_stock' : changes.quantity <= 10 ? 'low_stock' : 'in_stock',
    };
    if (product.id.startsWith('demo-product-')) saveMockProductOverride(updated);
    return updated;
  }

  private toDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        typeof reader.result === 'string'
          ? resolve(reader.result)
          : reject(new Error('Impossible de lire l’image.'));
      reader.onerror = () => reject(new Error('Impossible de lire l’image.'));
      reader.readAsDataURL(file);
    });
  }
}
