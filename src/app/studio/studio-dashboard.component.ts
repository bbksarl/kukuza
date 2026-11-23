import { Component, computed, inject, signal } from '@angular/core';
import { ChartComponent } from '../shared/ui/chart.component';
import { SeoService } from '../core/seo.service';
import { LanguageService } from '../core/language.service';
import { StudioDataService } from './studio-data.service';
import type { Product } from '@/features/shop/types';

@Component({
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './studio-dashboard.component.html',
})
export class StudioDashboardComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  private readonly data = inject(StudioDataService);
  readonly overview = signal<Awaited<ReturnType<StudioDataService['overview']>> | null>(null);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly cards = computed(() => {
    const stats = this.overview()?.stats;
    if (!stats) return [];
    return [
      {
        label: this.t('shop.totalRevenue'),
        value: this.lang.money(stats.totalRevenue),
        change: stats.revenueChange,
      },
      {
        label: this.t('shop.dailyRevenue'),
        value: stats.dailyRevenue == null ? '—' : this.lang.money(stats.dailyRevenue),
        change: stats.dailyRevenueChange,
      },
      { label: this.t('shop.sold'), value: String(stats.totalSales), change: stats.salesChange },
      { label: this.t('shop.activeUsers'), value: String(stats.activeUsers), change: stats.usersChange },
    ];
  });

  constructor() {
    inject(SeoService).update(
      'Ma boutique | KUKUZA',
      'Tableau de bord boutique.',
      '/shop/dashboard',
      undefined,
      undefined,
      true,
    );
    void Promise.all([this.data.overview(), this.data.products()])
      .then(([overview, products]) => {
        this.overview.set(overview);
        this.products.set(products);
      })
      .catch(() => this.error.set(this.t('shop.dashboardUnavailable')))
      .finally(() => this.loading.set(false));
  }
}
