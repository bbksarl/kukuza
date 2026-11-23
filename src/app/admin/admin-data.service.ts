import { inject, Injectable } from '@angular/core';
import { ApiClient } from '../core/api-client.service';
import { adminOverviewSchema } from '@/api/contracts/admin';
import { mockAdminOverview } from '@/features/admin/data/adminData';
import type { AdminOverview } from '@/features/admin/types';
import { runtimeConfig } from '@/config/runtime';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly api = inject(ApiClient);

  async overview(): Promise<AdminOverview> {
    if (runtimeConfig.enableApiMocks) return mockAdminOverview;
    const { totals, ...overview } = adminOverviewSchema.parse(await this.api.get('/admin/overview'));
    const revenue = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: runtimeConfig.currency,
      maximumFractionDigits: 0,
    }).format(totals.revenue);
    return {
      ...overview,
      kpis: [
        { id: 'revenue', labelKey: 'admin.kpi.revenue', value: revenue, trend: '', trendPositive: true },
        ...(['boutiques', 'users', 'products'] as const).map((id) => ({
          id,
          labelKey: `admin.kpi.${id}`,
          value: String(totals[id]),
          trend: '',
          trendPositive: true,
        })),
      ],
    };
  }
}
