import { computed, Injectable, signal } from '@angular/core';

export interface CartItem {
  id: string;
  productId?: number | string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
}
export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  currency?: 'EUR' | 'XOF';
  image: string;
  href: string;
}

const getStorage = (): Storage | null => {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
};

export function readCart(): CartItem[] {
  try {
    const items: unknown = JSON.parse(getStorage()?.getItem('kukuza-cart') ?? '[]');
    if (!Array.isArray(items)) return [];
    return items.filter(
      (item): item is CartItem =>
        !!item &&
        typeof item.id === 'string' &&
        !item.id.startsWith('best-seller:') &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        Number.isFinite(item.price) &&
        typeof item.quantity === 'number' &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}
@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal(readCart());
  readonly totalQuantity = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  private save(items: CartItem[]): void {
    this.items.set(items);
    try {
      getStorage()?.setItem('kukuza-cart', JSON.stringify(items));
    } catch {
      /* Memory remains usable. */
    }
  }
  add(item: Omit<CartItem, 'quantity'>, quantity = 1): void {
    if (!Number.isFinite(quantity)) return;
    const safeQuantity = Math.max(1, Math.floor(quantity));
    this.save(
      this.items().some((value) => value.id === item.id)
        ? this.items().map((value) =>
            value.id === item.id ? { ...value, quantity: value.quantity + safeQuantity } : value,
          )
        : [...this.items(), { ...item, quantity: safeQuantity }],
    );
  }
  change(id: string, delta: number): void {
    if (!Number.isFinite(delta)) return;
    this.save(
      this.items()
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + Math.trunc(delta) } : item))
        .filter((item) => item.quantity > 0),
    );
  }
  remove(id: string): void {
    this.save(this.items().filter((item) => item.id !== id));
  }
  clear(): void {
    this.save([]);
  }
}
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly items = signal<FavoriteItem[]>(this.read());
  private read(): FavoriteItem[] {
    try {
      const values: unknown = JSON.parse(getStorage()?.getItem('kukuza-favorites') ?? '[]');
      if (!Array.isArray(values)) return [];
      return values.filter(
        (v): v is FavoriteItem =>
          !!v &&
          typeof v.id === 'string' &&
          typeof v.name === 'string' &&
          typeof v.price === 'number' &&
          Number.isFinite(v.price) &&
          (v.currency == null || v.currency === 'EUR' || v.currency === 'XOF') &&
          typeof v.image === 'string' &&
          typeof v.href === 'string',
      );
    } catch {
      return [];
    }
  }
  has(id: string): boolean {
    return this.items().some((item) => item.id === id);
  }
  toggle(item: FavoriteItem): void {
    this.items.update((values) =>
      this.has(item.id) ? values.filter((value) => value.id !== item.id) : [...values, item],
    );
    try {
      getStorage()?.setItem('kukuza-favorites', JSON.stringify(this.items()));
    } catch {
      /* Memory remains usable. */
    }
  }
}
