import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '@/core/i18n';
import BestSellerDetail from './BestSellerDetail';

describe('best seller detail', () => {
  beforeEach(() => {
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

  it('uses the same product detail layout as the catalogue', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/best-sellers/robe-porte-feuille']}>
          <Routes>
            <Route path="/best-sellers/:slug" element={<BestSellerDetail />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Robe Porte-Feuille' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Détails du produit' })).toBeVisible();
    expect(screen.getByText('Taille(s) disponible(s)')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Ajouter au panier' })).toBeVisible();
  });

  it('changes the product image when a color is selected', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/best-sellers/robe-porte-feuille']}>
          <Routes>
            <Route path="/best-sellers/:slug" element={<BestSellerDetail />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByRole('img', { name: 'Robe rouge elegante' })).toHaveAttribute('src', '/assets/mVentes/im1.png');
    fireEvent.click(screen.getByRole('button', { name: 'Noir intense' }));
    expect(screen.getByRole('img', { name: 'Robe rouge elegante' })).toHaveAttribute('src', '/assets/mVentes/im1-noir.png');
    fireEvent.click(screen.getByRole('button', { name: 'Rouge bordeaux' }));
    expect(screen.getByRole('img', { name: 'Robe rouge elegante' })).toHaveAttribute('src', '/assets/mVentes/im1.png');
  });
});
