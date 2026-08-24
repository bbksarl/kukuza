import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const hasAdminSession = () => {
  if (typeof window === 'undefined') return false;

  try {
    const stored = window.localStorage.getItem('kukuza-auth-user');
    if (!stored) return false;
    const user = JSON.parse(stored) as { role?: string };
    return user.role === 'admin';
  } catch {
    return false;
  }
};

export default function AdminRoute({ children }: { children: ReactNode }) {
  return hasAdminSession() ? children : <Navigate to="/auth/login" replace />;
}

