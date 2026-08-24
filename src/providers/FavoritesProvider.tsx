import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

const FAVORITES_STORAGE_KEY = 'kukuza-favorites';

export type FavoriteItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  href: string;
};

type FavoritesContextValue = {
  items: FavoriteItem[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
};

const readStoredFavorites = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is FavoriteItem => {
      if (!item || typeof item !== 'object') return false;
      const value = item as Partial<FavoriteItem>;
      return typeof value.id === 'string'
        && typeof value.name === 'string'
        && typeof value.price === 'number'
        && Number.isFinite(value.price)
        && typeof value.image === 'string'
        && typeof value.href === 'string';
    });
  } catch {
    return [];
  }
};

const FavoritesContext = createContext<FavoritesContextValue>({
  items: [],
  isFavorite: () => false,
  toggleFavorite: () => undefined,
  removeFavorite: () => undefined,
});

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<FavoriteItem[]>(readStoredFavorites);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Les favoris restent utilisables pendant la session si le stockage est bloqué.
    }
  }, [items]);

  const isFavorite = useCallback((id: string) => items.some((item) => item.id === id), [items]);
  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setItems((current) => (
      current.some((favorite) => favorite.id === item.id)
        ? current.filter((favorite) => favorite.id !== item.id)
        : [...current, item]
    ));
  }, []);
  const removeFavorite = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({ items, isFavorite, toggleFavorite, removeFavorite }),
    [isFavorite, items, removeFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
