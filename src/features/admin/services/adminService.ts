import { facadeClient } from '@/api/client';
import { adminOverviewSchema } from '@/api/contracts/admin';
import { mockAdminOverview } from '../data/adminData';
import type { AdminOverview } from '../types';
import { runtimeConfig } from '@/config/runtime';

export const adminService = {
  async getOverview(): Promise<AdminOverview> {
    try {
      const { totals, ...overview } = adminOverviewSchema.parse(await facadeClient.get<unknown>('/admin/overview'));
      const revenue = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: runtimeConfig.currency, maximumFractionDigits: 0 }).format(totals.revenue);
      return {
        ...overview,
        kpis: [
          { id: 'revenue', labelKey: 'admin.kpi.revenue', value: revenue, trend: '', trendPositive: true },
          ...(['boutiques', 'users', 'products'] as const).map((id) => ({
            id, labelKey: `admin.kpi.${id}`, value: String(totals[id]), trend: '', trendPositive: true,
          })),
        ],
      };
    } catch (error) {
      if (runtimeConfig.enableApiMocks) return mockAdminOverview;
      throw error;
    }
  },
};
