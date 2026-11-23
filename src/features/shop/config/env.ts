import { environment } from '@/config/environment.generated';
import { runtimeConfig } from '@/config/runtime';

const env = environment;
export const shopEnv = {
  enableApiMocks: runtimeConfig.enableApiMocks,
  endpoints: {
    brandMetrics: env.VITE_BRAND_METRICS_PATH ?? '/brands/{brandId}/metrics',
    brandProducts: env.VITE_BRAND_PRODUCTS_PATH ?? '/brands/{brandId}/products',
    product: env.VITE_PRODUCT_PATH ?? '/Product/{productId}',
    brandCategories: env.VITE_BRAND_CATEGORIES_PATH ?? '/brands/{brandId}/categories',
    category: env.VITE_CATEGORY_PATH ?? '/Category/{categoryId}',
  },
};
