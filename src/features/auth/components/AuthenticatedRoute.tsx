import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../domain/auth/entities/User';
import { useLanguage } from '@/core/i18n';

export function AuthenticatedRoute({ children, roles }: { children: ReactNode; roles: User['role'][] }) {
  const { user, checkingSession, error, checkAuth } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  if (checkingSession) return <main role="status" className="p-8">{t('app.loading')}</main>;
  if (!user && error) return (
    <main className="p-8">
      <p role="alert">{error}</p>
      <button type="button" onClick={() => void checkAuth()}>Réessayer</button>
    </main>
  );
  if (!user) {
    const returnUrl = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }
  return roles.includes(user.role) ? children : <Navigate to="/forbidden" replace />;
}
