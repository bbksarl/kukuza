import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { AdminOverview } from '../types';

export function useAdminOverview() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    adminService.getOverview()
      .then((overview) => {
        if (!cancelled) setData(overview);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError : new Error('Admin overview unavailable'));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error } as const;
}

