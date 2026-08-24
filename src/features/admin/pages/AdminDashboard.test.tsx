import { render, screen } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/core/i18n';
import AdminDashboard from './AdminDashboard';

describe('admin dashboard', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('API unavailable')));
  });

  afterEach(() => vi.unstubAllGlobals());

  it('shows the global marketplace overview in development', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminDashboard />
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(await screen.findByRole('heading', { name: 'Vue globale' })).toBeVisible();
    expect(screen.getByText('Boutiques les plus performantes')).toBeVisible();
    expect(screen.getByText('Produits les plus vendus')).toBeVisible();
    expect(screen.getByText('Utilisateurs récents')).toBeVisible();
  });
});

