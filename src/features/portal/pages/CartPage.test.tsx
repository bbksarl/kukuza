import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '@/core/i18n';
import { CartProvider } from '@/providers/CartProvider';
import CartPage from './CartPage';

describe('cart page', () => {
  beforeEach(() => {
    window.localStorage.clear();
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

  afterEach(() => vi.unstubAllGlobals());

  it('displays the cart and resets it after payment', async () => {
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

    expect(await screen.findByRole('heading', { name: 'Paiement effectué' })).toBeVisible();
    await waitFor(() => expect(window.localStorage.getItem('kukuza-cart')).toBe('[]'));
  });
});
