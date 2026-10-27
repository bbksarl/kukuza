import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '@/core/i18n';
import { CartProvider } from '@/providers/CartProvider';
import CartPage from './CartPage';
import { facadeClient, FacadeHttpError } from '@/api/client';

describe('cart page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(facadeClient, 'get').mockRejectedValue(new FacadeHttpError(401, 'Unauthorized', null, 'test'));
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    window.localStorage.setItem('kukuza-cart', JSON.stringify([
      {
        id: 'product:1:default',
        name: 'Robe Soleil Dakar',
        price: 125,
        image: '/assets/products/p1.png',
        quantity: 1,
      },
    ]));
  });

  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('keeps the cart and asks the guest to authenticate before checkout', async () => {
    render(
      <LanguageProvider>
        <CartProvider>
          <MemoryRouter initialEntries={['/cart']}>
            <Routes>
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </MemoryRouter>
        </CartProvider>
      </LanguageProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Votre panier' })).toBeVisible();
    expect(screen.getByText('Robe Soleil Dakar')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Payer' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Connectez-vous pour finaliser votre commande.');
    expect(window.localStorage.getItem('kukuza-cart')).not.toBe('[]');
  });
});
