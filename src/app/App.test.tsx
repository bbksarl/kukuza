import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

afterEach(() => {
  window.history.replaceState({}, '', '/');
});

describe('unified application routing', () => {
  it('serves authentication from the single application router', async () => {
    window.history.pushState({}, '', '/auth/login');

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Connexion' })).toBeVisible();
    expect(screen.getByRole('link', { name: /s'inscrire/i })).toHaveAttribute('href', '/auth/register');
  });
});
