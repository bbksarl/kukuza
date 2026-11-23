import { Component, computed, HostListener, inject, input, signal } from '@angular/core';
import { z } from 'zod';
import { runtimeConfig } from '@/config/runtime';
import { LanguageService } from '../../core/language.service';
import { IconComponent } from './icon.component';
const notificationSchema = z.object({
  id: z.string(),
  titleKey: z.string(),
  messageKey: z.string(),
  timeKey: z.string(),
  read: z.boolean(),
});
type Notification = z.infer<typeof notificationSchema>;
@Component({
  selector: 'k-notifications',
  standalone: true,
  imports: [IconComponent],
  template: ` <div class="relative">
    <button
      class="relative rounded-full p-2 text-slate-600"
      [attr.aria-label]="t('notifications.buttonLabel', { value: unread() })"
      [attr.aria-expanded]="open()"
      aria-haspopup="dialog"
      (click)="toggle()"
    >
      <k-icon name="bell" />
      @if (unread()) {
        <span class="absolute -right-1 -top-1 rounded-full bg-red-500 px-1 text-[10px] text-white">{{
          unread()
        }}</span>
      }
    </button>
    @if (open()) {
      <section
        role="dialog"
        [attr.aria-label]="t('notifications.title')"
        class="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl"
      >
        <div class="flex justify-between">
          <h2 class="font-bold">{{ t('notifications.title') }}</h2>
          <button (click)="open.set(false)" [attr.aria-label]="t('navigation.close')">×</button>
        </div>
        @if (selected(); as item) {
          <button class="my-3 text-sm text-teal-700" (click)="selected.set(null)">
            ← {{ t('notifications.back') }}
          </button>
          <h3 class="font-semibold">{{ t(item.titleKey) }}</h3>
          <p class="mt-3 text-sm">{{ t(item.messageKey) }}</p>
        } @else {
          <button class="my-3 text-xs text-teal-700" (click)="markAll()">
            {{ t('notifications.markAllRead') }}
          </button>
          @for (item of items(); track item.id) {
            <button
              class="block w-full border-t border-slate-100 py-4 text-left text-sm"
              (click)="select(item)"
            >
              <b>{{ t(item.titleKey) }}</b>
              <p class="mt-1 text-slate-500">{{ t(item.timeKey) }}</p>
            </button>
          } @empty {
            <p class="py-6 text-sm text-slate-500">{{ t('notifications.empty') }}</p>
          }
        }
      </section>
    }
  </div>`,
})
export class NotificationsComponent {
  readonly role = input<'admin' | 'boutique'>('boutique');
  readonly t = inject(LanguageService).t;
  readonly open = signal(false);
  readonly selected = signal<Notification | null>(null);
  readonly items = signal<Notification[]>([]);
  readonly unread = computed(() => this.items().filter((item) => !item.read).length);
  toggle(): void {
    if (!this.open()) this.items.set(this.read());
    this.open.update((value) => !value);
  }
  private read(): Notification[] {
    try {
      const saved = localStorage.getItem('kukuza-notifications-' + this.role());
      if (saved) return notificationSchema.array().parse(JSON.parse(saved));
    } catch {
      /* Ignore malformed stored data. */
    }
    if (!runtimeConfig.enableApiMocks) return [];
    const keys = this.role() === 'admin' ? ['product', 'shop', 'report'] : ['product', 'stock', 'order'];
    return keys.map((key, index) => ({
      id: `${this.role()}-${key}`,
      titleKey: `notifications.${this.role() === 'admin' ? 'admin' : 'shop'}.${key}Title`,
      messageKey: `notifications.${this.role() === 'admin' ? 'admin' : 'shop'}.${key}Message`,
      timeKey:
        index === 0
          ? 'notifications.justNow'
          : index === 1
            ? 'notifications.oneHourAgo'
            : 'notifications.today',
      read: index === 2,
    }));
  }
  private save(): void {
    try {
      localStorage.setItem('kukuza-notifications-' + this.role(), JSON.stringify(this.items()));
    } catch {
      /* Memory remains available. */
    }
  }
  select(item: Notification): void {
    this.items.update((values) =>
      values.map((value) => (value.id === item.id ? { ...value, read: true } : value)),
    );
    this.selected.set(item);
    this.save();
  }
  markAll(): void {
    this.items.update((values) => values.map((value) => ({ ...value, read: true })));
    this.save();
  }
  @HostListener('document:keydown.escape') close(): void {
    this.open.set(false);
  }
}
