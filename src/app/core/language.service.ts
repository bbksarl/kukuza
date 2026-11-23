import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { runtimeConfig } from '@/config/runtime';
import { catalogLabels, freeTextTranslations, messages, type Language } from './translations';
import { formatMoney } from './format-money';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  readonly language = signal<Language>(this.read());
  constructor() {
    this.document.documentElement.lang = this.language();
  }
  private read(): Language {
    try {
      return localStorage.getItem('kukuza-language') === 'en' ? 'en' : 'fr';
    } catch {
      return 'fr';
    }
  }
  set(language: string): void {
    const next = language === 'en' ? 'en' : 'fr';
    this.language.set(next);
    this.document.documentElement.lang = next;
    try {
      localStorage.setItem('kukuza-language', next);
    } catch {
      /* Memory remains available. */
    }
    const view = this.document.defaultView;
    if (view)
      view.dispatchEvent(new view.CustomEvent('kukuza:language-change', { detail: { language: next } }));
  }
  readonly t = (key: string, values?: Record<string, string | number>): string => {
    let text = messages[this.language()][key] ?? messages.fr[key] ?? key;
    for (const [name, value] of Object.entries(values ?? {})) text = text.replace(`{${name}}`, String(value));
    return text;
  };
  readonly label = (value?: string | null): string => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
    return (
      Object.entries(catalogLabels).find(([key]) => normalize(key) === normalize(value ?? ''))?.[1][
        this.language()
      ] ??
      value ??
      ''
    );
  };
  text(value: string): string {
    return this.language() === 'en' ? (freeTextTranslations[value] ?? value) : value;
  }
  readonly money = (value: number, currency = runtimeConfig.currency): string =>
    formatMoney(value, currency, this.language());
}
