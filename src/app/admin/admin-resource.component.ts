import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminPageBase } from './admin-page-base';
import type { AdminOverview } from '@/features/admin/types';

const sections = ['shops', 'users', 'products'] as const;
type AdminResourceSection = (typeof sections)[number];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-resource.component.html',
})
export class AdminResourceComponent extends AdminPageBase {
  readonly section: AdminResourceSection;
  readonly title: string;
  readonly subtitle: string;
  readonly searchLabel: string;
  readonly items = computed(() => {
    const data = this.data();
    if (!data) return [];
    const list =
      this.section === 'shops'
        ? data.boutiques
        : this.section === 'users'
          ? data.recentUsers
          : data.topProducts;
    const query = this.query.value.toLowerCase();
    return list.filter((item) => JSON.stringify(item).toLowerCase().includes(query));
  });

  constructor() {
    super();
    const candidate = inject(ActivatedRoute).snapshot.data['section'];
    this.section = sections.find((section) => section === candidate) ?? 'shops';
    this.title = `admin.navigation.${this.section}`;
    this.subtitle = `admin.pages.${this.section}Subtitle`;
    this.searchLabel = `admin.search${this.section[0].toUpperCase()}${this.section.slice(1)}`;
    this.load();
  }

  image(
    item:
      | AdminOverview['boutiques'][number]
      | AdminOverview['recentUsers'][number]
      | AdminOverview['topProducts'][number],
  ): string {
    return 'image' in item ? item.image : '/assets/logo-display.webp';
  }

  detail(
    item:
      | AdminOverview['boutiques'][number]
      | AdminOverview['recentUsers'][number]
      | AdminOverview['topProducts'][number],
  ): string {
    if ('owner' in item)
      return `${item.owner} · ${item.products} ${this.lang.text('admin.products')} · ${this.lang.money(item.revenue)}`;
    if ('email' in item) return `${item.email} · ${item.role}`;
    return `${item.brand} · ${item.unitsSold}`;
  }
}
