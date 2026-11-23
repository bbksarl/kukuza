import { Component, inject, RESPONSE_INIT, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SessionService } from '../../core/session.service';
import { safeReturnUrl } from '../../core/safe-return-url';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `<main
    class="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center"
  >
    <p class="text-sm font-bold text-teal-700">404</p>
    <h1 class="mt-2 text-3xl font-bold">{{ t('status.notFoundTitle') }}</h1>
    <p class="mt-4 text-slate-600">{{ t('status.notFoundMessage') }}</p>
    <a routerLink="/" class="mt-7 rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white">{{
      t('status.home')
    }}</a>
  </main>`,
})
export class NotFoundComponent {
  readonly t = inject(LanguageService).t;

  constructor() {
    const response = inject(RESPONSE_INIT, { optional: true });
    if (response) response.status = 404;
    inject(SeoService).update(
      'Page introuvable | KUKUZA',
      'Cette page n’existe pas.',
      '/not-found',
      undefined,
      undefined,
      true,
    );
  }
}

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `<main
    class="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center"
  >
    <h1 class="text-3xl font-bold">{{ t('status.forbiddenTitle') }}</h1>
    <p class="mt-4 text-slate-600">{{ t('status.forbiddenMessage') }}</p>
    <a routerLink="/" class="mt-7 rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white">{{
      t('status.home')
    }}</a>
  </main>`,
})
export class ForbiddenComponent {
  readonly t = inject(LanguageService).t;
}

@Component({
  standalone: true,
  template: `<main
    class="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center"
  >
    <h1 class="text-3xl font-bold">{{ t('status.sessionTitle') }}</h1>
    <p class="mt-4 text-slate-600">{{ t('status.sessionMessage') }}</p>
    @if (session.error()) {
      <p role="alert" class="mt-4 text-red-700">{{ session.error() }}</p>
    }
    <button
      type="button"
      class="mt-7 rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white disabled:opacity-60"
      [disabled]="checking()"
      (click)="retry()"
    >
      {{ checking() ? t('status.checking') : t('status.retry') }}
    </button>
    <a routerLink="/auth/login" class="mt-4 text-teal-800 underline">{{ t('auth.login') }}</a>
  </main>`,
})
export class SessionUnavailableComponent {
  readonly session = inject(SessionService);
  readonly t = inject(LanguageService).t;
  readonly checking = signal(false);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  async retry(): Promise<void> {
    if (this.checking()) return;
    this.checking.set(true);
    try {
      await this.session.check();
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      if (this.session.user()) {
        await this.router.navigateByUrl(safeReturnUrl(returnUrl) ? returnUrl : '/');
      } else if (!this.session.error()) {
        await this.router.navigateByUrl('/auth/login');
      }
    } finally {
      this.checking.set(false);
    }
  }
}
