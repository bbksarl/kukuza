import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/core/i18n';
import Header from './Header';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

function renderHeader(path = '/products') {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[path]}>
        <Header />
        <LocationProbe />
        <button type="button">En dehors de la navigation</button>
      </MemoryRouter>
    </LanguageProvider>,
  );
}

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

  it('opens one panel at a time and returns focus after Escape', async () => {
    const user = userEvent.setup();
    renderHeader();
    const searchButton = screen.getByRole('button', { name: 'Rechercher' });
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    await user.click(searchButton);
    expect(screen.getByRole('searchbox')).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(searchButton).toHaveFocus();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /choisir une langue/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(searchButton);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'En dehors de la navigation' }));
    expect(searchButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('preserves filters on search and closes the panel after navigation', async () => {
    const user = userEvent.setup();
    renderHeader('/products?nav=vetements&filter=Robes');
    await user.click(screen.getByRole('button', { name: 'Rechercher' }));
    await user.type(screen.getByRole('searchbox'), '  coton  {Enter}');
    const location = new URL(screen.getByTestId('location').textContent!, 'https://kukuza.test');
    expect(location.pathname).toBe('/products');
    expect(Object.fromEntries(location.searchParams)).toEqual({ nav: 'vetements', filter: 'Robes', q: 'coton' });
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('uses the open category title even when a different category is selected', async () => {
    const user = userEvent.setup();
    renderHeader('/products?nav=nouveautes&q=coton');
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(screen.getByRole('button', { name: /^vêtements$/i }));
    expect(screen.getByRole('heading', { name: /^vêtements$/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Robes' }));
    const location = new URL(screen.getByTestId('location').textContent!, 'https://kukuza.test');
    expect(Object.fromEntries(location.searchParams)).toEqual({ nav: 'vetements', filter: 'Robes', q: 'coton' });
    expect(screen.queryByRole('heading', { name: /^vêtements$/i })).not.toBeInTheDocument();
  });

  it('supports changing language with the keyboard', async () => {
    const user = userEvent.setup();
    renderHeader();
    const languageButton = screen.getByRole('button', { name: /choisir une langue/i });
    await user.click(languageButton);
    expect(screen.getByRole('option', { name: /français/i })).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(document.documentElement.lang).toBe('en');
    expect(languageButton).toHaveFocus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('restores page scroll styles on unmount', () => {
    const style = document.documentElement.style;
    style.setProperty('scroll-padding-top', '12px', 'important');
    style.removeProperty('--portal-header-height');
    const { unmount } = renderHeader();
    expect(style.getPropertyValue('scroll-padding-top')).toBe('64px');
    unmount();
    expect(style.getPropertyValue('scroll-padding-top')).toBe('12px');
    expect(style.getPropertyPriority('scroll-padding-top')).toBe('important');
    expect(style.getPropertyValue('--portal-header-height')).toBe('');
    style.removeProperty('scroll-padding-top');
  });
});
