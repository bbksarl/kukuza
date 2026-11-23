import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { z } from 'zod';
import { ApiClient } from '../core/api-client.service';
import { LanguageService } from '../core/language.service';
import { AuthLayoutComponent } from './auth-layout.component';

const emailSchema = z.string().trim().email();

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  template: `<k-auth-layout
    ><main class="mx-auto w-full max-w-lg space-y-5">
      <h1 class="text-center text-2xl font-bold text-white">{{ t('forgot.title') }}</h1>
      <p class="text-center text-sm text-white/75">{{ t('forgot.description') }}</p>
      @if (message()) {
        <p
          role="status"
          class="rounded border border-emerald-300/40 bg-emerald-950/30 p-3 text-sm text-emerald-100"
        >
          {{ message() }}
        </p>
      }
      @if (error()) {
        <p role="alert" class="rounded border border-red-300/40 bg-red-950/30 p-3 text-sm text-red-100">
          {{ error() }}
        </p>
      }
      <form class="space-y-4" (ngSubmit)="submit()">
        <label class="block text-sm font-medium text-white" for="reset-email">{{ t('forgot.email') }}</label>
        <input
          id="reset-email"
          name="email"
          type="email"
          autocomplete="email"
          required
          [formControl]="email"
          class="w-full rounded-md border border-white/30 bg-white/10 px-4 py-3 text-white"
        />
        <button
          type="submit"
          [disabled]="busy()"
          class="w-full rounded-md bg-primary px-4 py-3 font-bold text-white disabled:opacity-60"
        >
          {{ busy() ? t('forgot.sending') : t('forgot.send') }}
        </button>
      </form>
      <a routerLink="/auth/login" class="block text-center text-sm text-white underline">{{
        t('forgot.backToLogin')
      }}</a>
    </main></k-auth-layout
  >`,
})
export class ForgotPasswordComponent {
  private readonly api = inject(ApiClient);
  readonly t = inject(LanguageService).t;
  readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  readonly busy = signal(false);
  readonly message = signal('');
  readonly error = signal('');

  async submit(): Promise<void> {
    this.email.markAsTouched();
    const parsed = emailSchema.safeParse(this.email.value);
    if (!parsed.success || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.message.set('');
    try {
      await this.api.post('/Auth/forgot-password', { email: parsed.data });
      this.message.set(this.t('forgot.sent'));
    } catch {
      this.error.set(this.t('forgot.error'));
    } finally {
      this.busy.set(false);
    }
  }
}
