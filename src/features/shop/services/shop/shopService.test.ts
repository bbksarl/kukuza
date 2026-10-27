import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { requestJson } from '../api/httpClient';
import { shopService } from './shopService';

vi.mock('../api/httpClient', () => ({ requestJson: vi.fn() }));
vi.mock('@/config/runtime', () => ({ runtimeConfig: { enableApiMocks: false } }));
beforeEach(() => {
  localStorage.setItem('kukuza-auth-user', JSON.stringify({ id: 12, brandId: 34 }));
  vi.mocked(requestJson).mockImplementation(async (path) => {
    if (path === '/Brand') return [{ id: 34, userId: 12 }];
    if (path === '/brands/34/categories') return [{ id: 3, name: 'Vetements' }];
    return { id: 56, name: 'Robe', price: 42, stock: 5, brandId: 34 };
  });
});
afterEach(() => { vi.mocked(requestJson).mockReset(); localStorage.clear(); });

it('preserves gender, age range, category and images in product creation', async () => {
  const image = new File(['image'], 'robe.png', { type: 'image/png' });
  await shopService.createProduct({ name: 'Robe', price: 42, quantity: 5, category: 'Vetements', gender: 'Femme', ageRange: 'Adulte', images: [image] });
  const call = vi.mocked(requestJson).mock.calls.find(([, options]) => options?.method === 'POST');
  const body = call?.[1]?.body as FormData;
  expect(call?.[0]).toBe('/brands/34/products');
  expect(body.get('categoryId')).toBe('3');
  expect(body.get('gender')).toBe('Femme');
  expect(body.get('ageRange')).toBe('Adulte');
  expect(body.getAll('images')).toEqual([image]);
});
