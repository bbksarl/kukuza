import { facadeClient } from '@/api/client';
import { mockAdminOverview } from '../data/adminData';
import type { AdminOverview } from '../types';

const isDevelopment = Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV);

export const adminService = {
  async getOverview(): Promise<AdminOverview> {
    try {
      return await facadeClient.get<AdminOverview>('/admin/overview');
    } catch (error) {
      if (isDevelopment) {
        console.warn('[adminService] API unavailable, using development overview data.', error);
        return mockAdminOverview;
      }
      throw error;
    }
  },
};

