import { readStoredAuthUser } from '@/core/auth/sessionStorage';

export interface MarketplaceProductRecord {
  [key: string]: unknown;
  id: string | number;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  category?: string;
  subcategory?: string;
  gender?: string;
  ageRange?: string;
  description?: string;
  stock?: number;
  quantity?: number;
  boutiqueId?: string | number;
  boutiqueName?: string;
  creatorId?: string | number;
  creatorName?: string;
  creator_name?: string;
  brand?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  rating?: number;
  reviewCount?: number;
  sizes?: string[];
  tags?: string[];
  collections?: string[];
  recency?: string;
  isPromoted?: boolean;
}

export interface BoutiqueIdentity {
  id: string;
  name: string;
}

const MARKETPLACE_PRODUCTS_KEY = 'kukuza-marketplace-products';
const MARKETPLACE_PRODUCTS_EVENT = 'kukuza-marketplace-products-updated';
const DEFAULT_BOUTIQUE: BoutiqueIdentity = {
  id: 'boutique-default',
  name: 'Boutique KUKUZA',
};

const memoryProductsByScope = new Map<string, MarketplaceProductRecord[]>();

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const getStorageScope = (): string => {
  if (!canUseStorage()) return 'memory';
  const user = readStoredAuthUser();
  return user?.id == null ? 'anonymous' : String(user.id).replace(/[^a-zA-Z0-9_-]/g, '_');
};

const getProductsStorageKey = (): string => `${MARKETPLACE_PRODUCTS_KEY}:${getStorageScope()}`;

const readProducts = (): MarketplaceProductRecord[] => {
  const scope = getStorageScope();
  const memoryProducts = memoryProductsByScope.get(scope) ?? [];
  if (!canUseStorage()) return memoryProducts;

  try {
    const stored = window.localStorage.getItem(getProductsStorageKey());
    if (!stored) return memoryProducts;

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as MarketplaceProductRecord[]) : memoryProducts;
  } catch {
    return memoryProducts;
  }
};

export const getMarketplaceProducts = (): MarketplaceProductRecord[] => [...readProducts()];

export const getCurrentBoutique = (): BoutiqueIdentity => {
  if (!canUseStorage()) return DEFAULT_BOUTIQUE;

  try {
    const user = readStoredAuthUser();
    if (!user) return DEFAULT_BOUTIQUE;
    const id = user.id;
    const name = user.username ?? user.name;

    return {
      id: id == null ? DEFAULT_BOUTIQUE.id : String(id),
      name: typeof name === 'string' && name.trim() ? name : DEFAULT_BOUTIQUE.name,
    };
  } catch {
    return DEFAULT_BOUTIQUE;
  }
};

export const saveMarketplaceProduct = (product: MarketplaceProductRecord): void => {
  const scope = getStorageScope();
  const products = readProducts().filter((item) => String(item.id) !== String(product.id));
  const nextProducts = [product, ...products];
  memoryProductsByScope.set(scope, nextProducts);

  if (canUseStorage()) {
    try {
      window.localStorage.setItem(getProductsStorageKey(), JSON.stringify(nextProducts));
      window.dispatchEvent(new CustomEvent(MARKETPLACE_PRODUCTS_EVENT));
    } catch {
      // The in-memory value still keeps the current SPA session usable.
    }
  }
};

export const subscribeToMarketplaceProducts = (listener: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === getProductsStorageKey()) listener();
  };
  const handleUpdate = () => listener();

  window.addEventListener('storage', handleStorage);
  window.addEventListener(MARKETPLACE_PRODUCTS_EVENT, handleUpdate);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(MARKETPLACE_PRODUCTS_EVENT, handleUpdate);
  };
};
