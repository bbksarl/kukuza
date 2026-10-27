import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthenticatedRoute } from './AuthenticatedRoute';
import { useAuth, type UseAuthReturn } from '../hooks/useAuth';
import { User } from '../domain/auth/entities/User';

vi.mock('../hooks/useAuth', () => ({ useAuth: vi.fn() }));
const renderRoute = () => render(
  <MemoryRouter initialEntries={['/admin']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/admin" element={<AuthenticatedRoute roles={['admin']}><p>Contenu administrateur</p></AuthenticatedRoute>} />
      <Route path="/auth/login" element={<p>Connexion requise</p>} />
      <Route path="/forbidden" element={<p>Accès interdit</p>} />
    </Routes>
  </MemoryRouter>,
);
const state = { user: null, isAuthenticated: false, loading: false, checkingSession: false, error: null,
  checkAuth: vi.fn(), logout: vi.fn(), register: vi.fn(), login: vi.fn() } satisfies UseAuthReturn;

beforeEach(() => { vi.mocked(useAuth).mockReturnValue(state); });
describe('verified route access', () => {
  it('waits for verification instead of displaying private content or redirecting', () => {
    vi.mocked(useAuth).mockReturnValue({ ...state, checkingSession: true });
    renderRoute();
    expect(screen.getByRole('status')).toBeVisible();
    expect(screen.queryByText('Contenu administrateur')).not.toBeInTheDocument();
    expect(screen.queryByText('Connexion requise')).not.toBeInTheDocument();
  });
  it('redirects an expired session to login', () => {
    renderRoute();
    expect(screen.getByText('Connexion requise')).toBeVisible();
  });
  it('rejects a verified customer trying to access administration', () => {
    vi.mocked(useAuth).mockReturnValue({ ...state, isAuthenticated: true,
      user: new User(12, 'amina', 'amina@example.com', 'customer', '2026-10-26T00:00:00Z') });
    renderRoute();
    expect(screen.getByText('Accès interdit')).toBeVisible();
  });
});
