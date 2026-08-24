import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '@/core/i18n';
import { CartProvider } from '@/providers/CartProvider';
import ProductDetail from './ProductDetail';

describe('portal product detail', () => {
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
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the selected product details from its route id', () => {
    render(
      <LanguageProvider>
        <CartProvider>
          <MemoryRouter initialEntries={['/products/1']}>
            <Routes>
              <Route path="/products/:productId" element={<ProductDetail />} />
            </Routes>
          </MemoryRouter>
        </CartProvider>
      </LanguageProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Robe Soleil Dakar' })).toBeVisible();
    expect(screen.getByText('Maison Nene')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Détails du produit' })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Acheter' }));
    expect(screen.getByRole('button', { name: 'Panier (1)' })).toBeVisible();
  });
});
