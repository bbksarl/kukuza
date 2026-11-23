import { FormControl } from '@angular/forms';
import { inject, signal } from '@angular/core';
import { LanguageService } from '../core/language.service';
import { AdminDataService } from './admin-data.service';
import type { AdminOverview } from '@/features/admin/types';

export abstract class AdminPageBase {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  readonly data = signal<AdminOverview | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly query = new FormControl('', { nonNullable: true });
  protected readonly admin = inject(AdminDataService);

  protected load(): void {
    void this.admin
      .overview()
      .then((value) => this.data.set(value))
      .catch(() => this.error.set(true))
      .finally(() => this.loading.set(false));
  }
}
