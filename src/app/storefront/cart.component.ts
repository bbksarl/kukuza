import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '@/services/orders/orderService';
import { LanguageService } from '../core/language.service';
import { CartService } from './cart.service';
import { IconComponent } from '../shared/ui/icon.component';
@Component({ standalone: true, imports: [RouterLink, IconComponent], templateUrl: './cart.component.html' })
export class CartComponent {
  readonly cart = inject(CartService);
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  readonly location = inject(Location);
  private readonly orders = inject(OrderService);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly order = signal<Awaited<ReturnType<OrderService['create']>> | null>(null);
  async checkout(): Promise<void> {
    if (this.busy() || !this.cart.items().length) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const order = await this.orders.create(this.cart.items());
      this.order.set(order);
      this.cart.clear();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Impossible de créer la commande.');
    } finally {
      this.busy.set(false);
    }
  }
}
