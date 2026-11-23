import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/app/core/api-error';
import { submitOrder } from './orderService';

const user = {
  id: 21,
  username: 'amina',
  email: 'amina@example.com',
  role: 'customer',
  createdAt: '2026-10-26T00:00:00Z',
};
const items = [{ id: 'product:12:M', productId: 12, name: 'Robe', price: 0.01, quantity: 2, size: 'M' }];
const confirmed = { id: 31, totalAmount: 250, currency: 'EUR' };

let api: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };
const checkout = (cart = items) => submitOrder(cart, api as never);

describe('atomic checkout', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    api = {
      get: vi.fn().mockResolvedValue(user),
      post: vi.fn().mockResolvedValue(confirmed),
    };
  });
  afterEach(() => vi.restoreAllMocks());

  it('submits one checkout without browser-controlled prices or identity', async () => {
    expect(await checkout()).toEqual(confirmed);
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith(
      '/Order/checkout',
      { items: [{ productId: 12, quantity: 2, size: 'M' }] },
      expect.objectContaining({ headers: { 'Idempotency-Key': expect.any(String) } }),
    );
  });

  it('reuses the key after an ambiguous network failure and rotates it after success', async () => {
    api.post.mockRejectedValueOnce(new Error('timeout'));
    await expect(checkout()).rejects.toThrow('timeout');
    const firstKey = api.post.mock.calls[0][2]?.headers;
    await checkout();
    expect(api.post.mock.calls[1][2]?.headers).toEqual(firstKey);
    await checkout();
    expect(api.post.mock.calls[2][2]?.headers).not.toEqual(firstKey);
  });

  it('rejects fractional quantities before creating anything', async () => {
    await expect(checkout([{ ...items[0], quantity: 1.5 }])).rejects.toThrow('quantité');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('rejects editorial best-seller cards as orderable products', async () => {
    await expect(checkout([{ ...items[0], id: 'best-seller:1:red:M', productId: 1 }])).rejects.toThrow(
      'produit ou une quantité',
    );
    expect(api.post).not.toHaveBeenCalled();
  });

  it('restores a persisted checkout key after reloading the page', async () => {
    const key = '9a92ee9d-047c-4b8c-9443-188bd0cb1ccf';
    sessionStorage.setItem(
      'kukuza-checkout:21',
      JSON.stringify({
        key,
        fingerprint: JSON.stringify([{ productId: 12, quantity: 2, size: 'M' }]),
      }),
    );
    await checkout();
    expect(api.post.mock.calls[0][2]?.headers).toEqual({ 'Idempotency-Key': key });
  });

  it('keeps guest checkout local to the cart with an actionable error', async () => {
    api.get.mockRejectedValue(new ApiError(401, 'Expired', null, 'test'));
    await expect(checkout()).rejects.toThrow('Connectez-vous');
    expect(api.post).not.toHaveBeenCalled();
  });
});
