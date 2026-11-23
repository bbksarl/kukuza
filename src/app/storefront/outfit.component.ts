import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getOutfitById } from '@/features/portal/data/outfits';
import { LanguageService } from '../core/language.service';
import { SeoService } from '../core/seo.service';
@Component({
  standalone: true,
  imports: [RouterLink],
  template: ` @if (outfit(); as outfit) {
    <main class="px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <button class="mb-6 text-sm font-semibold text-slate-600" (click)="location.back()">
          ← {{ t('product.back') }}
        </button>
        <section
          class="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]"
        >
          <div class="relative bg-slate-100 p-3 sm:p-5">
            <div class="relative h-[min(72vh,720px)] min-h-[420px] overflow-hidden rounded-2xl bg-slate-200">
              <img
                [src]="outfit.images[selected()].src"
                [alt]="t(outfit.images[selected()].altKey)"
                class="h-full w-full object-cover"
              />
              <button
                class="absolute left-4 top-1/2 rounded-full bg-white/90 p-3"
                [attr.aria-label]="t('outfit.previousImage')"
                (click)="move(-1)"
              >
                ❮
              </button>
              <button
                class="absolute right-4 top-1/2 rounded-full bg-white/90 p-3"
                [attr.aria-label]="t('outfit.nextImage')"
                (click)="move(1)"
              >
                ❯
              </button>
            </div>
            <div class="mt-4 grid grid-cols-3 gap-3" role="region" [attr.aria-label]="t('outfit.gallery')">
              @for (image of outfit.images; track image.src) {
                <button
                  class="h-24 overflow-hidden rounded-xl border-2 sm:h-32"
                  [class.border-teal-700]="selected() === $index"
                  [attr.aria-pressed]="selected() === $index"
                  [attr.aria-label]="t('sections.goToLook', { value: $index + 1 })"
                  (click)="selected.set($index)"
                >
                  <img [src]="image.src" alt="" class="h-full w-full object-cover" />
                </button>
              }
            </div>
          </div>
          <div class="flex flex-col p-6 sm:p-10 lg:p-12">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              {{ t('sections.outfitTitle') }}
            </p>
            <h1 class="mt-4 text-3xl font-bold sm:text-4xl">{{ t(outfit.titleKey) }}</h1>
            <p class="mt-6 text-base leading-7 text-slate-600">{{ t(outfit.descriptionKey) }}</p>
            <div class="mt-9 border-t border-slate-200 pt-7">
              <h2 class="text-sm font-bold uppercase">{{ t('outfit.details') }}</h2>
              <p class="mt-3 text-sm text-slate-500">{{ t('outfit.detailsHint') }}</p>
              <ul class="mt-5 space-y-3">
                @for (image of outfit.images; track image.src) {
                  <li>{{ t(image.altKey) }}</li>
                }
              </ul>
            </div>
            <a
              routerLink="/products"
              class="mt-8 rounded-full bg-slate-900 px-6 py-3 text-center text-white"
              >{{ t('product.backToProducts') }}</a
            >
          </div>
        </section>
      </div>
    </main>
  }`,
})
export class OutfitComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  readonly location = inject(Location);
  readonly outfit = signal(getOutfitById(undefined));
  readonly selected = signal(0);
  constructor() {
    const router = inject(Router);
    const seo = inject(SeoService);
    inject(ActivatedRoute)
      .paramMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const outfit = getOutfitById(params.get('outfitId') ?? '');
        this.outfit.set(outfit);
        const navigationState = router.getCurrentNavigation()?.extras.state;
        this.selected.set(Math.min(2, Math.max(0, Number(navigationState?.['imageIndex']) || 0)));
        if (!outfit) void router.navigateByUrl('/', { replaceUrl: true });
        else
          seo.update(
            `${this.t(outfit.titleKey)} | KUKUZA`,
            this.t(outfit.descriptionKey),
            `/outfits/${outfit.id}`,
            outfit.images[0].src,
          );
      });
  }
  move(delta: number): void {
    this.selected.update((index) => (index + delta + 3) % 3);
  }
}
