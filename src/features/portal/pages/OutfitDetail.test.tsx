import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '@/core/i18n';
import OutfitDetail from './OutfitDetail';

describe('outfit detail', () => {
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

  it('renders the selected weekly look with its gallery', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/outfits/femme']}>
          <Routes>
            <Route path="/outfits/:outfitId" element={<OutfitDetail />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByRole('heading', { name: 'L’élégance intemporelle' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Détails du look' })).toBeVisible();
    expect(screen.getByRole('region', { name: 'Galerie du look' })).toBeVisible();
  });
});
