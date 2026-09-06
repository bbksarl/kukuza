export interface MarketplaceProductRecord {
  [key: string]: unknown;
  id: string | number;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  category?: string;
  subcategory?: string;
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

let memoryProducts: MarketplaceProductRecord[] = [];

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readProducts = (): MarketplaceProductRecord[] => {
  if (!canUseStorage()) return memoryProducts;

  try {
    const stored = window.localStorage.getItem(MARKETPLACE_PRODUCTS_KEY);
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
    const storedUser = window.localStorage.getItem('kukuza-auth-user');
    if (!storedUser) return DEFAULT_BOUTIQUE;

    const user = JSON.parse(storedUser) as Record<string, unknown>;
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
  const products = readProducts().filter((item) => String(item.id) !== String(product.id));
  const nextProducts = [product, ...products];
  memoryProducts = nextProducts;

  if (canUseStorage()) {
    try {
      window.localStorage.setItem(MARKETPLACE_PRODUCTS_KEY, JSON.stringify(nextProducts));
      window.dispatchEvent(new CustomEvent(MARKETPLACE_PRODUCTS_EVENT));
    } catch {
      // The in-memory value still keeps the current SPA session usable.
    }
  }
};

export const subscribeToMarketplaceProducts = (listener: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === MARKETPLACE_PRODUCTS_KEY) listener();
  };
  const handleUpdate = () => listener();

  window.addEventListener('storage', handleStorage);
  window.addEventListener(MARKETPLACE_PRODUCTS_EVENT, handleUpdate);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(MARKETPLACE_PRODUCTS_EVENT, handleUpdate);
  };
};
