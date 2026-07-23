import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '@/core/i18n';
import Header from './Header';

describe('portal language selector', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = 'fr';
  });

  it('updates the shared language and translated labels', () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </LanguageProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /choisir une langue/i }));
    fireEvent.click(screen.getByRole('option', { name: /english/i }));

    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem('kukuza-language')).toBe('en');
    expect(screen.getByRole('button', { name: /choose a language \(EN\)/i })).toBeVisible();
    expect(screen.getAllByRole('button', { name: 'Search' })[0]).toBeVisible();
  });
});
