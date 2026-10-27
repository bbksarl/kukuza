import type { ReactNode } from 'react';
import { AuthenticatedRoute } from '@/features/auth/components/AuthenticatedRoute';

export default function AdminRoute({ children }: { children: ReactNode }) {
  return <AuthenticatedRoute roles={['admin']}>{children}</AuthenticatedRoute>;
}
