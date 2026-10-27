import { getMarketplaceProducts, type MarketplaceProductRecord } from '@/services/products/marketplaceProductStore';
import type { PortalProduct } from './types';
import { mockProducts } from './mockProducts';
import { normalizeProduct } from './productMapper';

export function getPortalProductById(productId: number | string | null | undefined) {
  if (productId == null) return undefined;
  const localProduct = getMarketplaceProducts().find((product) => String(product.id) === String(productId));
  if (localProduct) return normalizeProduct(localProduct);
  return mockProducts.find((product) => String(product.id) === String(productId));
}

export function mergeMarketplaceProducts(products: PortalProduct[]): PortalProduct[] {
  const localProducts = getMarketplaceProducts().map((product: MarketplaceProductRecord) => normalizeProduct(product));
  const knownIds = new Set(localProducts.map((product) => String(product.id)));

  return [
    ...localProducts,
    ...products.filter((product) => !knownIds.has(String(product.id))),
  ];
}
