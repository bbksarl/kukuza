import { Component, inject } from '@angular/core';
import { ChartComponent } from '../shared/ui/chart.component';
import { SeoService } from '../core/seo.service';
import { AdminPageBase } from './admin-page-base';

@Component({
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent extends AdminPageBase {
  constructor() {
    super();
    inject(SeoService).update(
      'Administration | KUKUZA',
      'Vue globale de la marketplace.',
      '/admin/dashboard',
      undefined,
      undefined,
      true,
    );
    this.load();
  }
}
