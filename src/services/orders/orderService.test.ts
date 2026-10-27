import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { facadeClient, FacadeHttpError } from '@/api/client';
import { createOrder } from './orderService';

const user = { id: 21, username: 'amina', email: 'amina@example.com', role: 'customer', createdAt: '2026-10-26T00:00:00Z' };
const items = [{ id: 'product:12:M', productId: 12, name: 'Robe', price: 0.01, quantity: 2, size: 'M' }];
const confirmed = { id: 31, totalAmount: 250, currency: 'EUR' };

describe('atomic checkout', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.spyOn(facadeClient, 'get').mockResolvedValue(user);
  });
  afterEach(() => vi.restoreAllMocks());

  it('submits one checkout without browser-controlled prices or identity', async () => {
    const post = vi.spyOn(facadeClient, 'post').mockResolvedValue(confirmed);
    expect(await createOrder(items)).toEqual(confirmed);
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('/Order/checkout', { items: [{ productId: 12, quantity: 2, size: 'M' }] }, expect.objectContaining({ headers: { 'Idempotency-Key': expect.any(String) } }));
  });

  it('reuses the key after an ambiguous network failure and rotates it after success', async () => {
    const post = vi.spyOn(facadeClient, 'post').mockRejectedValueOnce(new Error('timeout')).mockResolvedValue(confirmed);
    await expect(createOrder(items)).rejects.toThrow('timeout');
    const firstKey = post.mock.calls[0][2]?.headers;
    await createOrder(items);
    expect(post.mock.calls[1][2]?.headers).toEqual(firstKey);
    await createOrder(items);
    expect(post.mock.calls[2][2]?.headers).not.toEqual(firstKey);
  });

  it('rejects fractional quantities before creating anything', async () => {
    const post = vi.spyOn(facadeClient, 'post');
    await expect(createOrder([{ ...items[0], quantity: 1.5 }])).rejects.toThrow('quantité');
    expect(post).not.toHaveBeenCalled();
  });

  it('restores a persisted checkout key after reloading the page', async () => {
    const key = '9a92ee9d-047c-4b8c-9443-188bd0cb1ccf';
    sessionStorage.setItem('kukuza-checkout:21', JSON.stringify({
      key, fingerprint: JSON.stringify([{ productId: 12, quantity: 2, size: 'M' }]),
    }));
    const post = vi.spyOn(facadeClient, 'post').mockResolvedValue(confirmed);
    await createOrder(items);
    expect(post.mock.calls[0][2]?.headers).toEqual({ 'Idempotency-Key': key });
  });

  it('keeps guest checkout local to the cart with an actionable error', async () => {
    vi.mocked(facadeClient.get).mockRejectedValue(new FacadeHttpError(401, 'Expired', null, 'test'));
    const post = vi.spyOn(facadeClient, 'post');
    await expect(createOrder(items)).rejects.toThrow('Connectez-vous');
    expect(post).not.toHaveBeenCalled();
  });
});
