import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, ElementRef, HostListener, inject, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/language.service';
import { CartService, FavoritesService } from '../../storefront/cart.service';
import { NAV_ITEMS, groupFilters, type DropdownType, type NavItem } from '@/features/portal/data/catalog';
import { IconComponent } from './icon.component';

@Component({
  selector: 'k-header',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  readonly cart = inject(CartService);
  readonly favorites = inject(FavoritesService);
  readonly router = inject(Router);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly navItems = NAV_ITEMS;
  readonly panel = signal<string | null>(null);
  readonly scrolled = signal(this.browser && (this.document.defaultView?.scrollY ?? 0) > 0);
  readonly currentUrl = signal(this.router.url);
  readonly groupFilters = groupFilters;
  private opener: HTMLElement | null = null;
  query = '';
  constructor() {
    this.sync();
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
        this.close();
        this.sync();
      }
    });
    this.document.documentElement.style.setProperty('--portal-header-height', '64px');
    this.document.documentElement.style.scrollPaddingTop = '64px';
    inject(DestroyRef).onDestroy(() => {
      this.document.documentElement.style.removeProperty('--portal-header-height');
      this.document.documentElement.style.scrollPaddingTop = '';
    });
  }
  private sync(): void {
    this.query = this.router.parseUrl(this.router.url).queryParams['q'] ?? '';
  }
  solid(): boolean {
    return this.scrolled() || this.currentUrl() !== '/';
  }
  toggle(panel: string): void {
    const activeElement = this.document.activeElement;
    this.opener = activeElement instanceof HTMLElement ? activeElement : null;
    this.panel.set(this.panel() === panel ? null : panel);
    if (panel === 'search')
      setTimeout(() => this.element.nativeElement.querySelector<HTMLInputElement>('#header-search')?.focus());
  }
  close(restore = false): void {
    this.panel.set(null);
    if (restore) this.opener?.focus();
  }
  selectNav(item: NavItem): void {
    if (item.dropdownType) this.toggle(item.dropdownType);
    else this.go({ nav: item.navType, filter: null });
  }
  filterGroups(): ReturnType<typeof groupFilters> {
    return groupFilters(this.panel() as DropdownType);
  }
  isFilters(): boolean {
    return this.navItems.some((item) => item.dropdownType === this.panel());
  }
  filterTitle(): string {
    return this.lang.label(this.navItems.find((item) => item.dropdownType === this.panel())?.title);
  }
  go(params: Record<string, string | null>): void {
    void this.router.navigate(['/products'], {
      queryParams: { ...params, page: null },
      queryParamsHandling: 'merge',
    });
    this.close();
  }
  search(): void {
    this.go({ q: this.query.trim() || null });
  }
  @HostListener('window:scroll') onScroll(): void {
    this.scrolled.set((this.document.defaultView?.scrollY ?? 0) > 0);
  }
  @HostListener('document:keydown.escape') escape(): void {
    this.close(true);
  }
  @HostListener('document:mousedown', ['$event']) outside(event: MouseEvent): void {
    if (event.target instanceof Node && !this.element.nativeElement.contains(event.target)) this.close();
  }
  languageKeys(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const options = Array.from(
      this.element.nativeElement.querySelectorAll<HTMLButtonElement>('[role="option"]'),
    );
    const index = options.indexOf(this.document.activeElement as HTMLButtonElement);
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? options.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
    options[next]?.focus();
  }
}
