import { describe, expect, it } from 'vitest';
import { ShopResponseError } from '@/api/contracts/shop';
import { mapAnalyticsResponse, mapDashboardOverview, mapProduct, mapSaleItem } from './shopMappers';

const product = {
  id: 56, name: 'Robe', price: 45, stock: 3,
  createdAt: '2026-10-26T12:00:00Z', updatedAt: '2026-10-27T12:00:00+00:00',
};
const sale = {
  id: 9, productName: 'Robe', quantity: 2, unitPrice: 45, totalPrice: 90,
  customer: 'Amina', date: '2026-10-26T12:00:00Z', status: 'completed',
};

describe('shop response validation', () => {
  it('maps stable identifiers and dates, including locally saved demo records', () => {
    expect(mapProduct(product)).toMatchObject({ id: '56', price: 45, stock: 3, status: 'low_stock', createdAt: new Date(product.createdAt) });
    expect(mapProduct({ ...product, id: 'demo-product-56', stock: 0, createdAt: new Date(product.createdAt) }))
      .toMatchObject({ id: 'demo-product-56', status: 'out_of_stock' });
    expect(mapProduct({ ...product, price: 0 }).price).toBe(0);
  });

  it.each([
    { id: undefined }, { id: '' }, { id: 0 }, { id: NaN }, { name: '' },
    { price: undefined }, { price: '45' }, { price: -1 }, { price: Infinity },
    { stock: undefined }, { stock: 1.5 }, { stock: -1 },
    { createdAt: undefined }, { updatedAt: 'not-a-date' },
    { createdAt: new Date('invalid') }, { status: 'unknown' },
  ])('rejects invalid product fields: %j', (invalid) => {
    expect(() => mapProduct({ ...product, ...invalid })).toThrow(ShopResponseError);
  });

  it('supports known aliases without replacing provided values', () => {
    const { name, stock, createdAt, updatedAt, ...rest } = product;
    expect(mapProduct({ ...rest, title: name, quantity: stock, created_at: createdAt, updated_at: updatedAt,
      category: { name: 'Vêtements' }, productImages: [{ imageUrl: '/robe.png' }], brand: { id: 7, name: 'Atelier' },
    })).toMatchObject({ name, stock, category: 'Vêtements', image: '/robe.png', boutiqueId: '7', boutiqueName: 'Atelier' });
    expect(mapSaleItem({ ...sale, status: 'paid' })).toMatchObject({ id: '9', status: 'completed', totalPrice: 90 });
  });

  it.each([
    { id: undefined }, { quantity: undefined }, { quantity: 1.5 }, { quantity: 0 },
    { unitPrice: undefined }, { totalPrice: undefined }, { totalPrice: '90' },
    { customer: undefined }, { date: undefined }, { date: '2026-02-30T12:00:00Z' },
    { status: undefined }, { status: 'unrecognized' },
  ])('rejects incomplete sales instead of inventing amounts or statuses: %j', (invalid) => {
    expect(() => mapSaleItem({ ...sale, ...invalid })).toThrow(ShopResponseError);
  });

  it('keeps missing optional metrics distinct from actual zero values', () => {
    const stats = mapAnalyticsResponse({ tr: 0, sold: 0, active_users: 0, variation: 0 }).stats;
    expect(stats).toMatchObject({ totalRevenue: 0, totalSales: 0, activeUsers: 0, revenueChange: 0, dailyRevenue: null, usersChange: null });
  });

  it.each([{}, null, [], { tr: '100', sold: 2, active_users: 3 }, { tr: 100, sold: 2 },
    { tr: 100, sold: 2, active_users: 3, dailyRevenue: 'bad' },
    { tr: 100, sold: 2, active_users: 3, salesData: {} },
    { tr: 100, sold: 2, active_users: 3, salesData: [{ label: 'Lundi' }] },
  ])('rejects malformed totals and chart data: %j', (input) => {
    expect(() => mapAnalyticsResponse(input)).toThrow(ShopResponseError);
  });

  it('maps nested metrics and explicit empty series', () => {
    const response = { stats: { totalRevenue: 90, totalSales: 2, activeUsers: 1 }, salesData: [{ label: 'Lundi', value: 90 }], visitsData: [] };
    expect(mapDashboardOverview(response)).toMatchObject({ salesData: response.salesData, visitsData: [], stats: { dailyRevenue: null } });
  });
});
