import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

const CART_STORAGE_KEY = 'kukuza-cart';

export type CartItem = {
  id: string;
  /** Identifiant persistant attendu par l'API OrderItem. */
  productId?: number | string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
};

type AddCartItem = Omit<CartItem, 'quantity'>;

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addItem: (item: AddCartItem, quantity?: number) => void;
  changeQuantity: (itemId: string, delta: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
};

const emptyCart: CartContextValue = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  addItem: () => undefined,
  changeQuantity: () => undefined,
  removeItem: () => undefined,
  clearCart: () => undefined,
};

const readStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is CartItem => {
      if (!item || typeof item !== 'object') return false;
      const candidate = item as Partial<CartItem>;
      return typeof candidate.id === 'string'
        && typeof candidate.name === 'string'
        && typeof candidate.price === 'number'
        && Number.isFinite(candidate.price)
        && typeof candidate.quantity === 'number'
        && Number.isFinite(candidate.quantity)
        && candidate.quantity > 0;
    });
  } catch {
    return [];
  }
};

const CartContext = createContext<CartContextValue>(emptyCart);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Le panier reste utilisable si le navigateur bloque le stockage local.
    }
  }, [items]);

  const addItem = useCallback((item: AddCartItem, quantity = 1) => {
    const safeQuantity = Math.max(1, Math.floor(quantity));

    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex((currentItem) => currentItem.id === item.id);
      if (existingIndex === -1) {
        return [...currentItems, { ...item, quantity: safeQuantity }];
      }

      return currentItems.map((currentItem, index) => (
        index === existingIndex
          ? { ...currentItem, quantity: currentItem.quantity + safeQuantity }
          : currentItem
      ));
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }, []);

  const changeQuantity = useCallback((itemId: string, delta: number) => {
    if (!Number.isFinite(delta) || delta === 0) return;

    setItems((currentItems) => currentItems.flatMap((item) => {
      if (item.id !== itemId) return [item];
      const nextQuantity = item.quantity + Math.trunc(delta);
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: items.reduce((total, item) => total + item.price * item.quantity, 0),
    addItem,
    changeQuantity,
    removeItem,
    clearCart,
  }), [addItem, changeQuantity, clearCart, items, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
