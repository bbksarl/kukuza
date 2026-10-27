import type { ReactNode } from 'react';
import { AuthenticatedRoute } from '@/features/auth/components/AuthenticatedRoute';

export default function ShopRoute({ children }: { children: ReactNode }) {
  return <AuthenticatedRoute roles={['creator', 'admin']}>{children}</AuthenticatedRoute>;
}
