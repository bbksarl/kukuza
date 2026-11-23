import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { loginValidationSchema } from '@/features/auth/utils/validation';
import { LanguageService } from '../core/language.service';
import { SessionService } from '../core/session.service';
import { safeReturnUrl } from '../core/safe-return-url';
import { SeoService } from '../core/seo.service';
import { AuthLayoutComponent } from './auth-layout.component';
import { AuthFieldComponent } from './auth-field.component';
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent, AuthFieldComponent],
  template: ` <k-auth-layout>
    <div class="w-full space-y-2 sm:space-y-3">
      <h1 class="text-center text-base font-bold text-primary sm:text-xl md:text-2xl">
        {{ t('auth.login') }}
      </h1>
      @if (session.error()) {
        <div role="alert" class="auth-error-alert rounded border px-3 py-2 text-sm">
          {{ lang.text(session.error()) }}
        </div>
      }
      <form class="mt-3 space-y-3" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <fieldset [disabled]="session.busy()" class="space-y-3">
          <k-auth-field
            [control]="form.controls.username"
            name="username"
            [label]="t('auth.username')"
            [placeholder]="t('auth.usernamePlaceholder')"
            autocomplete="username"
            [error]="errors()['username'] || ''"
          />
          <k-auth-field
            [control]="form.controls.password"
            name="password"
            type="password"
            [label]="t('auth.password')"
            placeholder="••••••••"
            autocomplete="current-password"
            [error]="errors()['password'] || ''"
          />
          <div class="flex justify-end">
            <a
              routerLink="/forgot-password"
              class="text-xs font-medium text-white hover:text-green-400 sm:text-sm"
              >{{ t('auth.forgotPassword') }}</a
            >
          </div>
          <button
            type="submit"
            class="auth-button w-full rounded-md bg-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
            [disabled]="session.busy()"
          >
            {{ session.busy() ? t('app.loading') : t('auth.submitLogin') }}
          </button>
          <p class="text-right text-xs text-gray-400 sm:text-sm">
            {{ t('auth.noAccount') }}
            <a routerLink="/auth/register" class="font-medium text-primary">{{ t('auth.signUp') }}</a>
          </p>
        </fieldset>
      </form>
    </div>
  </k-auth-layout>`,
})
export class LoginComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  readonly session = inject(SessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });
  readonly errors = signal<Record<string, string>>({});
  constructor() {
    inject(SeoService).update(
      'Connexion | KUKUZA',
      'Connectez-vous à votre compte KUKUZA.',
      '/auth/login',
      undefined,
      undefined,
      true,
    );
  }
  async submit(): Promise<void> {
    if (this.session.busy()) return;
    this.form.markAllAsTouched();
    const parsed = loginValidationSchema.safeParse(this.form.getRawValue());
    this.errors.set(
      parsed.success
        ? {}
        : Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])),
    );
    if (!parsed.success) return;
    try {
      const result = await this.session.login(parsed.data);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(
        safeReturnUrl(returnUrl)
          ? returnUrl
          : result.role === 'admin'
            ? '/admin/dashboard'
            : result.role === 'creator'
              ? '/shop/dashboard'
              : '/',
        { replaceUrl: true },
      );
    } catch {
      /* The form and session error remain visible. */
    }
  }
}
