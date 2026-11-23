import { beforeEach, describe, expect, it } from 'vitest';
import { FavoritesService, readCart } from './cart.service';

describe('cart storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('drops legacy editorial products from saved carts', () => {
    localStorage.setItem(
      'kukuza-cart',
      JSON.stringify([
        { id: 'best-seller:1:red:M', productId: 1, name: 'Editorial', price: 69.99, quantity: 1 },
      ]),
    );

    expect(readCart()).toEqual([]);
  });

  it('retains valid catalog cart entries', () => {
    const item = { id: 'product:42:M', productId: 42, name: 'Robe', price: 1200, quantity: 2 };
    localStorage.setItem('kukuza-cart', JSON.stringify([item]));

    expect(readCart()).toEqual([item]);
  });

  it('preserves a favorite currency across storage reloads', () => {
    const favorites = new FavoritesService();
    favorites.toggle({
      id: 'best-seller:1',
      name: 'Robe',
      price: 69.99,
      currency: 'EUR',
      image: '/robe.webp',
      href: '/best-sellers/robe',
    });

    expect(new FavoritesService().items()[0]?.currency).toBe('EUR');
  });
});
