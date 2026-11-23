import { Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LanguageService } from '../../core/language.service';
import { SessionService } from '../../core/session.service';
import { IconComponent } from './icon.component';
import { NotificationsComponent } from './notifications.component';
import { SeoService } from '../../core/seo.service';
@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent, NotificationsComponent],
  templateUrl: './private-shell.component.html',
})
export class PrivateShellComponent {
  readonly admin = inject(ActivatedRoute).snapshot.data['admin'] === true;
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  readonly session = inject(SessionService);
  private readonly router = inject(Router);
  readonly menu = signal(false);
  readonly links = this.admin
    ? [
        { path: '/admin/dashboard', key: 'admin.navigation.overview', icon: 'dashboard' },
        { path: '/admin/shops', key: 'admin.navigation.boutiques', icon: 'bag' },
        { path: '/admin/users', key: 'admin.navigation.users', icon: 'user' },
        { path: '/admin/products', key: 'admin.navigation.products', icon: 'bag' },
        { path: '/admin/sales', key: 'admin.navigation.sales', icon: 'dashboard' },
      ]
    : [
        { path: '/shop/dashboard', key: 'shop.dashboard', icon: 'dashboard' },
        { path: '/shop/ventes', key: 'shop.sales', icon: 'bag' },
        { path: '/shop/produits/ajouter', key: 'shop.addProduct', icon: 'plus' },
        { path: '/shop/produits', key: 'shop.products', icon: 'bag' },
      ];
  constructor() {
    inject(SeoService).update(
      this.admin ? 'Administration | KUKUZA' : 'Ma boutique | KUKUZA',
      'Espace privé KUKUZA.',
      this.admin ? '/admin/dashboard' : '/shop/dashboard',
      undefined,
      undefined,
      true,
    );
  }
  async logout(): Promise<void> {
    await this.session.logout();
    if (!this.session.user()) await this.router.navigateByUrl('/auth/login');
  }
  @HostListener('document:keydown.escape') close(): void {
    this.menu.set(false);
  }
}
