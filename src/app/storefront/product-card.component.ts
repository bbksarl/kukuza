import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../core/language.service';
import type { PortalProduct } from '@/features/portal/data/catalog';
@Component({
  selector: 'k-product-card',
  standalone: true,
  imports: [RouterLink],
  template: ` <article
    class="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <a
      [routerLink]="[catalog() ? '/catalog/product' : '/products', product().id]"
      class="block w-full text-left focus-visible:ring-2 focus-visible:ring-teal-700"
      [attr.aria-label]="t('catalog.viewProduct') + ' ' + product().name"
    >
      <div class="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          [src]="product().image_url"
          [alt]="product().name"
          loading="lazy"
          width="480"
          height="600"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          (error)="fallback($event)"
        />
        @if (product().isPromoted) {
          <span
            class="absolute left-3 top-3 rounded-full bg-teal-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
            >{{ t('catalog.selection') }}</span
          >
        }
        <span
          class="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-slate-900 shadow"
          >{{ lang.money(product().price) }}</span
        >
      </div>
      <div class="space-y-2 p-4">
        <h3 class="truncate text-base font-bold text-slate-900">{{ product().name }}</h3>
        <p class="truncate text-xs font-semibold uppercase tracking-wider text-slate-500">
          {{ product().boutique_name || product().brand }}
        </p>
        <div class="flex items-center justify-between gap-3 pt-1">
          <span class="text-lg font-bold text-teal-700">{{ lang.money(product().price) }}</span>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{{
            lang.label(product().category)
          }}</span>
        </div>
      </div>
    </a>
  </article>`,
})
export class ProductCardComponent {
  readonly product = input.required<PortalProduct>();
  readonly catalog = input(false);
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  fallback(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/assets/logo-display.webp')) image.src = '/assets/logo-display.webp';
  }
}
