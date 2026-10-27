import { describe, expect, it } from 'vitest';
import { productPageSchema } from './catalog';

describe('catalogue contract', () => {
  it('retains the server total independently of the current page', () => {
    expect(productPageSchema.parse({ items: [{ id: 1, name: 'Robe', price: 42 }], total: 1200, page: 1, limit: 12 }).total).toBe(1200);
  });
  it('rejects ambiguous arrays and invalid products instead of inventing defaults', () => {
    expect(productPageSchema.safeParse([]).success).toBe(false);
    expect(productPageSchema.safeParse({ items: [{ name: 'Robe', price: -1 }], total: 1, page: 1, limit: 12 }).success).toBe(false);
  });
});
