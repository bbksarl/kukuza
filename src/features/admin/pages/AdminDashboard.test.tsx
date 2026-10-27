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

  it('shows a clear error when the admin API is unavailable', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminDashboard />
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(await screen.findByText('La vue globale est momentanément indisponible.')).toBeVisible();
  });
});
