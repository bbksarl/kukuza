import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../core/language.service';
import { FavoritesService } from './cart.service';
@Component({
  standalone: true,
  imports: [RouterLink],
  template: `<main class="mx-auto min-h-[60vh] max-w-6xl px-4 pb-20 pt-24">
    <h1 class="mb-8 text-3xl font-bold">{{ t('favorites.title') }}</h1>
    <p class="mb-6 text-sm text-slate-500">{{ t('favorites.count', { value: favorites.items().length }) }}</p>
    @if (!favorites.items().length) {
      <section class="rounded-3xl bg-white p-12 text-center">
        <p>{{ t('favorites.empty') }}</p>
        <a routerLink="/products" class="mt-6 inline-block rounded-full bg-teal-700 px-6 py-3 text-white">{{
          t('favorites.discover')
        }}</a>
      </section>
    }
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      @for (item of favorites.items(); track item.id) {
        <article class="overflow-hidden rounded-2xl bg-white shadow-sm">
          <a [routerLink]="item.href">
            <img [src]="item.image" [alt]="item.name" class="aspect-[4/5] w-full object-cover" />
            <h2 class="px-5 pt-5 font-bold">{{ item.name }}</h2>
          </a>
          <p class="px-5 py-2 font-bold text-teal-700">{{ lang.money(item.price, item.currency) }}</p>
          <button (click)="favorites.toggle(item)" class="m-5 text-sm text-red-600">
            {{ t('favorites.remove') }}
          </button>
        </article>
      }
    </div>
  </main>`,
})
export class FavoritesComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  readonly favorites = inject(FavoritesService);
}
