import { Component } from '@angular/core';
import { ChartComponent } from '../shared/ui/chart.component';
import { AdminPageBase } from './admin-page-base';

@Component({
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './admin-sales.component.html',
})
export class AdminSalesComponent extends AdminPageBase {
  constructor() {
    super();
    this.load();
  }
}
