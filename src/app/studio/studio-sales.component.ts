import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../core/language.service';
import { SeoService } from '../core/seo.service';
import { StudioDataService } from './studio-data.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './studio-sales.component.html',
})
export class StudioSalesComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  private readonly data = inject(StudioDataService);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly sales = signal<Awaited<ReturnType<StudioDataService['sales']>>>([]);
  readonly search = new FormControl('', { nonNullable: true });
  readonly filtered = computed(() =>
    this.sales().filter((sale) =>
      `${sale.reference} ${sale.productName} ${sale.customer}`
        .toLowerCase()
        .includes(this.search.value.toLowerCase()),
    ),
  );

  constructor() {
    inject(SeoService).update(
      'Ventes boutique | KUKUZA',
      'Historique des ventes de votre boutique.',
      '/shop/ventes',
      undefined,
      undefined,
      true,
    );
    void this.data
      .sales()
      .then((sales) => this.sales.set(sales))
      .catch(() => this.error.set(true))
      .finally(() => this.loading.set(false));
  }
}
