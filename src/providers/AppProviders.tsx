import type { PropsWithChildren } from 'react';
import { LanguageProvider } from '@/core/i18n';
import { CartProvider } from './CartProvider';
import { FavoritesProvider } from './FavoritesProvider';

/** Application-wide provider boundary. Feature providers can be composed here. */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <LanguageProvider>
      <CartProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
