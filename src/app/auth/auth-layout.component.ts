import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../core/language.service';
@Component({
  selector: 'k-auth-layout',
  standalone: true,
  imports: [RouterLink],
  template: ` <div
    class="auth-container"
    style="background-image:linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.65)),url(/assets/auth/bg.webp)"
  >
    <a routerLink="/" class="home-button">
      <span aria-hidden="true">⌂</span>
      <span class="hidden xs:inline">{{ t('auth.home') }}</span>
    </a>
    <label class="absolute right-4 top-4 z-10">
      <span class="sr-only">{{ t('language.choose') }}</span>
      <select
        [value]="lang.language()"
        (change)="lang.set($any($event.target).value)"
        class="rounded-md border border-white/30 bg-black/30 px-2 py-1 text-xs font-semibold text-white"
      >
        <option value="fr">FR</option>
        <option value="en">EN</option>
      </select>
    </label>
    <div class="kukuza-logo" aria-hidden="true">
      <div class="kukuza-logo-img kukuza-logo-inner">
        <img src="/assets/auth/logo.webp" alt="" style="width:100%;height:auto;display:block" />
      </div>
    </div>
    <div class="auth-form-container">
      <ng-content />
    </div>
  </div>`,
})
export class AuthLayoutComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
}
